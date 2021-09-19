import 'dotenv/config';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';

puppeteer.use(StealthPlugin());

let args = [
  '--disable-dev-shm-usage',
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-accelerated-2d-canvas',
  '--no-first-run',
  '--no-zygote',
  '--single-process',
  '--disable-gpu',
];

function sleep(s: number) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
}

const getRandomBetween = (min: number, max: number): number => {
  return parseInt(Math.random() * (max - min) + min + '');
};

(async () => {
  const lastRunDate =
    fs.existsSync('lastRun.txt') &&
    new Date(fs.readFileSync('lastRun.txt', 'utf-8'));

  // console.log(new Date(), lastRunDate);
  // lastRunDate &&
  //   console.log((new Date().getTime() - lastRunDate.getTime()) / 1000 / 60);
  const headless = 'production' === process.env.NODE_ENV;
  'production' === process.env.NODE_ENV &&
    (await sleep(getRandomBetween(240, 500)));

  const browser = await puppeteer.launch({
    // @ts-ignore
    headless: headless,
    defaultViewport: null,
    args,
  });
  const page = await browser.newPage();

  await page.goto(process.env.URL as string);

  await page.type('input[name="email"]', process.env.EMAIL as string);
  await page.type('input[name="password"]', process.env.PASSWORD as string);
  await page.click('button[type="submit"]');

  const selector = 'div[aria-multiline="true"]';

  await page.waitForSelector(selector, { timeout: 6000 });
  await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });
  await page.waitForSelector(selector, { timeout: 6000 });
  await page.click(selector, { delay: 1000, clickCount: 10 });

  if (lastRunDate) {
    while ((new Date().getTime() - lastRunDate.getTime()) / 1000 / 60 < 122) {
      await sleep(5);
    }
  }

  await page.keyboard.type('!d bump');
  await page.keyboard.press('Enter');

  fs.writeFileSync('lastRun.txt', `${new Date()}`, 'utf-8');
  await page.screenshot({ path: 'discord.png', fullPage: true });
  console.log('finished');

  await browser.close();
})();
