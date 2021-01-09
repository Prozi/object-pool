# Installation

`npm install @jacekpietal/object-pool --save`

# Usage

```javascript
const ObjectPool = require("@jacekpietal/object-pool");
```

```javascript
const pool = new ObjectPool(
  // you should provide this function
  function factory() {
    // that returns a new object instance
    // can be async
  }
);

// will return value from pool
// if pool empty uses factory function
const object = pool.get();

// returns value to the pool
pool.put(object);

// prints 1
console.log(pool.size);

// removes value from pool
pool.delete(object);

// prints 0
console.log(pool.size);

// pre-fills pool up to size
// useful I think only for async functions
pool.size = 100;

// empties pool
pool.size = 0;

// size manipulations do trigger as required
// `put` and `delete` events for each change
```

## With Promises / async functions

If you want to use async functions be sure to put the same thing you get from the pool.

```javascript
const pool = new ObjectPool(async () => "value");

async function test() {
  const once = pool.get();
  const value1 = await once;

  // put back the promise reference
  pool.put(once);

  const again = pool.get();
  const value2 = await again;

  // prints:
  // {
  //  once: Promise { 'value' },
  //  again: Promise { 'value' },
  //  value1: 'value',
  //  value2: 'value'
  // }
  console.log({ once, again, value1, value2 });
}

test();
```

# Events

```javascript
// all actions are accompanied by EventEmitter events

pool.events.on("get", (value) => {
  console.log({ get: value });
});

pool.events.on("put", (value) => {
  console.log({ put: value });
});

pool.events.on("delete", (value) => {
  console.log({ delete: value });
});
```

# API

```javascript
pool.get(); // returns get value from pool

pool.put(object); // puts put value to end of pool

pool.delete(object); // deletes object from pool manually
```

# Tests

Please check tests for more complicated cases:

```bash
$ yarn test
yarn run v1.22.5
$ jest
 PASS  ./index.spec.js
  GIVEN ObjectPool instance
    ✓ THEN It should create (2 ms)
    WHEN pool.get is called
      ✓ THEN even if pool.size is 0 (1 ms)
      ✓ THEN It should return new instance of factory call
      ✓ THEN events.get should be emitted (1 ms)
    WHEN pool.put is called
      ✓ THEN pool.size should be greater than 0 afterwards
      ✓ THEN events.put should be emitted (1 ms)
    WHEN promise is `put` and then `get` again
      ✓ THEN it still works as expected (1502 ms)
    WHEN pool.size is set to 0 on non-empty pool
      ✓ THEN events.delete should be emitted for each item (1 ms)
    WHEN pool.size is set
      ✓ THEN pool size adjusts and is being filled accordingly (2 ms)
      ✓ THEN pool size adjusts and is being trimmed accordingly (1 ms)

Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        2.668 s
Ran all test suites.
Done in 3.41s.
```

# License

MIT
