const { ObjectPool } = require(".");

class PoolWithEvents extends ObjectPool {
  onNext(id, value) {
    console.log(id, value);
  }
  onBack(id, value) {
    console.log(id, value);
  }
}

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
  });

  describe("WHEN pool.back is called", () => {
    it("THEN objects size should be greater than 0 afterwards", () => {
      pool.back(false);

      expect(pool.objects.size).toBeGreaterThan(0);
    });
  });
});

describe("GIVEN extended class instance", () => {
  let pool;

  beforeEach(() => {
    pool = new PoolWithEvents(() => true);
  });

  it("THEN It should create", () => {
    expect(pool).toBeTruthy();
  });

  describe("WHEN pool.next is called", () => {
    it("THEN onNext function should be called too", async (done) => {
      pool.events.on("next", () => done());

      pool.next();
    });
  });

  describe("WHEN pool.back is called", () => {
    it("THEN onBack function should be called too", async (done) => {
      pool.events.on("back", () => done());

      pool.back("works");
    });
  });
});
