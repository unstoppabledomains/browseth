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