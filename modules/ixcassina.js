const config = require('../config');
const { sendMessageToDiscord } = require('./discord');

function handleIXCassinaWebhook(data, client) {
    const document = data.document;
    const documentName = document.name;
    const documentStatus = document.status;
    const signers = Array.isArray(document.signers) ? document.signers : [];
    
    const filteredSigners = signers
        .filter(signer => signer.sign_as !== config.IXCASSINA_SIGNER)
        .map(signer => ({
            name: signer.name || "Não informado: Nome",
            phone: signer.phone || "Não informado: Telefone",
            email: signer.email || "Não informado: Email",
            cpf: signer.cpf || "Não informado: CPF"
        }));
    
    const signerName = filteredSigners.map(s => s.name).join(', ');
    const signerPhone = filteredSigners.map(s => s.phone).join(', ');
    const signerEmail = filteredSigners.map(s => s.email).join(', ');
    const signerCPF = filteredSigners.map(s => s.cpf).join(', ');

    const signed_url = document.files?.[0]?.signed_url || "URL não disponível";
    
    const message = {
        color: 39168,
        title: `Documento assinado: ${documentName}`,
        url: signed_url,
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
        ],
        footer: {text: `Status: ${documentStatus}`}
    };

    sendMessageToDiscord(client, { embeds: [message] }, config.CHANNEL_ID_IXCASSINA, 'IXC Assina');
}

module.exports = { handleIXCassinaWebhook };