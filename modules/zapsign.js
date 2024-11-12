// zapsign.js
const config = require('../config');
const { sendMessageToDiscord } = require('./discord');

function handleZapsignWebhook(data, client) {
    const signedDocumentInfo = data.signed_file;
    const documentId = data.external_id;
    const status = data.status;

    // Envia mensagem apenas se o status for 'signed'
    if (status === 'signed') {
        // Filtra e mapeia os signatários
        const filteredSigners = data.signers
            .filter(signer => signer.email !== "contato@ilhaconnect.net.br")
            .map(signer => ({
                name: signer.name,
                cpf: signer.cpf,
                email: signer.email,
                phoneNumber: signer.phone_number
            }));
        
        // Cria as strings de nomes e CPFs a partir do array filtrado
        const signerName = filteredSigners.map(signer => signer.name).join(', ');
        const signerCPF = filteredSigners.map(signer => signer.cpf).join(', ');
        const signerEmail = filteredSigners.map(signer => signer.email).join(', ');
        const signerPhoneNumber = filteredSigners.map(signer => signer.phoneNumber).join(', ');

        const message = {
            color: 39168,
            url: signedDocumentInfo,
            title: `Documento assinado: ${documentId}`,
            footer: {
                text: `Status: ${status}`
            },
            fields: [
                {
                    name: "CPF",
                    value: signerCPF
                },
                {
                    name: "Cliente",
                    value: signerName
                },
                {
                    name: "Telefone",
                    value: signerPhoneNumber,
                    inline: true
                },
                {
                    name: "Email",
                    value: signerEmail,
                    inline: true
                }
                
            ]
        };

        sendMessageToDiscord(client, { embeds: [message] }, config.CHANNEL_ID_ZAPSIGN, 'Zapsign');
    }
}

module.exports = { handleZapsignWebhook };
