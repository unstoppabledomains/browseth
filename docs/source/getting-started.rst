.. _getting-started:

Getting Started
***************
Browseth is a simple JavaScript library for Ethereum.

-----

.. _gs-installation:

Installation
============

From your project directory:

.. code-block:: bash

    yarn add @browseth/browser
  
Import inside relevant project files:

.. code-block:: javascript

    import Browseth from '@browseth/browser'

Choosing an Ethereum RPC (Remote Procedure Call)
================================================
An Ethereum RPC is your gateway to interacting with Ethereum. 

Ethereum nodes have the option to expose a JSON RPC allowing developers to
interact with the Ethereum network.

A local Ethereum node usually exposes a JSON RPC at port 8545. 
There are services like `Infura <https://infura.io/>`_ that provide a public JSON RPC for developers.

.. _gs-initializing:

Initializing Browseth
=====================
Initialize Browseth with an Ethereum RPC url or web3 instance.

By default, Browseth uses http://localhost:8545. 

.. code-block:: javascript

    const beth = new Browseth("https://mainnet.infura.io")
    // or
    const beth = new Browseth(window.web3)

Now Browseth is connected to the Ethereum network!

.. _gs-request-types:

Types of Requests
==================
There are two types of requests to Ethereum: read and writes.

A **call** request is free to call but may not add, 
remove, or change any data in the blockchain. 

A **send** request requires a network fee, but may change the state of the blockchain. 
These methods must be made by a transaction and mined before any changes to the state 
are made. So these methods are subject to fluctuating gas prices, network congestion, 
and miner heuristics.

.. _gs-accounts:

Accounts
========
Accounts are required to make send requests. 

The following account types are supported: private key, ledger, and online.


.. code-block:: javascript

    import PrivateKeySigner from '@browseth/signer-private-key'
    import SignerLedger from '@browseth/signer-ledger'

    beth.useSignerAccount(new PrivateKeySigner(PRIVATE_KEY));
    beth.useSignerAccount(new SignerLedger());
    beth.useOnlineAccount();

.. _gs-sending-ether:

Sending Ether
=============
Once an account is connected to Browseth, you can make send requests.

.. code-block:: javascript

    beth.send({ to: ADDRESS, value: beth.etherToWei('.01') });

.. _gs-contract-instances:

Contract Instances
==================
To interact with contracts, we use contract instances made from our Browseth instance.

.. code-block:: javascript

    const contractInstance = beth.contract(contract.abi, {address: contract.address});

    contractInstance.fn.functionName(params).call().then(console.log); // function call

    contractInstance.fn.functionName(params)
        .send({ value: beth.etherToWei('1') })
        .then(txHash => {
            beth.tx.listen(txHash).then(console.log)
        }); // send then log receipt


