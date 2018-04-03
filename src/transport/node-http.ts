import * as http from 'http';
import * as https from 'https';
import * as url from 'url';
import {Handler, Request, Response} from './types';

export default class NodeHttpHandler implements Handler {
  public static isSupported(): boolean {
    return typeof module !== 'undefined' && module.exports;
  }

  public handle(
    request: Request,
    cb: (err: Error | void, response?: Response) => void,
  ) {
    nodeHttpRequest(request, cb);
  }
}

function nodeHttpRequest(
  request: Request,
  cb: (e?: Error | void, resp?: Response) => void,
): void {
  const parsedUrl = url.parse(request.url);
  const httpRequest = (parsedUrl.protocol === 'https:'
    ? https.request
    : http.request)(
    {
      headers: request.headers,
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
  if (request.timeout) {
    httpRequest.on('socket', socket => {
      socket.setTimeout(request.timeout);
      socket.on('timeout', () => {
        cb(new Error(`timout after ${request.timeout}`));
        httpRequest.abort();
      });
    });
  }
  if (request.msg) {
    httpRequest.write(request.msg);
  }
  httpRequest.end();
  httpRequest.once('error', cb);
}
