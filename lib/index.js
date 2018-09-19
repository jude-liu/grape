'use strict';

const utils = require('./utils');

module.exports = exports = Promise;

const _state_pending = 'pending';
const _state_fulfilled = 'fulfilled';
const _state_rejected = 'rejected';

const _internel = function() {}

/**
 * 基于 Promise/A+ 规范实现。
 */
function Promise(resolver) {
  if (!utils.isFunction(resolver)) {
    throw new TypeError(`Promise resolver '${resolver}' is not a function.`);
  }

  Object.defineProperty(this, '_state', {
    value: _state_pending,
    writable: true,
    configurable: false,
    enumerable: false
  });

  Object.defineProperty(this, '_value', {
    value: undefined,
    writable: true,
    configurable: false,
    enumerable: false
  });

  Object.defineProperty(this, '_queue', {
    value: [],
    writable: true,
    configurable: false,
    enumerable: false
  });

  safelyResolveThenable(resolver, this);
}

function safelyResolveThenable(func, self) {
  try {
    func(doResolve, doReject);
  } catch (err) {
    doReject(err);
  }
}

function doResolve(self, value) {
  self._value = value;
  self._state = _state_fulfilled;
  self._fulfilledCallbacks.forEach((cb) => {

  });
}

function doReject(self, reason) {
  self._value = reason;
  self._state = _state_rejected;
}

function unwrap(promise, func, value) {
  process.nextTick(function() {
    try {
      let x = func(value);
      
      // 如果 promise 和 x 指向同一对象，以 TypeError 为据因拒绝执行 promise
      if (x === promise) {
        throw TypeError('The resolve value can\'t be its self.');
      }

      // 如果 x 为 Promise ，则使 promise 接受 x 的状态:
      // 1.如果 x 处于等待态， promise 需保持为等待态直至 x 被执行或拒绝
      // 2.如果 x 处于执行态，用相同的值执行 promise
      // 3.如果 x 处于拒绝态，用相同的据因拒绝 promise
      if (x instanceof Promise) {
        x.then(
          (value) => {
            doResolve(promise, value);
          },
          (reason) => {
            doReject(promise, reason);
          }
        )
      }

      // 如果 x 为对象或者函数：
      //   把 x.then 赋值给 then
      //   如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
      //   如果 then 是函数，将 x 作为函数的作用域 this 调用之。传递两个回调函数作为参数，第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise:
      //     如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
      //     如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
      //     如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
      //   如果调用 then 方法抛出了异常 e：
      //     如果 resolvePromise 或 rejectPromise 已经被调用，则忽略之
      //     否则以 e 为据因拒绝 promise
      //   如果 then 不是函数，以 x 为参数执行 promise
      if (utils.isObject(x) || utils.isFunction(x)) {
        let then = x.then;
        then  
      }

    } catch (err) {
      doReject(promise, err);
    }
  });
}

function wrapCallback(promise, onFulfilled, onRejected) {
  let obj = {
    promise: promise,
    onFulfilled: (value) => {
      doReject(promise, value);
    },
    onRejected: (reason) => {
      doReject(promise, reason);
    }
  };

  if (utils.isFunction(onFulfilled)) {
    obj.onFulfilled = function(value) {
      unwrap(promise, onFulfilled, value);
    };
  }

  if (utils.isFunction(onRejected)) {
    obj.onFulfilled = function(reason) {
      unwrap(promise, onRejected, reason);
    };
  }
}

/**
 * promise 必须提供一个 then 方法以访问其当前值、终值和据因。
 * 两个参数 onFulfilled 和 onRejected 都是可选参数，如果不是函数必须被忽略，返回上一个 promise 的结果。
 * 
 * onFulfilled是函数：
 *  当 promise 执行结束后其必须被调用，其第一个参数为 promise 的终值；
 *  在 promise 执行结束前其不可被调用；
 *  其调用次数不可超过一次。
 * 
 * onFulfilled是函数：
 *  当 promise 被拒绝执行后其必须被调用，其第一个参数为 promise 的据因；
 *  在 promise 被拒绝执行前其不可被调用；
 *  其调用次数不可超过一次。
 * 
 *  then 方法必须返回一个 promise 对象。
 */
Promise.prototype.then = function(onFulfilled, onRejected) {
  let self = this;
  
  if ((!utils.isFunction(onFulfilled) && self._state === _state_fulfilled) 
    || (!utils.isFunction(onRejected) && self._state === _state_rejected)) {
    return self;
  }

  let promise = new Promise(_internel);

  // 如果状态已改变，执行回调
  if (self._state !== _state_pending) {
    let func = self._state === _state_fulfilled ? onFulfilled : onRejected;
    revoke(promise, func);
  } else {
    wrapCallback(promise, onFulfilled, onRejected);
  }

  return promise;
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
