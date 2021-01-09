"use strict";

const ObjectPool = require(".");

describe("GIVEN ObjectPool instance", () => {
  let pool;

  const resolveArgument = "[Promise resolved]";

  function factory() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(resolveArgument), 500);
    });
  }

  beforeEach(() => {
    pool = new ObjectPool(factory);
  });

  it("THEN It should create", () => {
    expect(pool).toBeTruthy();
  });

  describe("WHEN pool.get is called", () => {
    it("THEN even if pool.size is 0", () => {
      expect(pool.size).toBe(0);
    });

    it("THEN It should return new instance of factory call", () => {
      expect(typeof pool.get()).toBe(typeof factory());
    });

    it("THEN events.get should be emitted", async (done) => {
      pool.events.on("get", () => done());

      pool.get();
    });
  });

  describe("WHEN pool.put is called", () => {
    it("THEN pool.size should be greater than 0 afterwards", () => {
      pool.put(false);

      expect(pool.size).toBeGreaterThan(0);
    });

    it("THEN events.put should be emitted", async (done) => {
      pool.events.on("put", () => done());

      pool.put(null);
    });
  });

  describe("WHEN promise is `put` and then `get` again", () => {
    it("THEN it still works as expected", async (done) => {
      const once = pool.get();
      const value = await once;

      setTimeout(() => {
        pool.put(once);

        const again = pool.get();

        expect(typeof again).toBe(typeof once);
        expect(typeof value).toBe(typeof resolveArgument);

        expect(value).toBe(resolveArgument);

        expect(Promise.resolve(once)).toBe(once);
        expect(Promise.resolve(again)).toBe(again);

        done();
      }, 1000);
    });
  });

  describe("WHEN pool.size is set to 0 on non-empty pool", () => {
    // prepare with data
    beforeEach(() => {
      pool.put(null);
      pool.put(null);
      pool.put(null);
    });

    it("THEN events.delete should be emitted for each item", async (done) => {
      let count = pool.size;

      pool.events.on("delete", () => {
        if (!--count) {
          done();
        }
      });

      pool.size = 0;
    });
  });

  describe("WHEN pool.size is set", () => {
    const initialSize = 5;

    // prepare with data
    beforeEach(() => {
      pool.size = initialSize;
    });

    it("THEN pool size adjusts and is being filled accordingly", () => {
      pool.size = initialSize * 10;

      expect(pool.size).toBe(initialSize * 10);
    });

    it("THEN pool size adjusts and is being trimmed accordingly", () => {
      pool.size = 1;

      expect(pool.size).toBe(1);
    });
  });
});
