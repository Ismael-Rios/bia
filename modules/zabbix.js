// zabbix.js
const config = require('../config');
const { sendMessageToDiscord } = require('./discord');
const fs = require('fs'); // Módulo para manipular arquivos

function handleZabbixWebhook(data, client) {
    // POST contendo mensagem já formatada
    sendMessageToDiscord(client, data, config.CHANNEL_ID_ZABBIX);
}

module.exports = { handleZabbixWebhook };
