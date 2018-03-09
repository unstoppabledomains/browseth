import builtins from 'rollup-plugin-node-builtins';
import commonJs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import json from 'rollup-plugin-json';
import nodeResolve from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

import builtinModules from 'builtin-modules';
import tsc from 'typescript';

export default {
  input: 'src/index.ts',
  output: {
    file: 'out/bundle.js',
    format: 'cjs',
  },
  external: [...builtinModules],
  plugins: [
    globals(),
    builtins(),
    json(),
    nodeResolve({ preferBuiltins: true }),
    commonJs(),
    typescript({
      typescript: tsc,
    }),
  ],
};
