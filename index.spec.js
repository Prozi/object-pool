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
    it("THEN objects size should be 0 afterwards", () => {
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
