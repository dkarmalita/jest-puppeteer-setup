const { browserLaunch, browserConnect, browserClose, serverSpawn, jestSpawn } = require('./lib');
const config = require('./config');

const waitForTime = ms => new Promise(r => setTimeout(r, ms));

(async () => {

  // Launching server in a separate thread (see @kard/spa-server for details)
  const server = serverSpawn({ public: 'static', port: config.port });

  // Launching browser
  await browserLaunch({ headless: config.headless }); // ---

  // Executing some payload in the browser
  // await exploreUrl(page, `http://localhost:${port}`);
  jestSpawn();
  console.log('DONE jest')

  // Closing the browser (it can be done from a separate thread too)
  await browserClose(); // ---

  // Killing the server
  server.kill('SIGHUP');
})();
