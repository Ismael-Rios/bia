// modobank.js
const config = require('../config');
const { sendMessageToDiscord } = require('./discord');

function handleModobankWebhook(data, client) {
    const paymentInfo = data.data.payment;

    const message = {
        color: 0xffc800,
        title: `Pagamento recebido via PIX!`,
        footer: {
            text: ` `
        },
        fields: [
            {
                name: "Pagador",
                value: data.data.debtorAccount.name
            },
            {
                name: "Valor",
                value: `R$ ${paymentInfo.amount}`
            }
            
        ]
    };

    sendMessageToDiscord(client, { embeds: [message] }, config.CHANNEL_ID_MODOBANK, 'ModoBank');
}

module.exports = { handleModobankWebhook };
