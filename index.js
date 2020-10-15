"use strict";

const { v4 } = require("uuid");
const EventEmitter = require("events");

class ObjectPool {
  constructor(factory) {
    this.factory = factory;
    this.objects = new Set();
    this.events = new EventEmitter();
  }

  next() {
    if (this.objects.size === 0) {
      this.objects.add(this.factory());
    }

    const [result] = this.objects.values();

    this.objects.delete(result);

    this.events.emit("next", result);

    return result;
  }

  back(object) {
    this.objects.add(object);

    this.events.emit("back", object);
  }
}

module.exports.ObjectPool = ObjectPool;
