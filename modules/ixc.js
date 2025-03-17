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

// Mapeamento de departamentos para canais do Discord
const canalMap = {
    '1': config.CHANNEL_ID_FINANCEIRO,
    '2': config.CHANNEL_ID_SUPORTE,
    '5': config.CHANNEL_ID_COMERCIAL,
    '6': config.CHANNEL_ID_SUPORTE
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
                // Filtragem de tickets por responsável técnico
                if (config.USERS_MAP[ticket.id_responsavel_tecnico]) { // if (ticket.id_responsavel_tecnico == '0' || ticket.id_responsavel_tecnico == '9') {
                    // Faz uma requisição para obter os dados do cliente
                    const cliente = await getClienteInfo(ticket.id_cliente); // Adicionado o await aqui

                    if (cliente) {
                        const statusDescritivo = statusMap[ticket.su_status] || 'Status Desconhecido';
                        const prioridadeDescritivo = prioridadeMap[ticket.prioridade] || 'Prioridade Desconhecida';

                        const message = {
                            color: 0xff0000,
                            title: `${ticket.id} - ${ticket.titulo}`,
                            description: ticket.menssagem,
                            footer: {
                                text: `Data de criação: ${ticket.data_criacao}`
                            },
                            fields: [
                                {
                                    name: "\u200b",
                                    value: "\u200b"
                                },
                                {
                                    name: "Cliente",
                                    value: cliente.id +'-'+ cliente.razao
                                },
                                {
                                    name: "Status",
                                    value: statusDescritivo,
                                    inline: true
                                },
                                {
                                    name: "Prioridade",
                                    value: prioridadeDescritivo,
                                    inline: true
                                }
                            ]
                        }
                        
                        // Determina o canal com base no departamento do ticket
                        const canalId = canalMap[ticket.id_ticket_setor] || config.CHANNEL_ID_SUPORTE; // Fallback para o canal de suporte se não encontrar

                        // Enviar notificação no Discord
                        sendMessageToDiscord(client, { embeds: [message] }, canalId, 'IXC');
                    } else {
                        console.error("Erro ao obter as informações do cliente.");
                    }
                }
            }
        } else {
            //console.log("Nenhum ticket encontrado.");
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
