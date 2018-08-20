import babel from 'rollup-plugin-babel'

const pkg = require(process.cwd() + '/package.json')

// check out https://github.com/rollup/rollup-plugin-babel/issues/148#issuecomment-399696316

const external = [
  ...Object.keys(pkg.peerDependencies || {}),
  ...Object.keys(pkg.dependencies || {}),
]

const makeExternalPredicate = externalArr => {
  if (externalArr.length === 0) {
    return () => false
  }
  const pattern = new RegExp(`^(${externalArr.join('|')})($|/)`)
  return id => pattern.test(id)
}

export default {
  input: process.cwd() + '/index.js',
  external: makeExternalPredicate(external),
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
    },
    {
      file: pkg.module,
      format: 'es',
      exports: 'named',
    },
  ],
  plugins: [
    babel({ runtimeHelpers: true, exclude: ['node_modules/**', '**/*.json'] }),
  ],
}
