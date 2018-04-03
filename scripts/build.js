#!/usr/bin/env node

const path = require('path');
const rollup = require('rollup');
const rollupAlias = require('rollup-plugin-alias');
const rollupCommonJs = require('rollup-plugin-commonjs');
const rollupFilesize = require('rollup-plugin-filesize');
const rollupJson = require('rollup-plugin-json');
const rollupNodeResolve = require('rollup-plugin-node-resolve');
const rollupReplace = require('rollup-plugin-replace');
const rollupTypescript = require('rollup-plugin-typescript2');
const typescript = require('typescript');

const pkg = require('../package.json');
const projectDir = `${__dirname}/..`;

function createInputOptions(browser) {
  return {
    input: path.resolve(projectDir, 'src/index.ts'),
    treeshake: true,
    external: [
      ...module.builtinModules,
      ...Object.keys(pkg.dependencies),
      ...Object.keys(pkg.devDependencies),
    ],
    plugins: [
      rollupFilesize(),
      // rollupAlias(
      //   builtinModules.reduce(
      //     (a, v) => ({...a, [v]: `${__dirname}/empty`}),
      //     {},
      //   ),
      // ),
      rollupReplace({
        __TEST__: false,
        __BROWSER__: browser,
        __NODE__: !browser,
      }),
      rollupJson(),
      rollupNodeResolve({preferBuiltins: true}),
      rollupCommonJs({
        namedExports: {'node_modules/js-sha3/src/sha3.js': ['keccak256']},
      }),
      rollupTypescript({typescript}),
    ],
  };
}

function createOutput(format, output) {
  return {
    file: path.resolve(projectDir, output),
    format,
    sourcemap: true,
    name: 'Browseth',
  };
}

async function build() {
  for (const [inputConfig, outputConfigs] of [
    [
      createInputOptions(false),
      [
        createOutput('es', 'dist/index.es.js'),
        createOutput('cjs', 'dist/index.js'),
      ],
    ],
    [
      createInputOptions(true),
      [
        createOutput('es', 'dist/browser.es.js'),
        createOutput('cjs', 'dist/browser.js'),
      ],
    ],
  ]) {
    const bundle = await rollup.rollup(inputConfig);

    for (const outputConfig of outputConfigs) {
      await bundle.write(outputConfig);
    }
  }
}

build().catch(console.error);
