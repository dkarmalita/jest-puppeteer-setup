const util = require('util');
const url = require('url');
const Dispatch = require('./dispatch');

const defInspectOpts = { depth: Infinity, colors: true }

let timeoutMaxDefault = 5000;

// TODO: list
// [ ] add default host for reqs without this property given
// [ ] [waitForRequest] compare only by given field
// [ ] add optional test function to the filter, fond or watchForRequest
// [ ] fix timeoutMaxDefault usage (must be a const)
// [ ] [requestsEqual] add custom test finction
// [ ] list of internal hosts
// [x] [createApiMock, RequestsLog] add filter (count, findAll)

const requestsEqual = (r1, r2) => {
  const result = r1.method === r2.method
  && r1.url.host === r2.url.host
  && r1.url.pathname === r2.url.pathname
  return result
}

function RequestsLog(){
  const rLog = []
  const dispatch = new Dispatch()

  this.push = (newReq) => {
    rLog.push(newReq)
    dispatch.send(newReq)
  }

  this.find = (req) => rLog.find(el => requestsEqual(req, el))

  this.filter = (req) => rLog.filter(el => requestsEqual(req, el))

  this.waitForRequest = (req, maxMs) => new Promise(resolve => {
    const unsubscribe = dispatch.subscribe(newReq => {
      if(requestsEqual(req, newReq)){
        unsubscribe();
        resolve(newReq)
      }
    })
    const timeoutMax = maxMs || timeoutMaxDefault;
    setTimeout(
      () => {
        unsubscribe();
        const badReq = util.inspect(req, defInspectOpts)
        throw new Error(`[waitForRequest] timeout ${timeoutMax} exceeded for ${badReq}`) }
      ,timeoutMax
    )
  })

  this.getLog = () => rLog;
}

const isExternalRequestDefault = (req) => req.url.hostname !== 'localhost' && req.url.hostname !== '0.0.0.0';

const createApiMock = async (page, {
  onGetResponse,
  // required, function(req)

  allowExternalRequests,
  // default false

  isExternalRequest,
  // function(req), default ['localhost', '0.0.0.0']

  timeout,
  // default timeoutMaxDefault (5000)

} = {}) => {

  timeoutMaxDefault = timeout || timeoutMaxDefault;

  if(typeof onGetResponse !== 'function'){
    throw new Error('[createApiMock] onGetResponse must be a function')
  }

  if(typeof isExternalRequest === 'undefined'){
    isExternalRequest = isExternalRequestDefault;
  }

  const requestLog = new RequestsLog();

  await page.setRequestInterception(true);
  await page.on('request', async (request) => {
    const req = {
      url: url.parse(await request.url()),
      // pathname: '/p/a/t/h'
      // path: '/p/a/t/h?query=string'
      // host: 'sub.example.com:8080'
      // hostname: 'sub.example.com'
      // ref: https://nodejs.org/api/url.html
      type: await request.resourceType(),
      method: await request.method(),
      postData: await request.postData(),
    };

    requestLog.push(req);

    // find and handle all of the mocked requests
    const response = await onGetResponse(req)
    if(response){
      req.handler = 'MOCK';
      // console.log('MOCKED', req)
      return request.respond(response);
    }

    // handle all of the OPTIONS request
    if (req.method === 'OPTIONS') {
      req.handler = 'OPTIONS';
      // console.log('OPTIONS', req)
      return request.respond({
        content: 'application/json',
        headers: {
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'Access-Control-Allow-Origin': '*',
        },
        status: 204,
      });
    }

    // abort all unhandled external requests to avoid timeouts
    if (!allowExternalRequests && await isExternalRequest(req)) {
      req.handler = 'ABORT_EXTERNAL';
      // console.log('ABORT_EXTERNAL', req)
      return request.abort()
    }

    // continue with the static and other unhandled requests
    // console.log('UNHANDLED', req)
    req.handler = 'CONTINUE';
    return request.continue();
  });

  const { find, waitForRequest, getLog, filter } = requestLog;
  return {
    find,
    waitForRequest,
    getLog,
    filter,
  }
};

function ApiMock(...ags){ return createApiMock(...ags) }

module.exports = ApiMock;
