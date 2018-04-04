import {Handler, Request, Response} from './types';

export function isSupported(): boolean {
  return typeof module !== 'undefined' && module.exports;
}

export function handle(
  request: Request,
  cb: (e?: Error | void, resp?: Response) => void,
): void {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      const headers = xhr.getAllResponseHeaders();

      cb(undefined, {
        headers: headers
          .trim()
          .split(/[\r\n]+/)
          .reduce((a: any, v: string) => {
            const [k, ...vals] = v.split(':');
            const hs = vals
              .join(':')
              .split(',')
              .map(h => h.trim());
            return {...a, [k]: hs.length === 1 ? hs : hs[0]};
          }, {}),
        msg: xhr.responseText,
        status: xhr.status,
      });
      return;
    }
    cb(new Error('xhr status error'));
  });

  xhr.addEventListener('timeout', () => {
    cb(new Error('xhr timeout'));
  });
  xhr.addEventListener('error', () => {
    cb(new Error('xhr error'));
  });

  xhr.open('POST', request.url, true);

  if (request.headers) {
    Object.keys(request.headers).forEach(k => {
      const v = request.headers![k];
      xhr.setRequestHeader(k, v instanceof Array ? v.join(', ') : v);
    });
  }
  if (request.timeout) {
    xhr.timeout = request.timeout;
  }

  xhr.send(request.msg);
}
