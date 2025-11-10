const { formatDate } = require('../scripts/formatDate');

function sendMessageToDiscord(client, content, channelId, service) {
    const channel = client.channels.cache.get(channelId);
    const now = new Date();

    if (channel) {
        channel.send(content)
            .then(() => {
                console.log(`${formatDate(now)}: ${service} - Mensagem enviada para o Discord!`);
            })
            .catch(error => {
                console.error(`${formatDate(now)}: Erro ao enviar a mensagem:`, error);
            });
    } else {
        console.error(`${formatDate(now)}: ${channelId} - Canal não encontrado!`);
    }
}

function sendMessageToThread(client, message, channelId, originalMessageId, service) {
    // EM CONSTRUÇÃO
}

module.exports = { sendMessageToDiscord, sendMessageToThread };