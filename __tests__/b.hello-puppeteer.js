const { browserConnect } = require('../lib');
const config = require('../config');

jest.setTimeout(config.jestTimeout)

const url = `http://localhost:${config.port}`

it('b. hello puppeteer', async () => {
  const browser = await browserConnect({slowMo: config.slowMo})
  const incognitoCtx = await browser.createIncognitoBrowserContext();
  const page = await incognitoCtx.newPage();

  await page.goto(url, { waitUntil: 'load' });

  // Get the "viewport" of the page, as reported by the page.
  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio
    };
  });

  // console.log('PAYLOAD b: Get Dimensions:', dimensions);
  expect(dimensions).toEqual({ width: 800, height: 600, deviceScaleFactor: 1 })

  await page.close();
})
