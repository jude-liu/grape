'use strict';

const Promise = require('./lib/index');

let promise = new Promise((resolve, reject) => {
  resolve('111');
});

promise.then(res => {
  console.log(res)
});
promise
  .then(res => {
    console.log(res)
  })
  .then(res => {
    console.log(res)
  })
