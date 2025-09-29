// ixcassina.js
const config = require('../config');
const { sendMessageToDiscord } = require('./discord');

function handleIXCassinaWebhook(data, client) {
    const documentName = data.name;

    const filteredSigners = data.signers
        .filter(signers => signers.sign_as !== config.IXCASSINA_SIGNER)
        .map(signers => ({
            name: signers.name,
            phone: signers.phone,
            email: signers.email,
            cpf: signers.cpf
        }));
    
    const signerName = filteredSigners.map(signers.name).join(', ');
    const signerPhone = filteredSigners.map(signers.phone).join(', ');
    const signerEmail = filteredSigners.map(signers.email).join(', ');
    const signerCPF = filteredSigners.map(signers.cpf).join(', ');
    
    const message = {
        color: 39168,
        url: data.files.signed_url,
        title: `Documento assinado: ${documentName}`,
        footer: {
            text: `Status: ${data.status}`
        },
        fields: [
            {
                name: "Nome",
                value: signerName
            },
            {
                name: "Telefone",
                value: signerPhone
            },
            {
                name: "Email",
                value: signerEmail
            },
            {
                name: "CPF",
                value: signerCPF
            }
        ]
    };

    sendMessageToDiscord(client, { embeds: [message] }, config.CHANNEL_ID_IXCASSINA, 'IXC Assina');
}

function handleZapsignWebhook(data, client) {
    const signedDocumentInfo = data.signed_file;
    const documentId = data.external_id;
    const status = data.status;

    // Envia mensagem apenas se o status for 'signed'
    if (status === 'signed') {
        // Filtra e mapeia os signatários
        const filteredSigners = data.signers
            .filter(signer => signer.email !== config.ZAPSIGN_SIGNER)
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

        sendMessageToDiscord(client, { embeds: [message] }, config.CHANNEL_ID_IXCASSINA, 'IXC Assina');
    }
}

module.exports = { handleIXCassinaWebhook };
