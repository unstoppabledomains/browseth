import * as http from 'http';
import * as https from 'https';
import * as url from 'url';
import { Requester, RequestOptions, Response } from './types';

function isSupported(): boolean {
  return typeof module !== 'undefined' && module.exports;
}

// tslint:disable-next-line:only-arrow-functions
export const NodeHttp = <Requester>function(opts: any, cb?: any) {
  if (cb) {
    nodeHttpRequest(opts, cb);
    return;
  }

  return new Promise(resolve =>
    nodeHttpRequest(opts, (err, resp) => {
      if (err) {
        throw err;
      }
      resolve(resp);
    }),
  );
};

NodeHttp.isSupported = isSupported;

function nodeHttpRequest(
  opts: RequestOptions,
  cb: (e?: Error | null, resp?: Response) => void,
): void {
  const parsedUrl = url.parse(opts.url);

  const requester = (parsedUrl.protocol === 'https:'
    ? https.request
    : http.request)(
    {
      headers: opts.headers,
      host: parsedUrl.hostname,
      method: 'POST',
      path: parsedUrl.path,
      port: parsedUrl.port ? parseInt(parsedUrl.port, 10) : undefined,
    },
    (resp: http.IncomingMessage) => {
      const chunks: string[] = [];
      resp.on('data', chunk => {
        chunks.push(chunk as string);
      });

      resp.once('end', () => {
        cb(undefined, {
          msg: String.prototype.concat(...chunks),
          status: resp.statusCode,
        });
      });
    },
  );

  if (opts.timeout) {
    requester.on('socket', socket => {
      socket.setTimeout(opts.timeout);
      socket.on('timeout', () => {
        cb(new Error(`timout after ${opts.timeout}`));
        requester.abort();
      });
    });
  }

  if (opts.msg) {
    requester.write(opts.msg);
  }
  requester.end();

  requester.once('error', cb);
}
