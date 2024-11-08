// zabbix.js
const config = require('../config');
const { sendMessageToDiscord } = require('./discord');
const fs = require('fs'); // Módulo para manipular arquivos

function handleZabbixWebhook(data, client) {
    // Salvando o conteúdo do POST em um arquivo JSON
    fs.writeFileSync('zabbix_post_data.json', JSON.stringify(data, null, 2), 'utf-8');
    
    /*
    // Formatação e envio da mensagem ao Discord
    const alert = data.alert; // message, subject, sendto
    const event = data.event; // date, id, name, nseverity, opdata, recovery.date, recovery.time, severity, source, tags, time, update.action, update.date, update.message, update.status, update.time, value
    const host = data.host; // ip, name
    const trigger = data.trigger; // description, id

    const message = 
        `${alert.subject}\n` +
        `${alert.message}\n` +
        `Host: ${host.name} [${host.ip}]\n` +
        `Event time: ${event.date} / ${event.time}\n` +
        `Severity: ${event.severity}\n` +
        `Opdata: ${event.opdata}`;
    */

    //const messageTeste = `${data}`;

    sendMessageToDiscord(client, data, config.CHANNEL_ID_ZABBIX);
}

module.exports = { handleZabbixWebhook };
