export interface RequestOptions {
  url: string;
  timeout?: number;
  msg?: string | ArrayBuffer;
  headers?: {[key: string]: string | string[]};
  [key: string]: any;
}

export interface Response {
  headers?: {[key: string]: string | string[]};
  msg: string;
  status?: number;
}

export interface Requester extends Function {
  (opts: RequestOptions): Promise<Response>;
  (opts: RequestOptions, cb: (e?: Error | null, resp?: Response) => void): void;
  (
    opts: RequestOptions,
    cb?: (e?: Error | null, resp?: Response) => void,
  ): Promise<Response> | void;
  isSupported(): boolean;
}
