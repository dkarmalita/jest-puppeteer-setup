module.exports = function serverSpawn(options={}){
  const params = Object.keys(options).map(key => `--${key}=${options[key]}`)
  child = require('child_process').spawn('npx', ['spa-server', ...params], { timeout:6000 });
  return child
}
