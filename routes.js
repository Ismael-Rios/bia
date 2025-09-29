// Importa os módulos
const modobankModule = require('./modules/modobank');
const ixcassinaModule = require('./modules/zabbix');
const zabbixModule = require('./modules/zabbix');

module.exports = (app, client) => {
    // Rota para o webhook do Modobank
    app.post('/webhook/modobank', (req, res) => {
        modobankModule.handleModobankWebhook(req.body, client);
        res.status(200).send('Webhook do Modobank recebido!');
    });

    // Rota para o webhook do IXC Assina
    app.post('/webhook/ixcassina', (req, res) => {
        ixcassinaModule.handleIXCassinaWebhook(req.body, client);
        res.status(200).send('Webhook do IXC Assina recebido!');
    });

    // Rota para o webhook do Zabbix
    app.post('/webhook/zabbix', (req, res) => {
        zabbixModule.handleZabbixWebhook(req.body, client);
        res.status(200).send('OK');
    });
};
