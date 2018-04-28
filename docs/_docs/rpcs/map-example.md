---
title: Mapping Over an Array for Batch
category: RPCs
order: 2
---

In this example we use `.map()` to take an array of addresses and give each one the same `eth_getBalance` method and pass them all into `.batch()`.<br>
     
```typescript
getBalances = async (addresses) => {
    const balances = [];

    return new Promise(resolve =>
      this.state.wallet.rpc.batch(
        // doneCallback here
        () => {
          resolve(balances);
        },
        // Map here to get an array of requests and then spread it
        ...addresses.map(addr => [
          { // request method
            method: 'eth_getBalance',
            params: [addr, 'latest'],
          },
          (err, balance) => { // request call back
            if (err) {
              console.error(err);
              return;
            }
            balances.push(balance);
          },
        ]),
      ),
    );
  };
```