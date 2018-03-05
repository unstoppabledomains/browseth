const path = require('path');

exports.rootDir = path.resolve(`${__dirname}/../..`);
exports.pkgsNodeModules = path.resolve(`${exports.rootDir}/packages/node_modules`);
