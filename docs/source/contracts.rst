.. _contracts:

Contract
********

There are two types of methods that can be called on a Contract:

A **call** method may not add, remove or change any data in the storage. 
These methods are free to call.

A **send** method requires a fee, but may change the state of the blockchain 
or any data in the storage. These methods must be made by a transaction and 
mined before any changes to the state are made. Therefore, these methods are 
subject to fluctuating gas prices, network congestion, and miner heuristics.

.. code-block:: javascript

    const Contract = require('@browseth/contract');
    
.. code-block:: javascript
 
    import Contract from '@browseth/contract';

Creating Instances
------------------

new :sup:`Contract` ( ethRef, contractAbi [, options] )
    Options may have the properties:

    - **bin** --- contract binary (required for contract deployment)

    - **address** --- address of already deployed contract - .send() and .call() will default to this for the {to: address} option

Deploying Contracts
-------------------

:sup:`prototype` . construct ( [params] )
    Takes in constructor parameters for the deploying contract
    returns send() and gas() methods

. send ( [options] )
    deploys contract and returns transaction hash

. gas ( [options] )
    returns the estimated gas for deploying the contract

    Options may have the properties:

    - **chainId** --- set contract binary for contract deployment

    - **gasPrice** --- set address to already deployed contract
   
    - **gas** --- sets the max amount of gas for the transaction
    
.. code-block:: javascript

    import Browseth from '@browseth/browser'
    import Contract from '@browseth/contract'
    import PrivateKeySigner from '@browseth/signer-private-key'

    const beth = new Browseth('https://mainnet.infura.io');
    beth.useSignerAccount(new PrivateKeySigner(PRIVATE_KEY));

    const contractInstance = new Contract(beth, contract.abi, {bin: contract.bin});
    const txHash = await contractInstance.construct().send({ gasPrice: 10000000000});
