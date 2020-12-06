// ./node_modules/.bin/ppj --forceBrowserLaunch
const crossSpawn = require('cross-spawn');

module.exports = function jestSpawn(options={}){
  const params = Object.keys(options).map(key => `--${key}=${options[key]}`)

  const result = crossSpawn.sync(
    'npx', [
      'jest',
      '--verbose',
      '--detectOpenHandles',
      '--forceExit',
      // '--maxWorkers=10',
      // '--listTests',
      // '--showConfig',

      // '--testPathPattern="pptr.js"',
      // '--testPathPattern="Profile.pptr.js"',
      // '--testPathPattern="z.api-pptr.js"',

      ...params
    ],
    { stdio: 'inherit' },
  );
  if (result.signal) { return 1; }
  return result.status;
}
