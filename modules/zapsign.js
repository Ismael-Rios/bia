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
            .map(signer => `${signer.name}`); // Formata o restante dos signatários
        
        const signerCPF = data.signers
            .filter(signer => signer.email !== "contato@ilhaconnect.net.br") // Exclui MARCOS ASSUNÇÃO
            .map(signer => `${signer.cpf}`); // Formata o restante dos signatários

        const message = `Documento assinado!\n` +
            `ID do Documento: ${documentId}\n` +
            `Cliente: ${signers}\n` +
            `CPF: ${signerCPF}\n` +
            `Arquivo Assinado: ${signedDocumentInfo}`;

        sendMessageToDiscord(client, message, config.CHANNEL_ID_ZAPSIGN);
    }
}

module.exports = { handleZapsignWebhook };
