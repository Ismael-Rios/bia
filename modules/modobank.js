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
                value: paymentInfo.amount
            },
            {
                name: "Valor",
                value: `R$ ${data.data.debtorAccount.name}`
            }
            
        ]
    };

    sendMessageToDiscord(client, { embeds: [message] }, config.CHANNEL_ID_MODOBANK);
}

module.exports = { handleModobankWebhook };
