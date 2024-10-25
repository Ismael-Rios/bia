// modobank.js
const config = require('../config');
const { sendMessageToDiscord } = require('./discord');

function handleModobankWebhook(data, client) {
    const paymentInfo = data.data.payment;
    const message = 
        `Pagamento recebido via PIX!\n` +
        `Valor: R$ ${paymentInfo.amount}\n` +
        `Pagador: ${data.data.debtorAccount.name}`;

    sendMessageToDiscord(client, message, config.CHANNEL_ID_MODOBANK);
}

module.exports = { handleModobankWebhook };
