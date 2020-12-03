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
      ...params
    ],
    { stdio: 'inherit' },
  );
  if (result.signal) { return 1; }
  return result.status;
}
