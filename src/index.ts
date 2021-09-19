import 'dotenv/config';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

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

  await page.keyboard.type('!d bump');
  await page.keyboard.press('Enter');

  await page.screenshot({ path: 'discord.png', fullPage: true });
  console.log('finished');

  await browser.close();
})();
