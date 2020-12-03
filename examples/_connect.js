const path = require('path');
const fs = require('fs');
const os = require('os');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

const browserWSEndpoint = fs.readFileSync(path.join(DIR, 'wsEndpoint'), 'utf8');
if (!browserWSEndpoint) {
  throw new Error('wsEndpoint not found');
}

const puppeteer = require('puppeteer');

(async () => {
  const browser = await  puppeteer.connect({ browserWSEndpoint, slowMo: 50 });
  const page = await browser.newPage();
  await page.goto('https://example.com');

  // Get the "viewport" of the page, as reported by the page.
  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio
    };
  });

  console.log('Dimensions:', dimensions);
  await page.close();
  console.log('DONE')
  process.exit(0)
  // await browser.close();
})();