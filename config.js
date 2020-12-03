const headless = true;
module.exports = {
  port: 3030,
  jestTimeout: 20000000,
  slowMo: headless ? 0 : 50,
  headless,
}