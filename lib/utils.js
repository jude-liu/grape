'use strict';

const utils = {};

module.exports = exports = utils;

utils.isFunction = function(param) {
  return typeof param === 'function'
};

utils.isObject = function(param) {
  return typeof param === 'object';
};

utils.isPromise = function() {

};