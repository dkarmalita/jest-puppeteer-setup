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


## Important parts

`main.js` implements the puppeteer launch pattern within jest tests execution.

`lib/api-mock` implements a puppeteer mock server that can be used for mocking all of the api requests necessary and dropping all non-mocked external calls.


## Mocking API

First of all, we need to prepare some API mock - an array of requests accompanying its responses data. Each mock record must have multiple fields to identify the request uniquely. Usually, it'll be: `host`, `pathname`,  and `method`. But you are free to add all of the fields you need and use them respectively during comparison in the `onGetResponse` handler (see below).

Also, each mock request must have the `response` field within all of the data necessary to respond to this request. The response is the exact piece of data is sending in the response to the identified request. Typically, it contains the following field:

* `status` field within the numerical response status value
* `body` field - a stringified payload object
* `content` field - format identifier string (usually `application/json`)
* `headers` field - object container for all of the headers necessary

For more details on the response structure, please refer to the puppeteer documentation [here](https://pptr.dev/#?product=Puppeteer&version=v5.5.0&show=api-httprequestrespondresponse).

__mock example__
```js
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
```

Next step, we need to prepare a function that can find and return the required mock element within the array. It will get an inbound request and have iterate over the mocks array, find the corresponding mock object, and return it.

__search function example__
```js
const findResponseMock = (req) => (apiMock.find(el => {
  return el.method === req.method
  && el.host === req.url.host
  && el.pathname === req.url.pathname
}) || {}).response
```

Each inbound request has the following fields:
* `url` - parsed `Url` object
* `type` - request type (`fetch`, `xhr`, etc.)
* `method` - the method of the request (`GET`, `POST`, `PUT`, `HEAD`, `DELETE`, `PATCH`)
* `postData` - the request payload or undefined.

Please note that the `OPTIONS` requests are held by the library itself and need no additional mocks.

__request example__
```js
{
  url: Url {
    protocol: 'https:',
    slashes: true,
    auth: null,
    host: 'jsonplaceholder.typicode.com',
    port: null,
    hostname: 'jsonplaceholder.typicode.com',
    hash: null,
    search: null,
    query: null,
    pathname: '/posts/1',
    path: '/posts/1',
    href: 'https://jsonplaceholder.typicode.com/posts/1'
  },
  type: 'fetch',
  method: 'PUT',
  postData: '{"userId":1,"id":1,"title":"MOCK: delectus aut autem","completed":false}'
}
```

NHere we are ready to initialize the API mock server. It takes two parameters: the puppeteer `page` and the options object. The options have to contain the `onGetResponse` field points to the search function prepared above. Additionally, it can contain an `allowExternalRequests` field that prevents requests from being dropped outside the mock.

__initialization pattern__
```js
const { ApiMock } = require('../lib');

  const api = await new ApiMock(page, {
    onGetResponse: findResponseMock,
    // allowExternalRequests: true,
  });
```

At this point, the mock is ready, connected to the page, and will be served during the puppeteer's actions.


### Requests history

API mock contains a request history. This history allows finding a request within, waiting while the request came, and getting out its data.

```js
  const awaitedRequestA = {
    method: 'GET',
    url: {
      host: 'jsonplaceholder.typicode.com',
      pathname: '/todos/1',
    }
  }
  const resultA = api.find(awaitedRequestA) || await api.waitForRequest(awaitedRequestA)
```

Other useful api methods are `getLog()`, `filter(req)`, and `clear()`. 

__Please note__ that `find(req)`, `waitForRequest(req)` and `filter(req)` methods use exact-for-given-fields comparision approuch. It means that all of the fields filled in `req` have exist and have the same value as requested.

