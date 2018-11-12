.. _contracts:

Contracts
*********

There are two types of methods that can be called on a Contract:

A **call** method may not add, remove or change any data in the storage. 
These methods are free to call.

A **send** method requires a fee, but may change the state of the blockchain 
or any data in the storage. These methods must be made by a transaction and 
mined before any changes to the state are made. Therefore, these methods are 
subject to fluctuating gas prices, network congestion, and miner heuristics.

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
    deploys contract and returns promise resolving transaction hash

. gas ( [options] )
    returns the estimated gas for deploying the contract

    Options may have the properties:

    - **chainId** --- set contract binary for contract deployment

    - **gasPrice** --- set gas price in wei for transaction
   
    - **gas** --- sets the max amount of gas for the transaction
    
.. code-block:: javascript

    import Browseth from '@browseth/browser'
    import Contract from '@browseth/contract'
    import PrivateKeySigner from '@browseth/signer-private-key'

    const beth = new Browseth(eth_rpc);
    beth.useSignerAccount(new PrivateKeySigner(PRIVATE_KEY));

    const contractInstance = new Contract(beth, contract.abi, {bin: contract.bin});
    const txHash = await contractInstance.construct().send({ gasPrice: 10000000000});

Contract Functions
------------------

:sup:`prototype` . fn . functionName ( [params] )
    Takes in parameters for calling contract function.

    returns send() and call() methods.

. send ( [options] )
    makes write call to contract function.

    returns promise resolving transaction hash.

. call ( [options] )
    makes readonly call to contract function

    Options may have the properties:

    - **chainId** --- set contract binary for contract deployment

    - **gasPrice** --- set gas price in wei for transaction
   
    - **gas** --- sets the max amount of gas for the transaction
   
    - **to** --- sets the address of where to send call to (defaults to 'address' in initialization)

.. code-block:: javascript

    const txHash = testContractInstance.fn
        .setA(0x123123123)
        .send();


Contract Events
---------------

:sup:`prototype` . ev . eventName ( [indexed params] )
    Optional indexed parameter values that event log must match.

    returns logs() and subscribe() methods.

    . logs ( fromBlock, toBlock, contractAddress )
        Get logs of contract with block range.
        
    - **fromBlock** --- blockNumber (defaults to 'earliest')
    - **toBlock** --- blockNumber (defaults to 'latest')

    . subscribe ( fromBlock, contractAddress )
        Subscribe to contract events with callback. 
        
        - **fromBlock** --- blockNumber (defaults to 'latest')
        
        returns .on() method
        
        .on ( callback ) 
            Calls callback function when event occurs.


.. code-block:: javascript

    contractInstance.ev
        .ASet({ a: 0x123123123 })
        .logs('earliest', 'latest', contractAddress)
        .then(console.log)

    contractInstance.ev
        .ASet()
        .subscribe('earliest', contractAddress)
        .on(console.log)


   