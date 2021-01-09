"use strict";

const EventEmitter = require("events");

class ObjectPool {
  constructor(factoryFunction) {
    this.factory = factoryFunction;

    this.objects = new Set();

    this.events = new EventEmitter();
  }

  get size() {
    return this.objects.size;
  }

  set size(size = 0) {
    if (typeof size !== "number") {
      throw new Error("Parameter is not a number: " + typeof size);
    }

    let current = this.objects.size;

    while (current < size) {
      const object = this.factory();

      this.put(object);

      current++;
    }

    while (current > size) {
      const [object] = this.objects.values();

      this.delete(object);

      current--;
    }
  }

  get() {
    if (this.size === 0) {
      const object = this.factory();

      this.events.emit("get", object);

      return object;
    }

    const [object] = this.objects.values();

    this.objects.delete(object);

    this.events.emit("get", object);

    return object;
  }

  put(object) {
    this.objects.add(object);

    this.events.emit("put", object);
  }

  delete(object) {
    this.objects.delete(object);

    this.events.emit("delete", object);
  }
}

module.exports = ObjectPool;
