const headless = true;
module.exports = {
  // ref: https://www.npmjs.com/package/@kard/spa-server
  server: { port: 3030, public: 'static' }, // original
  // server: { port: 9090, public: 'dist', route: 'client-area' },

  browser: {
    launch: {
      headless,
      devtools: !headless
    },
    connect: {
      slowMo: headless ? 0 : 50
    },
  },
  jestTimeout: 20000000,
  testsQty: {
    d: 100,
    e: 50,
    f: 20,
    g: 10,
  }
}
