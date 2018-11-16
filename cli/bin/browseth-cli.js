#!/usr/bin/env node

const program = require('commander')
const fs = require('fs-extra')

program.command('create-example <path>').action(path => {
  if (!/[a-z0-9\-_]+/i.test(path)) {
    console.error(
      'Path may only contain letters, numbers, dashes, and underscores.',
    )
    process.exit()
  }
  if (fs.existsSync(`${process.cwd()}/${path}`)) {
    console.error('That path already exists!')
    process.exit()
  }
  fs.copySync(`${__dirname}/../sample_site`, `${process.cwd()}/${path}`)
  console.log(
    `\nSuccessfully generated at '${path}'\n\ncd into '${path}' and run 'yarn' to install dependencies.\nThen run 'yarn start' to begin.\n\nPlease visit '${path}/src/config.json' and update the URL to use your own Infura Api Key.\nYou can retrieve yours by visiting 'https://infura.io'.\n`,
  )
})

// program.command('create-sample-subscription <path>').action(path => {
//   if (!/[a-z0-9\-_]+/i.test(path)) {
//     console.error(
//       'Path may only contain letters, numbers, dashes, and underscores.',
//     )
//     process.exit()
//   }
//   if (fs.existsSync(`${process.cwd()}/${path}`)) {
//     console.error('That path already exists!')
//     process.exit()
//   }
//   fs.copySync(`${__dirname}/../subscription`, `${process.cwd()}/${path}`)
//   console.log(
//     `\nSuccessfully generated at '${path}'\n\ncd into '${path}' and run 'yarn' to install dependencies.\nRun 'yarn geth' for devnet or just 'geth' for mainnet.\nRun 'yarn compile' to build all contracts.\nRun 'yarn deploy' to deploy contracts.\nThen run 'yarn start' to begin.\n\n`,
//   )
// })

program.command('create-sample-wallet <path>').action(path => {
  if (!/[a-z0-9\-_]+/i.test(path)) {
    console.error(
      'Path may only contain letters, numbers, dashes, and underscores.',
    )
    process.exit()
  }
  if (fs.existsSync(`${process.cwd()}/${path}`)) {
    console.error('That path already exists!')
    process.exit()
  }
  fs.copySync(`${__dirname}/../wallet_gen`, `${process.cwd()}/${path}`)
  console.log(
    `\nSuccessfully generated at '${path}'\n\ncd into '${path}' and run 'yarn' to install dependencies.\nRun 'yarn geth' for devnet or just 'geth' for mainnet.\nThen run 'yarn start' to begin.\nRun 'HTTPS=true yarn start' for Ledger support.\n\nPlease visit '${path}/src/config.json' and update the URL to use your own Infura Api Key.\nYou can retrieve yours by visiting 'https://infura.io'.\n`,
  )
})

if (!process.argv.slice(2).length) {
  program.outputHelp()
}

program.parse(process.argv)
