# Very stable and performant jest + puppeteer setup example.

## Clone and run

```sh
git clone https://github.com/dkarmalita/jest-puppeteer-setup.git
cd jest-puppeteer-setup
npm ci
npm t
```

## Testing visibility

Please pay attention to the `config.js` file in the root of the project. It can be used to configure puppeteer's `headless` and `slowMo` parameters useful if you want to see how the browser manipulates by the windows, contexts, and tabs. 