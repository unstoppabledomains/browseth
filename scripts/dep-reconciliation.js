// built-ins
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

// 3rd party
const builtInModules = require('builtin-modules');
const depcheck = require('depcheck');
const glob = require('glob');
const {default: chalk} = require('chalk');
// local
const paths = require('./config/paths');

const readFilePromisified = promisify(fs.readFile);
const writeFilePromisified = promisify(fs.writeFile);
const globPromisified = promisify(glob);

const rootPkg = JSON.parse(fs.readFileSync(`${paths.rootDir}/package.json`));

async function reconcilePkgs() {
  let hasErrored;
  let errors = [];

  const pkgPaths = await globPromisified(
    `${paths.pkgsNodeModules}/{@*/*,!@*}/package.json`,
  );
  const localPkgs = pkgPaths.map(v =>
    path.dirname(v).replace(paths.pkgsNodeModules + '/', ''),
  );

  await Promise.all(
    pkgPaths.map(async pkgJsonPath => {
      try {
        let pkg = {};

        let dependencies = {};
        let depCheckResults = {missing: []};

        try {
          pkg = JSON.parse(await readFilePromisified(pkgJsonPath));

          depCheckResults = await depcheck(path.dirname(pkgJsonPath), {
            ignoreDirs: ['**/build/**'],
          });
        } catch (e) {
          throw new Error('invalid package.json');
        }

        dependencies = Object.keys(depCheckResults.missing).reduce((a, v) => {
          if (builtInModules.indexOf(v) !== -1) {
            return a;
          }
          if (localPkgs.indexOf(v) !== -1) {
            return {...a, [v]: rootPkg.version};
          } else if (rootPkg.dependencies[v]) {
            return {...a, [v]: rootPkg.dependencies[v]};
          }
          throw new Error(
            `'${pkg.name}' relies on unspecified dependancy '${v}'`,
          );
        }, {});

        await writeFilePromisified(
          pkgJsonPath,
          JSON.stringify(
            Object.assign(pkg, {
              name: path
                .dirname(pkgJsonPath)
                .replace(paths.pkgsNodeModules + '/', ''),
              version: rootPkg.version,
              license: rootPkg.license,
              homepage: rootPkg.homepage,
              repository: rootPkg.repository,
              dependencies:
                Object.keys(dependencies).length !== 0
                  ? dependencies
                  : undefined,
              devDependancies: undefined,
              main: './build/bundle.cjs.js',
            }),
          ),
        );
      } catch (e) {
        hasErrored = true;
        errors.push([`${e.message}:`, chalk.reset(pkgJsonPath)]);
      }
    }),
  );

  if (hasErrored) {
    throw errors;
  }
}

console.log(chalk.cyanBright('Starting dependancy reconciliation...'));
reconcilePkgs()
  .then(() => {
    console.log(
      chalk.greenBright('Dependancies have all been reconciled correctly.'),
    );
  })
  .catch(errors => {
    console.error(chalk.red('Failed to reconcile all packages:\n'));
    errors.map(([msg, ...rest]) =>
      console.error(chalk.redBright(msg), ...rest),
    );
    console.error(
      chalk.red(
        '\nPlease make sure you have installed all dependancies in the package root.',
      ),
    );
  });
