'use strict';
const fs = require('fs');
const _ = require('lodash');
const constants = require('./constants');
const dir = `lemonade.appdata`;
const dbFile = `_db.json`;
const init = () => {
  if(!fs.existsSync(`${constants.application_data_dir}`)){
    fs.mkdirSync(`${constants.application_data_dir}`);
    fs.chmodSync(`${constants.application_data_dir}`, '755');
  }
  if(!fs.existsSync(`${constants.application_data_dir}/${dir}`)){
    fs.mkdirSync(`${constants.application_data_dir}/${dir}`);
    fs.chmodSync(`${constants.application_data_dir}/${dir}`, '755');
  }
  if(!fs.existsSync(`${constants.application_data_dir}/${dir}/${dbFile}`)){
    set(constants.StateInitialValues);
  }else{
    const state = get();
    ['configs','primaryCredentials','secondaryCredentials','refreshManager']
    .forEach(key => {
      if(!_.keys(state).includes(key)){
        set(Object.assign({},
          state,
          {
            [key]: constants.StateInitialValues[key] || {}
          }
        ));
      }
    })
    
  }
}

const get = () => {
  const state = fs.readFileSync(`${constants.application_data_dir}/${dir}/${dbFile}`,'utf8')
  return JSON.parse(state);
}
const set = (state) => {
  const stateData = JSON.stringify(state,null, 4);
  fs.writeFileSync(`${constants.application_data_dir}/${dir}/${dbFile}`,stateData);
}
module.exports = {
  get, set, init
}