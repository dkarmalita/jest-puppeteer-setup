const path = require('path');
const fs = require('fs');
const os = require('os');

const sj = require('shelljs');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');

const browserWSEndpoint = fs.readFileSync(path.join(DIR, 'wsEndpoint'), 'utf8');
if (!browserWSEndpoint) {
  throw new Error('wsEndpoint not found');
}

const puppeteer = require('puppeteer');

(async () => {
  const browser = await  puppeteer.connect({ browserWSEndpoint });
  await browser.close();
  sj.rm('-rf', DIR);
  console.log('DONE')
})();