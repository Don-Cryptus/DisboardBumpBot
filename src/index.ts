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
  return new Promise((resolve) => setTimeout(resolve, s));
}

(async () => {
  const lastRunDate =
    fs.existsSync('lastRun.txt') &&
    new Date(fs.readFileSync('lastRun.txt', 'utf-8'));

  const headless = 'production' === process.env.NODE_ENV;

  const browser = await puppeteer.launch({
    // @ts-ignore
    headless,
    defaultViewport: null,
    args,
  });
  const page = await browser.newPage();

  await page.goto(process.env.URL as string);

  await page.type('input[name="email"]', process.env.EMAIL as string);
  await page.type('input[name="password"]', process.env.PASSWORD as string);
  await page.click('button[type="submit"]');

  const selector = 'div[aria-multiline="true"]';
  const closeButton = '//button[contains(@class, "closeButton")]';
  const closeButtonXpath = '//button[contains(@class, "closeButton")]';

  await page.waitForSelector(selector, { timeout: 6000 });

  try {
    if (await page.waitForXPath(closeButton, { timeout: 6000 })) {
      const elements = await page.$x(closeButtonXpath);
      for (let element of elements) {
        await element.click();
      }
    }
  } catch (error) {}

  try {
    if (await page.waitForXPath(closeButton, { timeout: 6000 })) {
      const elements = await page.$x(closeButtonXpath);
      for (let element of elements) {
        await element.click();
      }
    }
  } catch (error) {}

  try {
    if (await page.waitForXPath(closeButton, { timeout: 6000 })) {
      const elements = await page.$x(closeButtonXpath);
      for (let element of elements) {
        await element.click();
      }
    }
  } catch (error) {}

  if (lastRunDate) {
    while (
      (new Date().getTime() - lastRunDate.getTime()) / 1000 / 60 <
      120.0166666666666667
    ) {
      await sleep(100);
    }
  }

  await page.waitForSelector(selector, { timeout: 6000 });
  await page.click(selector, { delay: 1000, clickCount: 10 });

  await page.keyboard.type('!d bump');
  await page.keyboard.press('Enter');

  fs.writeFileSync('lastRun.txt', `${new Date()}`, 'utf-8');
  await page.screenshot({ path: 'discord.png', fullPage: true });
  console.log('finished');

  await browser.close();
})();
