"use strict";

const { v4 } = require("uuid");

class ObjectPool {
  constructor(factory) {
    this.objects = new Map();
    this.factory = factory;
  }

  next() {
    if (this.objects.size === 0) {
      this.objects.set(v4(), this.factory());
    }

    const [next] = this.objects.keys();
    const result = this.objects.get(next);

    this.objects.delete(next);

    return result;
  }

  back(object) {
    this.objects.set(v4(), object);
  }
}

module.exports.ObjectPool = ObjectPool;
