.. _ens:

ENS
***

Ethereum Name Service `(ENS) <http://docs.ens.domains/en/latest/introduction.html#>`_ library for name lookup and standard
resolver interface reading.

.. code-block:: javascript

    const EnsLookup = require('@browseth/ens');

or

.. code-block:: javascript

    import EnsLookup from '@browseth/units';


Creating Instances
------------------

new :sup:`EnsLookup` ( ethRef )
    Initialize EnsLookup object with browseth instance

Prototype
---------

:sup:`prototype` . resolverAddress ( node )
    Returns the address of the node's resolver

:sup:`prototype` . address ( node )
    Returns the address field set in the node's resolver

:sup:`prototype` . name ( node )
    Returns the name set in the node's resolver

:sup:`prototype` . text ( node, key )
    Returns the text of a key in the node's resolver

:sup:`prototype` . supportsInterface ( node, interfaceId )
    Checks if the interfaceId is supported by the node's resolver



