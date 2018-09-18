'use strict';

const utils = require('./utils');

const _state_pending = 'pending';
const _state_fulfilled = 'fulfilled';
const _state_rejected = 'rejected';

module.exports = exports = Promise;

function Promise(resolver) {
  if (!utils.isFunction(resolver)) {
    throw new TypeError(`Promise resolver '${resolver}' is not a function.`);
  }

  Object.defineProperty(this, {
    value: _state_pending,
    writable: true,
    configurable: false,
    enumerable: false
  });

  Object.defineProperty(this, {
    value: [],
    writable: true,
    configurable: false,
    enumerable: false
  });

  safelyResolveThenable(resolver, this);
}

function safelyResolveThenable(func, self) {
  function onFulfilled(value) {

  }

  function onRejected(reason) {

  }

  try {
    func(onFulfilled, onRejected);
  } catch (err) {
    onRejected(err);
  }
}

Promise.prototype.then = function() {

};

Promise.prototype.catch = function() {

};

Promise.prototype.finnally = function() {

};

Promise.all = function() {

};

Promise.race = function() {

};

Promise.resolve = function() {

};

Promise.reject = function() {

};
