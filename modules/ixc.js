const axios = require('axios');
const cron = require('node-cron');
const base64 = require('base-64');
const config = require('../config');
const { sendMessageToDiscord } = require('./discord');

// Mapeamentos
const statusMap = {
    'N': 'Novo',
    'P': 'Pendente',
    'EP': 'Em progresso',
    'S': 'Solucionado',
    'C': 'Cancelado'
};

const prioridadeMap = {
    'B': 'Baixa',
    'M': 'Normal',
    'A': 'Alta',
    'C': 'Crítica'
};

const departamentoMap = {
    '1': 'Financeiro',
    '2': 'Suporte',
    '5': 'Comercial'
};

// Mapeamento de departamentos para canais do Discord
const canalMap = {
    '1': config.CHANNEL_ID_FINANCEIRO,
    '2': config.CHANNEL_ID_SUPORTE,
    '5': config.CHANNEL_ID_COMERCIAL
};

// Função para buscar informações do cliente pelo ID
async function getClienteInfo(clienteId) {
    const payload = {
        qtype: 'cliente.id',
        query: clienteId,
        oper: '=',
        page: '1',
        rp: '1',
        sortname: 'cliente.id',
        sortorder: 'asc'
    };

    const headers = {
        ixcsoft: 'listar',
        Authorization: `Basic ${base64.encode(config.IXC_API_TOKEN)}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post(config.IXC_API_CLIENTE, payload, { headers });
        if (response.data && response.data.registros && response.data.registros.length > 0) {
            return response.data.registros[0]; // Retorna o primeiro cliente encontrado
        } else {
            console.error("Cliente não encontrado.");
            return clienteId;
        }
    } catch (error) {
        console.error(`Erro ao buscar cliente: ${error}`);
        return null;
    }
}

// Função para buscar atendimentos novos
async function checkNewAtendimentos(client) {
    const date = new Date(Date.now() - 1 * 60000);
    const timeAgo = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)); 
    const localDateTime = timeAgo.toISOString().replace('T', ' ').split('.')[0];
    
    const payload = {
        qtype: 'su_ticket.data_criacao',
        query: localDateTime,
        oper: '>',
        page: '1',
        rp: '5',
        sortname: 'su_ticket.id',
        sortorder: 'asc'
    };

    const headers = {
        ixcsoft: 'listar',
        Authorization: `Basic ${base64.encode(config.IXC_API_TOKEN)}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post(config.IXC_API_SU_TICKET, payload, { headers });

        if (response.data && response.data.registros && response.data.registros.length > 0) {
            for (const ticket of response.data.registros) {
                // Faz uma requisição para obter os dados do cliente
                const cliente = await getClienteInfo(ticket.id_cliente); // Adicionado o await aqui

                if (cliente) {
                    const statusDescritivo = statusMap[ticket.su_status] || 'Status Desconhecido';
                    const prioridadeDescritivo = prioridadeMap[ticket.prioridade] || 'Prioridade Desconhecida';
                    const departamentoDescritivo = departamentoMap[ticket.id_ticket_setor] || 'Departamento Desconhecido';

                    const message =
                        `> **${ticket.id} - ${ticket.titulo}**\n` +
                        `> \n` +
                        `> **Cliente:** ${cliente.id} - ${cliente.razao}\n` +
                        `> **Status:** ${statusDescritivo}\n` +
                        `> **Prioridade:** ${prioridadeDescritivo}\n` +
                        //`> **Departamento:** ${departamentoDescritivo}\n` +
                        //`> **Data de Criação:** ${ticket.data_criacao}\n` +
                        //`> **Mensagem:**\n` +
                        `${ticket.menssagem}`;
                    
                    // Determina o canal com base no departamento do ticket
                    const canalId = canalMap[ticket.id_ticket_setor] || config.CHANNEL_ID_SUPORTE; // Fallback para o canal de suporte se não encontrar

                    // Enviar notificação no Discord
                    sendMessageToDiscord(client, message, canalId);
                } else {
                    console.error("Erro ao obter as informações do cliente.");
                }
            }
        } else {
            console.log("Nenhum ticket encontrado.");
        }
    } catch (error) {
        console.error(`Erro ao buscar tickets: ${error}`);
    }
}

// Função para inicializar o IXC com o client
function initializeIXC(client) {
    cron.schedule('*/1 * * * *', () => {
        checkNewAtendimentos(client);
    });
}

// Exporta a função de inicialização e a função de check
module.exports = { initializeIXC, checkNewAtendimentos };
