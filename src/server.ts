import puppeteer from 'puppeteer';
import TelegramBot from 'node-telegram-bot-api';

const token = '1323258371:AAEQkMbQlVq6oha0sr8sEeUB3Za7zmjpFuI';
const bot = new TelegramBot(token, { polling: true });

const sendMessageToTelegram = async (message: string, href: string) => {
  const formattedMessage = `
  !!!NOVA PROMOÇÃO!!!
  ${message}

  Acesse o link: ${href}
  `;

  bot.sendMessage(-479619799, formattedMessage);
};

(async () => {
  const observePage = () => {
    const link = document.getElementsByClassName('title')[2];

    if (link) {
      const { href, innerText, id } = link;

      const parsedId = parseInt(id.slice(13, 19), 10);
      console.log(parsedId);

      return { href, innerText, parsedId };
    }
  };

  const delay = async (time: number) => {
    return new Promise(r => setTimeout(r, time));
  };

  try {
    const baseURL = 'https://www.hardmob.com.br/forums/407-Promocoes';

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(baseURL);

    let newest = 0;
    let count = 0;

    while (true) {
      const target = await page.evaluate(observePage);

      if (target && target.parsedId > newest) {
        newest = target.parsedId;
        console.log('Novo post :)');
        sendMessageToTelegram(target.innerText, target.href);
      }

      await delay(5000);
      await page.reload();
      console.log(`Reloaded ${++count} times`);
    }
  } catch (err) {
    console.log(err);
  }
})();
