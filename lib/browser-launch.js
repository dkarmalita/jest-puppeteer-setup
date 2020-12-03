const path = require('path');
const fs = require('fs');
const os = require('os');

const sj = require('shelljs');
const puppeteer = require('puppeteer');

const browserConst = require('./browser.const');

// const cliKeyExists = key => (process.argv.filter(el => el.indexOf(key) === 0)[0] || '').substring(key.length);

module.exports = async function browserLaunch(options){
  const DIR = path.join(os.tmpdir(), browserConst.tmpDirName);
  console.log()
  if(fs.existsSync(DIR) && !process.argv.includes('--forceBrowserLaunch')){
    throw new Error('[browserLaunch] wsEndpoint exists! Close the browser or use --forceBrowserLaunch cli key to fix the envirament.')
  }

  sj.rm('-rf', DIR);

  const browser = await puppeteer.launch(options);
  sj.mkdir('-p', DIR)
  fs.writeFileSync(path.join(DIR, browserConst.wsEndpointName), browser.wsEndpoint());
  console.log('DONE launch')
};