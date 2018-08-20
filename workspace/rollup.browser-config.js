import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'
import json from 'rollup-plugin-json'

const pkg = require(process.cwd() + '/package.json')

// console.log(require.resolve('babel-runtime'))

export default {
  input: process.cwd() + '/index.js',
  output: {
    name: pkg.name
      .match(/[a-z]+/gi)
      .map(word => word.charAt(0).toUpperCase() + word.substr(1).toLowerCase())
      .join(''),
    file: pkg.browser,
    format: 'umd',
    exports: 'named',
  },
  plugins: [
    babel({
      runtimeHelpers: true,
      exclude: ['../**/node_modules/**', '**/*.json'],
    }),
    resolve(),
    commonjs({
      include: ['../**/node_modules/**'],
      namedExports: {
        'text-encoding-shim': ['TextEncoder', 'TextDecoder'],
        // [require.resolve('mipher/dist/sha3.js')]: ['Keccak'],
        elliptic: ['ec'],
        // '../node_modules/babel-runtime/helpers/typeof.js': ['default'],
      },
    }),
    json(),
  ],
}
