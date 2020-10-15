# Usage

```javascript
const { ObjectPool } = require("object-pool");

const pool = new ObjectPool(factory);

// you should provide this function
function factory() {
    // that returns a new object instance
}

// will return value from pool
// if pool empty uses factory function
const nextValue = pool.next();

// returns value to the pool
pool.back(nextValue);
```

# next and back events

```javascript
pool.events.on("next", (value) => {
    console.log({ next: value });
});

pool.events.on("back", (value) => {
    console.log({ back: value });
});
```
