require('isomorphic-fetch')
const { BrowserClient } = require('..')
const fs = require('fs')

const ensAbi =
  '[{"constant": true,"inputs": [{"name":"node","type":"bytes32"}],"name":"resolver","outputs": [{"name":"","type":"address"}],"payable": false,"type":"function"},{"constant": true,"inputs": [{"name":"node","type":"bytes32"}],"name":"owner","outputs": [{"name":"","type":"address"}],"payable": false,"type":"function"},{"constant": false,"inputs": [{"name":"node","type":"bytes32"},{"name":"label","type":"bytes32"},{"name":"owner","type":"address"}],"name":"setSubnodeOwner","outputs": [],"payable": false,"type":"function"},{"constant": false,"inputs": [{"name":"node","type":"bytes32"},{"name":"ttl","type":"uint64"}],"name":"setTTL","outputs": [],"payable": false,"type":"function"},{"constant": true,"inputs": [{"name":"node","type":"bytes32"}],"name":"ttl","outputs": [{"name":"","type":"uint64"}],"payable": false,"type":"function"},{"constant": false,"inputs": [{"name":"node","type":"bytes32"},{"name":"resolver","type":"address"}],"name":"setResolver","outputs": [],"payable": false,"type":"function"},{"constant": false,"inputs": [{"name":"node","type":"bytes32"},{"name":"owner","type":"address"}],"name":"setOwner","outputs": [],"payable": false,"type":"function"},{"inputs": [],"payable": false,"type":"constructor"},{"anonymous": false,"inputs": [{"indexed": true,"name":"node","type":"bytes32"},{"indexed": false,"name":"owner","type":"address"}],"name":"Transfer","type":"event"},{"anonymous": false,"inputs": [{"indexed": true,"name":"node","type":"bytes32"},{"indexed": true,"name":"label","type":"bytes32"},{"indexed": false,"name":"owner","type":"address"}],"name":"NewOwner","type":"event"},{"anonymous": false,"inputs": [{"indexed": true,"name":"node","type":"bytes32"},{"indexed": false,"name":"resolver","type":"address"}],"name":"NewResolver","type":"event"},{"anonymous": false,"inputs": [{"indexed": true,"name":"node","type":"bytes32"},{"indexed": false,"name":"ttl","type":"uint64"}],"name":"NewTTL","type":"event"}]'

const eth = new BrowserClient('https://mainnet.infura.io/mew', {
  maxBufferSize: 10,
})

const ens = eth
  .contract(ensAbi, {
    address: '0x314159265dd8dbb310642f98f50c066173c1259b',
  })
  .construct().abi

Promise.resolve()
  .then(async () => {
    eth.find
  })
  .catch(error => console.error(error))

setInterval(() => {}, 10000)
