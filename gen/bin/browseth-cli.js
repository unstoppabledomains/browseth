#!/usr/bin/env node

const program = require('commander');
const fs = require('fs-extra');

program.command('create-simple-site <path>').action(path => {
  if (!/[a-z0-9\-_]+/i.test(path)) {
    console.error(
      'Path may only contain letters, numbers, dashes, and underscores.',
    );
    process.exit();
  }
  if (fs.existsSync(`${process.cwd()}/${path}`)) {
    console.error('That path already exists!');
    process.exit();
  }
  fs.copySync(`${__dirname}/../sample`, `${process.cwd()}/${path}`);
  console.log(
    `\nSuccessfully generated at '${path}'\n\ncd into '${path}' and run 'yarn' to install dependencies.\nThen run 'yarn start' to begin.\n\nPlease visit '${path}/src/config.json' and update the URL to use your own Infura Api Key.\nYou can retrieve yours by visiting 'https://infura.io'.\n`,
  );
});

program.parse(process.argv);
