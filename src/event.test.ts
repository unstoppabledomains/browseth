import * as Event from './event';

let emitter = undefined as Event.Emitter<{__randomValue: string}>;
beforeEach(() => {
  emitter = new Event.Emitter({
    __randomValue: 'hello world!',
  });
});

describe('Events', () => {
  describe('Emitter', () => {
    it('should make a subscription and emit an event to it', () => {
      const aHandle = jest.fn(value => {
        expect(Array.from(arguments)).toEqual([
          'a value',
          {__randomValue: 'hello world!'},
        ]);
      });
      emitter.on('a', aHandle);
      emitter.emit('a', 'a value');
      expect(aHandle).toHaveBeenCalledTimes(1);
    });
  });

  describe('Subscription', () => {
    it('should dispose of itself', () => {
      const aHandle = jest.fn(() => null);
      const subscription = emitter.on('a', aHandle);
      expect(emitter.list('a')).toEqual([{fn: aHandle}]);
      subscription.dispose();
      expect(emitter.list('a')).toEqual([]);
    });
  });
});
