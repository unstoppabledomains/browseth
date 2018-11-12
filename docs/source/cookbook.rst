.. _cookbook:

Cookbook
********

.. _cb_contracts:

Contracts
=========

Example Contract

::

    pragma solidity ^0.4.22;

    contract Test {
        uint256 a;

        event ASet(uint256 indexed a, uint256 aTimesTen);

        constructor(uint256 _a) public {
            a = _a;
        }

        function getA() public view returns (uint256) {
            return a;
        }

        function setA(uint256 _a) public payable {
            a = _a;
            emit ASet(a, a * 10);
        }
    }

Compile the contract to get the contract ABI and binary

Creating Contract Instances

:: 

    import testContractJson from './contract.json';

    const testContractInstance = beth.contract(contract.abi, {bin: contract.bin});

Deploying Contracts

::

    const a = 1231123;

    testContractInstance
    .construct(a)
    .send()
    .then(txHash => {
      beth.tx.listen(txHash)
        .then(receipt => console.log(receipt)
    });

Contract calls

::

    testContractInstance.fn.getA().call({to: contractAddress}).then(console.log)

Contract sends

::

    testContractInstance.fn.setA(123123)
    .send({to: contractAddress, value: beth.ethToWei('.01')})
    .then(txHash => {
      beth.tx.listen(txHash)
        .then(receipt => console.log(receipt)
    });


Read event logs

::

    testContractInstance.ev.ASet()
    .logs('earliest', 'latest')
    .then(console.log)

Subscribe Events

::

    testContractInstance.ev.ASet()
    .subscribe('latest')
    .on(console.log)
