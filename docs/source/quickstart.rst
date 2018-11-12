.. _quickstart:

Quickstart
**********
Browseth quickstart for those already familiar with Ethereum development.
New to Ethereum? Check out the getting-started.

----------

.. _qs_installation:

Installation
============

From your project directory:

.. code-block:: bash

    yarn add @browseth/browser
  
Import inside relevant project files:

.. code-block:: javascript

    import Browseth from '@browseth/browser'

.. _qs_initializing:

Initializing Browseth
=====================
Initialize Browseth with an Ethereum RPC url or web3 instance.

By default, Browseth uses http://localhost:8545. 

.. code-block:: javascript

    const beth = new Browseth("https://mainnet.infura.io")
    // or
    const beth = new Browseth(window.web3)


.. _qs_accounts:

Accounts
========
The following account types are supported: private key, ledger, and online.

.. code-block:: javascript

    import PrivateKeySigner from '@browseth/signer-private-key'
    import SignerLedger from '@browseth/signer-ledger'

    beth.useSignerAccount(new PrivateKeySigner(PRIVATE_KEY));
    beth.useSignerAccount(new SignerLedger());
    beth.useOnlineAccount();

.. _qs_sends:

Send requests
=============

.. code-block:: javascript

    beth.send({ to: ADDRESS, value: beth.etherToWei('.01') });

.. _qs-contract-instances:

Contract Instances
==================

.. code-block:: javascript

    const contractInstance = beth.contract(contract.abi, {bin: contract.bin, address: contract.address});

    contractInstance.construct(params).send(); // deploying contract

    contractInstance.fn.functionName(params).call().then(console.log); // function call

    contractInstance.fn.functionName(params)
        .send({ value: beth.etherToWei('1') })
        .then(txHash => {
            beth.tx.listen(txHash).then(console.log)
        }); // send then log receipt


