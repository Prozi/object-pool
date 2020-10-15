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

# Extend class

### to override and use `onNext` and `onBack` pseudo-events.

```javascript
const { ObjectPool } = require("object-pool");

class PoolWithEvents extends ObjectPool {
    onNext(id, value) {
        console.log(id, value);
    }
    onBack(id, value) {
        console.log(id, value);
    }
}
```
