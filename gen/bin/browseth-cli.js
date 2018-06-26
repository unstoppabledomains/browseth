#!/usr/bin/env node

const program = require('commander');
const fs = require('fs-extra');

program.command('create-simple-site <path>').action(path => {
  fs.copySync(`${__dirname}/../sample`, `${process.cwd()}/${path}`);
});

program.parse(process.argv);
