import puppeteer from 'puppeteer';
import { config } from 'dotenv';
import sendMessageToTelegram from './TeleGramBot';

config();

const observePage = () => {
  const getLastPost = document.getElementsByClassName(
    'title',
  )[2] as HTMLLinkElement;

  if (getLastPost) {
    const { href, innerText, id } = getLastPost;

    const parsedId = parseInt(id.slice(13, 19), 10);

    return { href, innerText, parsedId };
  }

  return undefined;
};

const delay = async (time: number) => {
  return new Promise(r => setTimeout(r, time));
};

(async () => {
  try {
    const baseURL = process.env.BASE_URL;

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(baseURL as string);

    let newest = 0;
    let count = 0;

    while (true) {
      const target = await page.evaluate(observePage);

      if (target && target.parsedId > newest) {
        newest = target.parsedId;
        console.log('Novo post :)');
        sendMessageToTelegram(target.innerText, target.href);
      }

      await delay(30000);
      await page.reload();
      console.log(`Reloaded ${++count} times`);
    }
  } catch (err) {
    console.log(err);
  }
})();
