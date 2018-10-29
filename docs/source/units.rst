.. _units:

Units
*****

Unit conversion library

.. code-block:: javascript

    import * as units from '@browseth/units';

You can also import specific functions

.. code-block:: javascript

    import {etherToWei, conversion} from '@browseth/units';

-----

:sup:`units` . convert ( fromUnit, value, toUnit ) 
    convert unit of value to unit

:sup:`units` . etherToWei ( value ) 
    convert value in ether to wei

:sup:`units` . gweiToWei ( value ) 
    convert value in gwei to wei

:sup:`units` . weiToEther ( value ) 
    convert value in wei to ether

:sup:`units` . toWei ( fromUnit, value ) 
    convert unit of value to wei

:sup:`units` . toEther ( fromUnit, value ) 
    convert unit of value to ether

:sup:`units` . unitToPow ( unit ) 
    returns the power of the unit relative to wei

Supported Units:
    wei, kwei, ada, femtoether, mwei, babbage, picoether, gwei, shannon, nanoether, nano, szabo, microether, micro, finney, milliether, milli, ether, kether, grand, einstein, mether, gether, tether