// Importa os módulos
const modobankModule = require('./modules/modobank');
const zapsignModule = require('./modules/zapsign');
const zabbixModule = require('./modules/zabbix');

module.exports = (app, client) => {
    // Rota para o webhook do Modobank
    app.post('/webhook/modobank', (req, res) => {
        modobankModule.handleModobankWebhook(req.body, client);
        res.status(200).send('Webhook do Modobank recebido!');
    });

    // Rota para o webhook do Zapsign
    app.post('/webhook/zapsign', (req, res) => {
        zapsignModule.handleZapsignWebhook(req.body, client);
        res.status(200).send('Webhook do Zapsign recebido!');
    });

    // Rota para o webhook do Zabbix
    app.post('/webhook/zabbix', (req, res) => {
        zabbixModule.handleZabbixWebhook(req.body, client);
        res.status(200).send('Webhook do Zabbix recebido!');
    });
};
