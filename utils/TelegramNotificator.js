const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.NOTIFICATION_TOKEN, { polling: true });
const targetChatId = process.env.NOTIFICATION_TARGET_CHAT_ID;


const sendNotification = (message) => {
    bot.sendMessage(targetChatId, message)
}

module.exports = { sendNotification };