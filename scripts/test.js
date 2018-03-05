process.on('unhandledRejection', err => {
  throw err;
});

const jest = require('jest');
const args = process.argv.slice(2);

if (args.indexOf('--coverage') === -1 && args.indexOf('--watchAll') === -1)
  args.push('--watch');

const createJestConfig = require('../config/jest/create-config');

args.push('--config', JSON.stringify(createJestConfig()));

jest.run(args);
