const { browserLaunch, browserConnect, browserClose, serverSpawn } = require('./lib');

const waitForTime = ms => new Promise(r => setTimeout(r, ms));

const port = 3030;

const exploreUrl = async (page, url) => {
  await page.goto(url);

  // Get the "viewport" of the page, as reported by the page.
  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio
    };
  });

  console.log('PAYLOAD: Get Dimensions:', dimensions);
}

(async () => {

  // Launching server in a separate thread (see @kard/spa-server for details)
  const server = serverSpawn({ public: 'static', port });

  // Launching browser
  await browserLaunch({ headless: false }); // ---

  // Connecting to the browser (it can be done from a separate thread)
  const browser = await browserConnect({slowMo: 500}); // ---

  // Creating new tab in the browser connected
  const page = await browser.newPage();

  // Executing some payload in the browser
  await exploreUrl(page, `http://localhost:${port}`);

  // Closint the tab opened
  await page.close();
  console.log('DONE payloadm');

  // Some additional delay to look at the browser state
  console.log('Waiting for 2000ms ...')
  await waitForTime(2000);

  // Closing the browser (it can be done from a separate thread too)
  await browserClose(); // ---

  // Killing the server
  server.kill('SIGHUP');
})();
