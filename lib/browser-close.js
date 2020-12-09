const path = require('path');
const fs = require('fs');
const os = require('os');

const sj = require('shelljs');

const browserConst = require('../consts');

const DIR = path.join(os.tmpdir(), browserConst.tmpDirName);

const puppeteer = require('puppeteer');

module.exports = async function browserClose(){
  const browserWSEndpoint = fs.readFileSync(path.join(DIR, browserConst.wsEndpointName), 'utf8');
  if (!browserWSEndpoint) {
    throw new Error('[browserClose] wsEndpoint not found');
  }

  const browser = await  puppeteer.connect({ browserWSEndpoint });
  await browser.close();
  sj.rm('-rf', DIR);
  console.log('DONE close')
};