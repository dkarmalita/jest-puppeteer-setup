const path = require('path');
const fs = require('fs');
const os = require('os');

const browserConst = require('./browser.const');

const DIR = path.join(os.tmpdir(), browserConst.tmpDirName);

const puppeteer = require('puppeteer');

// options: https://github.com/puppeteer/puppeteer/blob/main/docs/api.md#puppeteerconnectoptions
module.exports = async function browserConnect(options){
  const browserWSEndpoint = fs.readFileSync(path.join(DIR, browserConst.wsEndpointName), 'utf8');
  if (!browserWSEndpoint) {
    throw new Error('[browserConnect] wsEndpoint not found');
  }

  const browser = await  puppeteer.connect({ ...options, browserWSEndpoint });
  // console.log('DONE connect')
  return browser;
};