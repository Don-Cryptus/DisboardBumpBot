import { Page } from 'puppeteer';
import fs from 'fs';

export const setCookies = async (page: Page) => {
  if (fs.existsSync('cookies.json')) {
    console.log('cookie exists');
    const cookiesString = fs.readFileSync('cookies.json', 'utf-8');
    const cookies = JSON.parse(cookiesString);
    await page.setCookie(...cookies);
  }
};

export const saveCookies = async (page: Page) => {
  const cookies = await page.cookies();
  fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));
};
