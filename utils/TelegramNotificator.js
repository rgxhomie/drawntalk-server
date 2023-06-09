require('dotenv').config();

const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.NOTIFICATION_TOKEN, { polling: true });
const targetChatId = process.env.NOTIFICATION_TARGET_CHAT_ID;


function sendNotification(message) {
    bot.sendMessage(targetChatId, message)
}

module.exports = { sendNotification };