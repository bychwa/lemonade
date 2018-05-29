'use strict';

const fs = require('fs');
const EventEmitter = require('events');
const emmiter = new EventEmitter();
const constants = require(__dirname + '/../utils/constants');
const { refresh_credentials } = require(__dirname + '/refresher');

const state = require(__dirname + '/../utils/state');
const dot_aws_dir = `${constants.dot_aws_data_dir}/`;

const postRefresh = ()=>{
  state.set(
    Object.assign({},
      state.get(),
      {
        refreshManager: Object.assign({},
          state.get().refreshManager,
          {
            last_refresh: new Date().getTime()
          }
        )
      }
    ));
};

const on_refresh_credentials = () => {
  refresh_credentials();
  postRefresh();
};

const check_credentials = () => {
  const refreshManager = state.get().refreshManager;
  const needsRefresh = ((new Date().getTime() - refreshManager.last_refresh) / 1000) > state.get().refreshManager.refresh_interval;
  if(needsRefresh){
    emmiter.emit('refresh_credentials')
  }
  setTimeout(() => {
    emmiter.emit('check_credentials');
  }, (constants.credential_check_interval * 1000));
};

emmiter.on('check_credentials', check_credentials);
emmiter.on('refresh_credentials', on_refresh_credentials);

module.exports = () => {
  emmiter.emit('check_credentials');
}