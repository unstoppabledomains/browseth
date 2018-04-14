import {BN} from 'ethereumjs-util';
import {provider} from 'ganache-core';
import * as keccak from 'keccak';
import {Apis, Browseth, Rpcs, Signers, Wallets} from '.';
import {Default} from './rpc';

test('', async () => {
  const b = new Browseth('https://mainnet.infura.io/mew')
    .addContract(
      'ens',
      '[{"constant":true,"inputs":[{"name":"node","type":"bytes32"}],"name":"resolver","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"node","type":"bytes32"}],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"label","type":"bytes32"},{"name":"owner","type":"address"}],"name":"setSubnodeOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"ttl","type":"uint64"}],"name":"setTTL","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"node","type":"bytes32"}],"name":"ttl","outputs":[{"name":"","type":"uint64"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"resolver","type":"address"}],"name":"setResolver","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"owner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":true,"name":"label","type":"bytes32"},{"indexed":false,"name":"owner","type":"address"}],"name":"NewOwner","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":false,"name":"owner","type":"address"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":false,"name":"resolver","type":"address"}],"name":"NewResolver","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":false,"name":"ttl","type":"uint64"}],"name":"NewTTL","type":"event"}]',
      {
        address: '0x314159265dD8dbb310642f98f50C066173C1259b',
      },
    )
    .addContract(
      'ethRegistrar',
      '[{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"releaseDeed","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"getAllowedTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"unhashedName","type":"string"}],"name":"invalidateName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"hash","type":"bytes32"},{"name":"owner","type":"address"},{"name":"value","type":"uint256"},{"name":"salt","type":"bytes32"}],"name":"shaBid","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"bidder","type":"address"},{"name":"seal","type":"bytes32"}],"name":"cancelBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"entries","outputs":[{"name":"","type":"uint8"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"ens","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_value","type":"uint256"},{"name":"_salt","type":"bytes32"}],"name":"unsealBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"transferRegistrars","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"sealedBids","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"state","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"newOwner","type":"address"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_timestamp","type":"uint256"}],"name":"isAllowed","outputs":[{"name":"allowed","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"finalizeAuction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"registryStarted","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"launchLength","outputs":[{"name":"","type":"uint32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"sealedBid","type":"bytes32"}],"name":"newBid","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"labels","type":"bytes32[]"}],"name":"eraseNode","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_hashes","type":"bytes32[]"}],"name":"startAuctions","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"hash","type":"bytes32"},{"name":"deed","type":"address"},{"name":"registrationDate","type":"uint256"}],"name":"acceptRegistrarTransfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"startAuction","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"rootNode","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"hashes","type":"bytes32[]"},{"name":"sealedBid","type":"bytes32"}],"name":"startAuctionsAndBid","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"inputs":[{"name":"_ens","type":"address"},{"name":"_rootNode","type":"bytes32"},{"name":"_startDate","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"registrationDate","type":"uint256"}],"name":"AuctionStarted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"bidder","type":"address"},{"indexed":false,"name":"deposit","type":"uint256"}],"name":"NewBid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"status","type":"uint8"}],"name":"BidRevealed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"registrationDate","type":"uint256"}],"name":"HashRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"value","type":"uint256"}],"name":"HashReleased","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"name","type":"string"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"registrationDate","type":"uint256"}],"name":"HashInvalidated","type":"event"}]',
      {
        address: '0x6090A6e47849629b7245Dfa1Ca21D94cd15878Ef',
      },
    )
    .addContract(
      'deed',
      '[{"constant":true,"inputs":[],"name":"creationDate","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"destroyDeed","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newOwner","type":"address"}],"name":"setOwner","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"registrar","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"value","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"previousOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newValue","type":"uint256"},{"name":"throwOnFailure","type":"bool"}],"name":"setBalance","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"refundRatio","type":"uint256"}],"name":"closeDeed","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newRegistrar","type":"address"}],"name":"setRegistrar","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_owner","type":"address"}],"payable":true,"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOwner","type":"address"}],"name":"OwnerChanged","type":"event"},{"anonymous":false,"inputs":[],"name":"DeedClosed","type":"event"}]',
      {
        bytecode:
          '60606040526040516020806104fd8339810160405280805160018054600160a060020a03928316600160a060020a031991821617825560008054339094169390911692909217909155426003556005805460ff1916909117905550503460045561048f8061006e6000396000f3006060604052600436106100a35763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166305b3441081146100a85780630b5ab3d5146100cd57806313af4035146100e25780632b20e397146101015780633fa4f24514610130578063674f220f146101435780638da5cb5b14610156578063b0c8097214610169578063bbe4277114610184578063faab9d391461019a575b600080fd5b34156100b357600080fd5b6100bb6101b9565b60405190815260200160405180910390f35b34156100d857600080fd5b6100e06101bf565b005b34156100ed57600080fd5b6100e0600160a060020a0360043516610209565b341561010c57600080fd5b6101146102b2565b604051600160a060020a03909116815260200160405180910390f35b341561013b57600080fd5b6100bb6102c1565b341561014e57600080fd5b6101146102c7565b341561016157600080fd5b6101146102d6565b341561017457600080fd5b6100e060043560243515156102e5565b341561018f57600080fd5b6100e060043561036f565b34156101a557600080fd5b6100e0600160a060020a0360043516610419565b60035481565b60055460ff16156101cf57600080fd5b600154600160a060020a039081169030163180156108fc0290604051600060405180830381858888f19350505050156102075761deadff5b565b60005433600160a060020a0390811691161461022457600080fd5b600160a060020a038116151561023957600080fd5b6001805460028054600160a060020a0380841673ffffffffffffffffffffffffffffffffffffffff19928316179092559091169083161790557fa2ea9883a321a3e97b8266c2b078bfeec6d50c711ed71f874a90d500ae2eaf3681604051600160a060020a03909116815260200160405180910390a150565b600054600160a060020a031681565b60045481565b600254600160a060020a031681565b600154600160a060020a031681565b60005433600160a060020a0390811691161461030057600080fd5b60055460ff16151561031157600080fd5b6004548290101561032157600080fd5b6004829055600154600160a060020a039081169030163183900380156108fc0290604051600060405180830381858888f1935050505080610360575080155b151561036b57600080fd5b5050565b60005433600160a060020a0390811691161461038a57600080fd5b60055460ff16151561039b57600080fd5b6005805460ff1916905561dead6103e8600160a060020a03301631838203020480156108fc0290604051600060405180830381858888f1935050505015156103e257600080fd5b7fbb2ce2f51803bba16bc85282b47deeea9a5c6223eabea1077be696b3f265cf1360405160405180910390a16104166101bf565b50565b60005433600160a060020a0390811691161461043457600080fd5b6000805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a03929092169190911790555600a165627a7a723058200e35026b56800d75e2a0841d00b48a1088b8fc3eb62dbe1ad7faaf701fb7392e0029',
      },
    )
    .addContract(
      'resolver',
      '[{"constant":true,"inputs":[{"name":"interfaceID","type":"bytes4"}],"name":"supportsInterface","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"key","type":"string"},{"name":"value","type":"string"}],"name":"setText","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"node","type":"bytes32"},{"name":"contentTypes","type":"uint256"}],"name":"ABI","outputs":[{"name":"contentType","type":"uint256"},{"name":"data","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"x","type":"bytes32"},{"name":"y","type":"bytes32"}],"name":"setPubkey","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"node","type":"bytes32"}],"name":"content","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"node","type":"bytes32"}],"name":"addr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"node","type":"bytes32"},{"name":"key","type":"string"}],"name":"text","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"contentType","type":"uint256"},{"name":"data","type":"bytes"}],"name":"setABI","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"node","type":"bytes32"}],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"name","type":"string"}],"name":"setName","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"hash","type":"bytes32"}],"name":"setContent","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"node","type":"bytes32"}],"name":"pubkey","outputs":[{"name":"x","type":"bytes32"},{"name":"y","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"node","type":"bytes32"},{"name":"addr","type":"address"}],"name":"setAddr","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"ensAddr","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":false,"name":"a","type":"address"}],"name":"AddrChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":false,"name":"hash","type":"bytes32"}],"name":"ContentChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":false,"name":"name","type":"string"}],"name":"NameChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":true,"name":"contentType","type":"uint256"}],"name":"ABIChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":false,"name":"x","type":"bytes32"},{"indexed":false,"name":"y","type":"bytes32"}],"name":"PubkeyChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"node","type":"bytes32"},{"indexed":true,"name":"indexedKey","type":"string"},{"indexed":false,"name":"key","type":"string"}],"name":"TextChanged","type":"event"}]',
    );

  console.log(await b.c.deed.deploy().send());

  // const label =
  //   '0x8d515966896d5f097a0b0406a2581d05385fee2fd36641cd7a561da827f41d38';
  // const node =
  //   '0xb26b43758ab32caf9929fca40ef9da34da14ce7ed20cb7982dadb825d694957d';

  // const owner = (await browseth.contract.ens.function.owner(node).call())[0];

  // if (owner !== '0x0000000000000000000000000000000000000000') {
  //   const [
  //     state,
  //     deedAddr,
  //     registrationDate,
  //     value,
  //     highestBid,
  //   ] = await browseth.contract.ethRegistrar.function.entries(label).call();

  //   const deedOwner = (await browseth.contract.deed.function.owner(label).call({
  //     to: deedAddr,
  //   }))[0];

  //   const previousDeedOwner = (await browseth.contract.deed.function
  //     .previousOwner()
  //     .call({
  //       to: deedAddr,
  //     }))[0];

  //   const creationDate = (await browseth.contract.deed.function
  //     .creationDate()
  //     .call({
  //       to: deedAddr,
  //     }))[0];

  //   console.log({
  //     state: state.toNumber(),
  //     deedAddr,
  //     registrationDate: registrationDate.toNumber(),
  //     value: value.toString(),
  //     highestBid: highestBid.toString(),
  //     deedOwner,
  //     previousDeedOwner,
  //     creationDate: creationDate.toNumber(),
  //   });

  //   const resolverAddr = (await browseth.contract.ens.function
  //     .resolver(node)
  //     .call())[0];

  //   const interfaces = {
  //     meta: 0x01ffc9a7,
  //     addr: 0x3b3b57de,
  //     content: 0xd8389dc5,
  //     name: 0x691f3431,
  //     abi: 0x2203ab56,
  //     pubkey: 0xc8690233,
  //     text: 0x59d1d43c,
  //   };

  //   const supportsInterface = (await browseth.contract.resolver.function
  //     .supportsInterface(interfaces.addr)
  //     .call({
  //       to: resolverAddr,
  //     }))[0];

  //   console.log(supportsInterface);

  //   const addr = (await browseth.contract.resolver.function.addr(node).call({
  //     to: resolverAddr,
  //   }))[0];

  //   console.log(addr);
  // }

  // const jsonrpc = new Json(Browseth.transport, 'https://mainnet.infura.io/mew');

  // b.c.ens.f.fname().batch.send()

  // jsonrpc.batch(
  //   done,
  //   [{method: 'eth_blockNumber'}, console.log],
  //   [{method: 'net_version'}, console.log],
  // );
  // jsonrpc.promiseBatch(
  //   {method: 'eth_blockNumber'},
  //   {method: 'net_version'},
  // );

  // b.rpc = new Rpcs.Web3(provider());
  // console.log(
  //   await b.c.ens.e.NewOwner().logs('0x' + (5385526).toString(16), 'latest'),
  // );
  // console.log(
  //   (await b.rpc.send(
  //     'eth_getTransactionReceipt',
  //     '0x6d67ad07dbe730f0a442fefb2ff333301c1d002bbf1fbdac4d6cec082c35ed03',
  //   )).logs,
  // );

  // const signerWallet = new SignerWallet(
  //   b.rpc,
  //   new SignerWallet.Signers.PrivateKey(
  //     Buffer.from(
  //       '1234567890123456789012345678901234567890123456789012345678901234',
  //       'hex',
  //     ),
  //   ),
  // );
  // b.wallet = signerWallet;

  // const ledger = new SignerWallet.Signers.Ledger();
  // const account = await ledger.account();
  // console.log(account);
  // const txHash = await b.wallet.send({
  //   to: account,
  //   value: '0x100000000000000000000000',
  // });

  // signerWallet.signer = ledger;
  // b.wallet = signerWallet;

  // const tx = await b.wallet.send({
  //   to: '0x1234567890123456789012345678901234567890',
  //   value: '0x1',
  // });
  // console.log(tx);
  // console.log(await b.rpc.send('eth_getTransactionReceipt', tx));
});
