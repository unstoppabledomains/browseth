// import Browseth from 'browseth';
const Browseth = require('browseth');
const fs = require('fs');
// import * as NodeHttp from './transport/node-http';
// const NodeHttp = require('./transport/node-http');

// import * as fs from 'fs';

// Browseth.transport = NodeHttp;

const f = async () => {
  console.log(Browseth);
  // console.log(Browseth.Fs);
  const ipfs = new Browseth.Fs.Ipfs();
  // console.log(ipfs.getNodeStatus());
  // await ipfs.start();
  // console.log(ipfs.getNodeStatus());
  // const lebron = fs.readFileSync(`${__dirname}/fs/lebron.jpg`);
  // console.log(lebron);
  // const uploaded = await ipfs.upload(lebron);
  // console.log(uploaded);

  while (1) {
    console.log(ipfs.getNodeStatus());
  }
  // const downloaded = await ipfs.download(uploaded[0].hash);
  // console.log(downloaded);
  // fs.writeFileSync(__dirname + '/temp.jpg', downloaded);
  // const u = await ipfs.uploadObject(a);
  // console.log(u);
  // const d = await ipfs.downloadObject(u);
  // console.log(d);
};
f();
