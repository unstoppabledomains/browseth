.. _browser:

Browser
*******

.. _browser-initialization:

Initialization
==============
.. code-block:: javascript

    import Browseth from '@browseth/browser';

    const beth = new Browseth();

.. _browser-contract:

Contract
========

:sup:`prototype` . contract ( contractAbi [, options] )
    returns :ref:`contracts` instance.

    Options may have the properties:

    - **bin** --- contract binary (required for contract deployment)

    - **address** --- address of already deployed contract - .send() and .call() will default to this for the {to: address} option

.. _browser-units:

Units
=====
:sup:`prototype` . convert ( fromUnit, value, toUnit ) 
    convert unit of value to unit

:sup:`prototype` . etherToWei ( value ) 
    convert value in ether to wei

:sup:`prototype` . gweiToWei ( value ) 
    convert value in gwei to wei

:sup:`prototype` . weiToEther ( value ) 
    convert value in wei to ether

:sup:`prototype` . toWei ( fromUnit, value ) 
    convert unit of value to wei

:sup:`prototype` . toEther ( fromUnit, value ) 
    convert unit of value to ether

:sup:`prototype` . unitToPow ( unit ) 
    returns the power of the unit relative to wei

.. _browser-accounts:

Accounts
========

:sup:`prototype` . useAccount ( account )
    switch to account

:sup:`prototype` . useOnlineAccount ( onlineAccount )
    switch to online account

:sup:`prototype` . useSignerAccount ( signerAccount ) 
    switch to signer account

:sup:`prototype` . addOnlineAccount ( onlineAccount )
    adds online account to list of accounts

:sup:`prototype` . addSignerAccount ( )
    adds signer account to list of accounts

.. _browser-utils:

Utils
=====

.. _browser-tx:

Addresses
---------

:sup:`prototype` . checksum ( value )
    Returns an address from bytes

:sup:`prototype` . isValidAddress ( value )
    Checks if the given value is a valid address

Crypto
------

:sup:`prototype` . keccak256 ( value )
    returns the keccak256 of a string

:sup:`prototype` . namehash ( name )
    returns the node of a '.eth' domain string

Transaction Listener
--------------------

:sup:`prototype` . tx
    :ref:`tx-listener` instance

.. _browser-block:

Block Tracker
-------------

:sup:`prototype` . block
    :ref:`block-tracker` instance
