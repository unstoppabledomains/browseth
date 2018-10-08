.. _signers:

Signers
*******

A **Signer** manages a private/public key pair which is used to cryptographically sign
transactions and prove ownership on the Ethereum network.

-----

.. _private-key:

Private Key Signer
==================

.. code-block:: javascript

    const PrivateKeySigner = require('@browseth/signer-private-key')

or

.. code-block:: javascript

    import PrivateKeySigner from '@browseth/signer-private-key'

Creating Instances
------------------

new :sup:`PrivateKeySigner` ( privateKey )
    Creates a private key signer object from *privateKey*

Prototype
---------

:sup:`prototype` . address ( )
    Returns the address of the signer generated from the privateKey

:sup:`prototype` . signMessage ( message )
    Returns a signed message 

:sup:`prototype` . signTransaction ( [params] )
    Returns a signed transaction

    Parameters may include:

    - **to** 
    
    - **gasPrice** 
    
    - **gasLimit** 
    
    - **nonce** 
    
    - **data** 
    
    - **value** 
    
    - **chainId** 

