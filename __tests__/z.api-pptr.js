const { browserConnect, createApiMock } = require('../lib');
const config = require('../config');

const waitForTime = ms => new Promise(r => setTimeout(r, ms));

jest.setTimeout(config.jestTimeout)

/*
await fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => response.json())
  .then(json => console.log(json))

var data = {userId: 1, id: 1, title: "MOCK: delectus aut autem", completed: false}
var response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
    method: 'PUT', // или 'POST'
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    }
  });
  var json = await response.json();
  console.log('Успех:', JSON.stringify(json));
*/

const url = `http://localhost:${config.server.port}`

const apiMock = [
  {
    host: 'jsonplaceholder.typicode.com',
    pathname: '/todos/1',
    method: 'GET',
    response: {
      body: JSON.stringify({ userId: 1, id: 1, title: "MOCK: delectus aut autem", completed: false }),
      content: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      status: 200,
    }
  },
  {
    host: 'jsonplaceholder.typicode.com',
    pathname: '/posts/1',
    method: 'PUT',
    response: {
      body: JSON.stringify({ userId: 1, id: 1, title: "MOCK: delectus aut autem", completed: false }),
      content: 'application/json',
      headers: { 'Access-Control-Allow-Origin': '*' },
      status: 200,
    }
  }
]

const findResponseMock = (req) => (apiMock.find(el => {
  return el.method === req.method
  && el.host === req.url.host
  && el.pathname === req.url.pathname
}) || {}).response

it('b. api-pptr', async () => {
  const browser = await browserConnect(config.browser.connect)
  const incognitoCtx = await browser.createIncognitoBrowserContext();
  const page = await incognitoCtx.newPage();

  const api = await createApiMock(page, {
    onGetResponse: findResponseMock,
    // allowExternalRequests: true,
  });

  await page.goto(url, { waitUntil: 'load' });

  const awaitedRequestA = {
    method: 'GET',
    url: {
      host: 'jsonplaceholder.typicode.com',
      pathname: '/todos/1',
    }
  }
  const resultA = api.find(awaitedRequestA) || await api.waitForRequest(awaitedRequestA)
  expect(!!resultA).toEqual(true);
  const rQty = api.filter(awaitedRequestA).length
  console.log('RESULT A', rQty, resultA)

  const awaitedRequestB = {
    method: 'PUT',
    url: {
      host: 'jsonplaceholder.typicode.com',
      pathname: '/posts/1',
    }
  }
  const resultB = api.find(awaitedRequestB) || await api.waitForRequest(awaitedRequestB)
  expect(!!resultB).toEqual(true);
  console.log('RESULT B', resultB)

  // Get the "viewport" of the page, as reported by the page.
  const dimensions = await page.evaluate(() => {
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      deviceScaleFactor: window.devicePixelRatio
    };
  });

  // console.log('API_LOG', api.getLog())
  // await waitForTime(50000000);

  // console.log('PAYLOAD b: Get Dimensions:', dimensions);
  expect(dimensions).toEqual({ width: 800, height: 600, deviceScaleFactor: 1 })

  await page.close();
})
