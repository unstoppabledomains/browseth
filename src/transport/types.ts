export interface Request {
  url: string;
  timeout?: number;
  msg?: string | ArrayBuffer;
  headers?: {[key: string]: string | string[]};
}

export interface Response {
  headers?: {[key: string]: string | string[]};
  msg: string;
  status?: number;
}

export interface Handler {
  handle(
    request: Request,
    cb: (err: Error | void, response?: Response) => void,
  ): void;
}
