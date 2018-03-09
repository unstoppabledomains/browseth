import * as Generate from './generate';

test('', () => {
  console.log(
    Generate.generateAbiFunction({
      type: 'function',
      name: 'foo',
      inputs: [
        {
          name: 'cool',
          type: 'uint256',
        },
        {
          name: 'beans',
          type: 'uint256',
        },
      ],
      outputs: [],
    }),
  );
});
