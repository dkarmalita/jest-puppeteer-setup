const path = require('path');
const fs = require('fs');
const os = require('os');

const sj = require('shelljs');
const puppeteer = require('puppeteer');

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup');
sj.rm('-rf', DIR);

(async () => {
  const browser = await puppeteer.launch({headless: false});
  sj.mkdir('-p', DIR)
  fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint());
  console.log('done')
})();