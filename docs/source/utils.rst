.. _utilities:

Utilities
*********

.. code-block:: javascript

    const utils = require('@browseth/utils');

or

.. code-block:: javascript

    import utils from '@browseth/utils';

-----

.. _arrayBuffer:

Array Buffers
=============

An Array Buffer is an Array Buffer.

:sup:`utils.ab` . isBytes ( value [, length] )
    Checks to see if value is bytes and if it matches optional length

:sup:`utils.ab` . fromView ( view )
    Returns an Array Buffer from view

:sup:`utils.ab` . fromBytes ( value [, length] )
    Returns Array Buffer from bytes with optional length

:sup:`utils.ab` . fromUtf8 ( value )
    Returns Array Buffer from fromUtf8

:sup:`utils.ab` . fromUInt ( value )
    Returns Array Buffer from UInt

:sup:`utils.ab` . toUf8 ( value )
    Converts Array Buffer into Utf8

:sup:`utils.ab` . toTwos ( value, size )
    Converts Array Buffer into a two's compliment

:sup:`utils.ab` . stripStart ( value )
    Strips out the start of an Array Buffer

:sup:`utils.ab` . padStart ( value, length [, fillByte] )
    Pads the start of an Array Buffer

:sup:`utils.ab` . padEnd ( value, length [, fillByte] )
    Pads the end of an Array Buffer

:sup:`utils.ab` . concat ( values )
    Concats an array of Array Buffers

.. _address:

Address
=============

Utilities for manipulating addresses

:sup:`utils.address` . isValid ( value )
    Checks if the given value is a valid address

:sup:`utils.address` . from ( value )
    Returns an address from bytes

:sup:`utils.address` . fromAddressAndNonce ( address, nonce )
    Returns an address from an address and nonce

.. _crypto:

Crypto
======

:sup:`utils.crypto` . keccak256 ( value )
    returns the keccak256 of a string

:sup:`utils.crypto` . uuid ( value )
    TODO: uuid is meant for internal use. Not working externally yet.
    returns the uuid of a string

.. _interval:

Interval
========

:sup:`utils.interval` . setUnrefedInterval ( fn, delay [, args] )
    Sets an interval that dies when the function it's wrapped in is finished

:sup:`utils.interval` . setUnrefedTimeout ( fn, delay [, args] )
    Sets a timeout that dies when the function it's wrapped in is finished

.. _param: 

Param
=====

:sup:`utils.param` . toData ( value, length )
    Converts parameters to hex

:sup:`utils.param` . toQuantity ( value )
    Converts parameters to hex string quantity

:sup:`utils.param` . toTag ( value )
    Converts value into a tag

:sup:`utils.param` . isData ( value [, length] )
    Checks if value is data of optional length

:sup:`utils.param` . isQuantity ( value )
    Checks if value is a quantity

:sup:`utils.param` . isTag ( value )
    Checks if value is a tag

:sup:`utils.param` . fromData ( value, length )
    Converts value to uint8Array of length

:sup:`utils.param` . fromQuantity ( value )
    Converts quantity to Big Number

:sup:`utils.param` . fromTag ( value )
    Converts tag to Big Number

.. _rlp: 

RLP
===
RLP (Recursive Length Prefix) is the main encoding method used to serialize objects in Ethereum

:sup:`utils.rlp` . encode ( value )
    Encodes value to Array Buffer

:sup:`utils.rlp` . encodeLength ( len, offset )
    Encodes length to Array Buffer with offset

.. _block-tracker:

Block Tracker
=============
Poll for blocks every 5 seconds until a block number is confirmed. 
Use this class to keep track of block(s). Contains #emitter.

Creating Instances
------------------

new :sup:`Browseth.utils` . BlockTracker ( requestQueue [, confirmationDelay = 0] )
    Request queue is an eth reference. The confirmation delay is the minimum number 
    of confirmed blocks until the block is considered confirmed.

Prototype
---------

:sup:`prototype` . addTracker ( key [, options] )
    Track a block.

    Options may have the following properties:
        
    - **synced** -- 'latest', 'earliest', or block # to track (defaults to 'latest')
    
    - **confirmationDelay** -- minimum # of confirmed blocks until tracked block is considered confirmed

:sup:`prototype` . syncBlockNumber ( )
    Sets the latest block number
    
    emits 'block.number' with block # passed to the event callback
    
    See #emitter

:sup:`prototype` . syncBlocks ( )
    Syncs blocks to latest block

    emits 'block' for every synced block - block is passed to the event callback

    See #emitter

.. _observable:

Observable
==========
Subscribe to value changes with callbacks

Creating Instances
------------------

new :sup:`Browseth.utils` . Observable ( value )
    Create new Observable object with the value to watch. 

Prototype
---------

:sup:`prototype` . subscribe ( fn )
    Add function to list of callbacks on value change.
    returns function to used unsubscribe function

:sup:`prototype` . set ( newValue )
    Set the new value to watch. Triggers subscribed functions

:sup:`prototype` . get ( )
    Gets the current watched value.


.. code-block:: javascript
    :caption: *Example*

    const observable = new Browseth.utils.Observable('123');
    
    const unsubscribe = observable.subscribe(() => console.log('This is an example'));
    
    observable.set('456');  // Sets new value and logs 'This is an example'
    
    unsubscribe(); // unsubscribe earlier subscribed function
    
    observable.set('78'); // Will set new value with no callbacks
    
    observable.get(); // returns '78'

-----

.. _emitter: 

Emitter
=======
Add events with callbacks and trigger those callbacks by emitting events.

Creating Instances
------------------

new :sup:`Browseth.utils` . Emitter ( )
    Create new Emitter object. 

Prototype
---------

:sup:`prototype` . on ( event, fn )
    Add event label and provide callback

:sup:`prototype` . off ( event, fn )
    Remove callback from an event

:sup:`prototype` . onEvery ( fn )
    Provide callback for every emit

:sup:`prototype` . emit ( event [, params] )
    Emit an event and pass parameters to the callbacks

.. code-block:: javascript
    :caption: *Example*

    const emitter = new Browseth.utils.Emitter('123');
    
    emitter.on('test', () => console.log('example'));

    emitter.onEvery(() => console.log('example2'));

    emitter.emit('test') // Console logs 'example' and 'example2'