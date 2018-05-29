'use strict';
const LocalStorage = require('localstorage');
const appcache = new LocalStorage('appcache');

const get = (key) => appcache.get(key)[1];
const set = (key, value) => appcache.put(key, value);
const has = (key) => appcache.has(key);
const put = (key, value) => appcache.put(key, value);
const del = (key) => appcache.del(key);

module.exports = {
  get, set, has, put, del
};
