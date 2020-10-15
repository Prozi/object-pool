"use strict";

const { v4 } = require("uuid");

class ObjectPool {
  constructor(factory) {
    this.objects = new Map();
    this.factory = factory;
  }

  onNext(id, value) {
    // extend class to use
  }

  onBack(id, value) {
    // extend class to use
  }

  next() {
    if (this.objects.size === 0) {
      this.objects.set(v4(), this.factory());
    }

    const [next] = this.objects.keys();
    const result = this.objects.get(next);

    this.objects.delete(next);

    this.onNext(next, result);

    return result;
  }

  back(object) {
    const id = v4();

    this.objects.set(id, object);

    this.onBack(id, object);
  }
}

module.exports.ObjectPool = ObjectPool;
