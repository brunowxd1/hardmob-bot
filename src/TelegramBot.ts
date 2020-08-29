import TelegramBot from 'node-telegram-bot-api';
import { config } from 'dotenv';

config();

const bot = new TelegramBot(process.env.BOT_TOKEN as string, { polling: true });

const sendMessageToTelegram = async (
  message: string,
  href: string,
): Promise<void> => {
  const formattedMessage = `💥 NOVA PROMOÇÃO 💥\n\n${message}\n\nAcesse o link: ${href}`;

  bot.sendMessage(process.env.GROUP_ID as string, formattedMessage);
};

export default sendMessageToTelegram;
