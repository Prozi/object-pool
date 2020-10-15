"use strict";

const EventEmitter = require("events");

class ObjectPool {
  constructor(factory) {
    this.factory = factory;
    this.objects = new Set();
    this.events = new EventEmitter();
  }

  empty() {
    if (this.objects.size === 0) {
      return;
    }

    const [result] = this.objects.values();

    this.remove(result);

    this.empty();
  }

  next() {
    if (this.objects.size === 0) {
      const result = this.factory();

      this.events.emit("next", result);

      return result;
    }

    const [result] = this.objects.values();

    this.objects.delete(result);

    this.events.emit("next", result);

    return result;
  }

  remove(object) {
    this.objects.delete(object);

    this.events.emit("remove", object);
  }

  back(object) {
    this.objects.add(object);

    this.events.emit("back", object);
  }
}

module.exports.ObjectPool = ObjectPool;
