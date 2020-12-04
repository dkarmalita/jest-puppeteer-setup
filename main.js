#!/usr/bin/env node

const { browserLaunch, browserConnect, browserClose, serverSpawn, jestSpawn } = require('./lib');
const config = require('./config');

(async () => {

  // Launching server in a separate thread (see @kard/spa-server for details)
  const server = serverSpawn({ public: 'static', port: config.port });

  // Launching browser
  await browserLaunch({ headless: config.headless }); // ---

  // Executing some payload in the browser
  jestSpawn();
  console.log('DONE jest')

  // Closing the browser (it can be done from a separate thread too)
  await browserClose(); // ---

  // Killing the server
  server.kill('SIGHUP');
})();
