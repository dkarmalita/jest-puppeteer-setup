const util = require('util');
const Dispatch = require('./dispatch');

const defInspectOpts = { depth: Infinity, colors: true };

const timeoutMaxDefault = 5000;

const matchObj = (sample, candidat) => {
  const mismatchVal = (s, c) => (typeof s === 'object' ? !matchObj(s, c) : s !== c);

  /* eslint-disable no-restricted-syntax */
  for (const k in sample) {
    if (mismatchVal(sample[k], candidat[k])) { return false; }
  }

  return true;
};

function RequestsLog() {
  const rLog = [];
  const dispatch = new Dispatch();

  this.push = (newReq) => {
    rLog.push(newReq);
    dispatch.send(newReq);
  };

  this.find = req => rLog.find(el => matchObj(req, el));

  this.filter = req => rLog.filter(el => matchObj(req, el));

  this.waitForRequest = (req, maxMs) => new Promise((resolve) => {
    let timeout = null;
    const unsubscribe = dispatch.subscribe((newReq) => {
      if (matchObj(req, newReq)) {
        if (timeout) { clearTimeout(timeout); }
        unsubscribe();
        resolve(newReq);
      }
    });
    const timeoutMax = maxMs || timeoutMaxDefault;
    timeout = setTimeout(
      () => {
        unsubscribe();
        const badReq = util.inspect(req, defInspectOpts);
        throw new Error(`[waitForRequest] timeout ${timeoutMax} exceeded for ${badReq}`);
      }
      , timeoutMax,
    );
  });

  this.getLog = () => rLog;
}

module.exports = RequestsLog;
