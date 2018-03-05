process.on('unhandledRejection', err => {
  throw err;
});

process.env.NODE_ENV = 'production';

const path = require('path');
const {promisify} = require('util');
const child_process = require('child_process');
const spawn = promisify(child_process.spawn);

const glob = require('glob');
const {default: chalk} = require('chalk');
// local
const paths = require('./config/paths');

const globPromisified = promisify(glob);

const {rollup} = require('rollup');
const rollupCommonJS = require('rollup-plugin-commonjs');
const rollupNodeResolve = require('rollup-plugin-node-resolve');
const rollupTypescript = require('rollup-plugin-typescript');
const rollupBuiltins = require('rollup-plugin-node-builtins');
const rollupGlobals = require('rollup-plugin-node-globals');

const typescript = require('typescript');

const args = process.argv.slice(2);

const useSourceMap = args.indexOf('--sourcemap') !== -1;

function buildPackage({dir, pkg}) {
  return rollup({
    input: path.resolve(dir) + '/index.ts',
    // external,
    plugins: [
      rollupBuiltins(),
      rollupNodeResolve({preferBuiltins: true}),
      rollupCommonJS({
        ignoreGlobal: true,
      }),
      rollupGlobals(),
      rollupTypescript({typescript}),
    ],
  }).then(({write}) =>
    Promise.all([
      write({
        format: 'cjs',
        file: path.resolve(dir, 'build', 'bundle.cjs.js'),
        sourcemap: useSourceMap,
      }),
      write({
        format: 'umd',
        file: path.resolve(dir, 'build', 'bundle.umd.js'),
        name: pkg.name
          .split('-')
          .map(v => v[0].toUpperCase() + v.slice(1))
          .join(''),
        sourcemap: useSourceMap,
      }),
    ]),
  );
}

async function getPackagesToBuild() {
  const globed = await globPromisified(
    `${paths.pkgsNodeModules}/{@*/*,!@*}/package.json`,
  );

  return globed.map(v => ({dir: path.dirname(v), pkg: require(v)}));
}
async function buildAll() {
  for (const payload of await getPackagesToBuild()) {
    console.log(chalk.cyanBright('building', payload.pkg.name));
    await buildPackage(payload).catch(e => {
      console.error(chalk.redBright(`${e}: at:`));
      console.error(`${e.loc.file}:(${e.loc.line},${e.loc.column})\n`);
      console.error(e.frame);
      console.error();
    });
  }
}

buildAll()
  .then(console.log)
  .catch(console.error);
