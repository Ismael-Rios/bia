function sendMessageToDiscord(client, content, channelId) {
    const channel = client.channels.cache.get(channelId);

    if (channel) {
        channel.send(content)
            .then(() => console.log('Mensagem enviada para o Discord!'))
            .catch(error => console.error('Erro ao enviar a mensagem:', error));
    } else {
        console.error('Canal não encontrado!');
    }
}

function sendMessageToThread(client, message, channelId, originalMessageId) {
    const channel = client.channels.cache.get(channelId);

    if (channel) {
        const sentMessage = channel.send(message);
        originalMessageId = sentMessage.id; // Armazena o ID da mensagem original
        console.log('Mensagem enviada para a Thread!');
    } else {
        console.error('Canal não encontrado!');
    }
}

module.exports = { sendMessageToDiscord, sendMessageToThread };