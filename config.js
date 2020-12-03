const headless = true;
module.exports = {
  port: 3030,
  jestTimeout: 20000000,
  slowMo: 0, //headless ? 0 : 50,
  headless: false,
}