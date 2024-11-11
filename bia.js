const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const bodyParser = require('body-parser');
const routes = require('./routes');
const config = require('./config');
const { formatDate } = require('./scripts/formatDate');

// Cria a instância do bot
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

client.login(config.DISCORD_TOKEN);

// Quando o bot estiver pronto
client.once('ready', () => {
    const now = new Date();
    console.log(`${formatDate(now)}: Bia está online!`);
});

// Configura as rotas (passa o client do Discord para o arquivo de rotas)
routes(app, client);

// Inicializa o módulo IXC passando o client
require('./modules/ixc').initializeIXC(client);

app.listen(PORT, () => {
    const now = new Date();
    console.log(`${formatDate(now)}: Servidor rodando na porta ${PORT}`);
});
