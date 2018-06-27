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
  console.log(`Successfully generated at ${path}\n`);
  // go to so and so file and update key
});

program.parse(process.argv);
