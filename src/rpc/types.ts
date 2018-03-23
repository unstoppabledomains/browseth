export interface ApiAbstract {
  [method: string]: {
    params: any[];
    result: any;
  };
}

export interface RequestObject<M extends string = string> {
  jsonrpc: '2.0';
  id: number;
  method: M;
  params: Array<string | object | number | null | boolean>;
}

export const enum ErrorCode {
  ParseError = -32700,
  InvalidRequest = -32600,
  MethodNotFound = -32601,
  InvalidParams = -32602,
  InternalError = -32603,
}

export interface ErrorObject {
  code: ErrorCode;
  message: string;
  data?: any;
}

export interface ResponseObject<R = any> {
  jsonrpc: '2.0';
  id: number;
  result?: R;
  error?: ErrorObject;
}

export interface RequestOptions<
  Api extends ApiAbstract = ApiAbstract,
  Method extends keyof Api = string
> {
  method: Method;
  params: Api[Method]['params'];
  url: string;
  headers?: {[key: string]: string | string[]};
  timeout?: number;
  baseUrl?: string;
  credentials?: {
    username: string;
    password: string;
  };
}

export interface Response<
  Api extends ApiAbstract = ApiAbstract,
  Method extends keyof Api = string
> {
  requestOptions: RequestOptions<Api, Method>;
  result: Api[Method]['result'];
  headers?: {[key: string]: string | string[]};
  status?: number;
  statusText?: string;
}
