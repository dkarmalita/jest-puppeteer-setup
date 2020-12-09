// ./node_modules/.bin/ppj --forceBrowserLaunch
const crossSpawn = require('cross-spawn');

const pptrOwnCliKeys = ['--forceBrowserLaunch']

module.exports = function jestSpawn(options={}){
  const args = process.argv.slice(2).filter(cliKey => !pptrOwnCliKeys.find( el => cliKey.startsWith(el) ))
  console.log('ARGS', args)
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
      ...args,

      ...params
    ],
    { stdio: 'inherit' },
  );
  if (result.signal) { return 1; }
  return result.status;
}
