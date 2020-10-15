const { ObjectPool } = require(".");

describe("GIVEN ObjectPool instance", () => {
  let pool;

  beforeEach(() => {
    pool = new ObjectPool(() => true);
  });

  it("THEN It should create", () => {
    expect(pool).toBeTruthy();
  });

  describe("WHEN pool.next is called", () => {
    it("THEN even if objects size is 0", () => {
      expect(pool.objects.size).toBe(0);
    });

    it("THEN It should return new instance of object", () => {
      expect(pool.next()).toBe(true);
    });

    it("THEN events.next should be emitted", async (done) => {
      pool.events.on("next", () => done());

      pool.next();
    });
  });

  describe("WHEN pool.back is called", () => {
    it("THEN objects size should be greater than 0 afterwards", () => {
      pool.back(false);

      expect(pool.objects.size).toBeGreaterThan(0);
    });

    it("THEN events.back should be emitted", async (done) => {
      pool.events.on("back", () => done());

      pool.back(null);
    });
  });

  describe("WHEN pool.empty is called on non-empty pool", () => {
    // prepare with data
    beforeEach(() => {
      pool.back(null);
      pool.back(null);
      pool.back(null);
    });

    it("THEN events.remove should be emitted for each item", async (done) => {
      let count = pool.objects.size;

      pool.events.on("remove", () => {
        if (!--count) {
          done()
        }
      });

      pool.empty();
    });
  });
});
