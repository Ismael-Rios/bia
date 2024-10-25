const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const bodyParser = require('body-parser');
const routes = require('./routes');
const config = require('./config');

// Cria a instância do bot
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

client.login(config.DISCORD_TOKEN);

// Quando o bot estiver pronto
client.once('ready', () => {
    console.log('Bia está online!');
});

// Configura as rotas (passa o client do Discord para o arquivo de rotas)
routes(app, client);

// Inicializa o módulo IXC passando o client
require('./modules/ixc').initializeIXC(client);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
