import {handle} from './transport/xhr';

interface Meta<T> {
  once?: boolean;
  thisArg?: any;
}

interface Handler<T> {
  meta?: Meta<T>;
  fn(value: any, context: T): void;
}

class Subscription<T> {
  constructor(
    protected parent: Emitter,
    public type: string,
    public handler: Handler<T>,
  ) {}

  public dispose() {
    return this.parent.disposeOf(this.type, this.handler.fn);
  }
}

class Emitter<T = any> {
  public currentHandler: Handler<T> | null = null;
  private __handlers: {
    [type: string]: Array<Handler<T>>;
  } = {};

  constructor(public context?: T) {}

  public on(
    type: string,
    fn: (value: any, context: T) => void,
    meta?: Meta<T>,
  ): Subscription<T> {
    const handler = {fn, meta};

    if (this.__handlers[type]) {
      const index = this.__handlers[type].findIndex(h => h.fn === fn);
      if (index >= 0) {
        this.__handlers[type][index] = handler;
      } else {
        this.__handlers[type].push(handler);
      }
    } else {
      this.__handlers[type] = [handler];
    }

    return new Subscription(this, type, handler);
  }

  public once(type: string, fn: (value: any, context: T) => void) {
    return this.on(type, fn, {once: true});
  }

  public list(type: string): Array<Handler<T>> {
    return this.__handlers[type];
  }

  public disposeOf(type: string, fn: Function) {
    if (this.__handlers[type]) {
      this.__handlers[type].splice(
        this.__handlers[type].findIndex(handler => handler.fn === fn),
      );
    }
  }

  public disposeOfAll(type?: string) {
    if (type) {
      delete this.__handlers[type];
    } else {
      this.__handlers = {};
    }
  }

  public emit(type: string, value?: any) {
    if (this.__handlers[type]) {
      for (const handler of this.__handlers[type]) {
        if (handler) {
          this.currentHandler = handler;
          this.__emitToHandler(handler, type, value);
        }
        this.currentHandler = null;
      }
    }
  }

  protected __emitToHandler(
    handler: Handler<T>,
    type: string,
    value?: any,
  ): void {
    if (!handler.meta) {
      handler.fn(value, this.context!);
      return;
    }

    handler.fn.call(handler.meta.thisArg, value, this.context);
    if (handler.meta.once) {
      this.disposeOf(type, handler.fn);
    }
  }
}

export {Emitter, Subscription, Handler, Meta};
