// zapsign.js
const config = require('../config');
const { sendMessageToDiscord } = require('./discord');

function handleZapsignWebhook(data, client) {
    const signedDocumentInfo = data.signed_file;
    const documentId = data.external_id;
    const status = data.status;

    // Envia mensagem apenas se o status for 'signed'
    if (status === 'signed') {
        // Filtra apenas os signatários que têm status 'signed'
        const signers = data.signers
            .filter(signer => signer.email !== "contato@ilhaconnect.net.br") // Exclui MARCOS ASSUNÇÃO
            .map(signer => `${signer.name}`) // Formata o restante dos signatários
            .join(', '); // Juntando os nomes em uma string
        
        const signerCPF = data.signers
            .filter(signer => signer.email !== "contato@ilhaconnect.net.br") // Exclui MARCOS ASSUNÇÃO
            .map(signer => `${signer.cpf}`) // Formata o restante dos signatários
            .join(', '); // Juntando os CPFs em uma string

        const message = {
            color: 39168,
            url: signedDocumentInfo,
            title: `Documento assinado: ${documentId}`,
            footer: {
                text: `Status: ${status}`
            },
            fields: [
                {
                    name: "Cliente",
                    value: signers
                },
                {
                    name: "CPF",
                    value: signerCPF
                }
            ]
        };

        sendMessageToDiscord(client, { embeds: [message] }, config.CHANNEL_ID_ZAPSIGN);
    }
}

module.exports = { handleZapsignWebhook };
