import {
  Requester,
  RequestOptions,
  Response as TransportResponse,
} from './types';

function isSupported(): boolean {
  return (
    typeof Response !== 'undefined' &&
    Response.prototype.hasOwnProperty('body') &&
    typeof Headers === 'function'
  );
}

// tslint:disable-next-line:only-arrow-functions
export const Fetch = function(opts: any, cb?: any) {
  if (cb) {
    fetchRequest(opts).then(resp => cb(undefined, resp), cb);
    return;
  }

  return fetchRequest(opts);
} as Requester;

Fetch.isSupported = isSupported;

async function fetchRequest(opts: RequestOptions): Promise<TransportResponse> {
  const promises = [
    fetch(opts.url, {
      body: opts.msg,
      credentials: 'same-origin',
      headers:
        opts.headers &&
        new Headers(
          Object.keys(opts.headers).map(v => {
            const value = opts.headers![v];
            return typeof value === 'string'
              ? [v, value]
              : [v, value.join(', ')];
          }),
        ),
    })
      .then(resp => {
        if (resp.ok !== true) {
          throw new Error(`Not ok resp.status<${resp.status}>`);
        }
        return resp;
      })
      .then(async resp => ({
        headers: [...resp.headers.entries()].reduce(
          (a, [k, v]) => ({...a, [k]: v}),
          {},
        ),
        msg: await resp.text(),
        status: resp.status,
      })),
  ];

  if (opts.timeout) {
    promises.push(new Promise((_, r) => setTimeout(r, opts.timeout)));
  }

  return Promise.race(promises);
}
