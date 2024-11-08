// zabbix.js
const config = require('../config');
const { sendMessageToDiscord } = require('./discord');
const fs = require('fs'); // Módulo para manipular arquivos

function handleZabbixWebhook(data, client) {    
    /*
    // ALERT: message, subject, sendto
    const alert = data.alert || {}; 
    // EVENT: date, id, name, nseverity, opdata, recovery.date, recovery.time, severity, source, tags, time, update.action, update.date, update.message, update.status, update.time, value
    const event = data.event || {}; 
    // HOST: ip, name
    const host = data.host || {}; 
    // TRIGGER: description, id
    const trigger = data.trigger || {}; 

    const message = 
        `${alert.subject || ''}\n` +
        `${alert.message || ''}\n` +
        `Host: ${host.name || ''} [${host.ip}]\n` +
        `Event time: ${event.date || ''} / ${event.time}\n` +
        `Severity: ${event.severity || ''}\n` +
        `Opdata: ${event.opdata || ''}`;
    */

    // POST contendo mensagem já formatada
    sendMessageToDiscord(client, data, config.CHANNEL_ID_ZABBIX);
}

module.exports = { handleZabbixWebhook };
