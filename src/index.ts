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

(async () => {
  const browser = await puppeteer.launch({
    // @ts-ignore
    headless: false,
    defaultViewport: null,
    args,
  });
  const page = await browser.newPage();

  await page.goto(process.env.URL as string);

  await page.type('input[name="email"]', process.env.EMAIL as string);
  await page.type('input[name="password"]', process.env.PASSWORD as string);
  await page.click('button[type="submit"]');

  await page.waitForSelector('div[aria-label="Message #bot"]', {
    timeout: 6000,
  });
  await page.reload({
    waitUntil: ['networkidle0', 'domcontentloaded'],
    timeout: 1000,
  });

  await page.click('div[aria-label="Message #bot"]', { delay: 1000 });
  await page.keyboard.type('!d bump');
  await page.keyboard.press('Enter');

  await page.screenshot({ path: 'discord.png', fullPage: true });
  console.log('finished');

  // await browser.close();
})();
