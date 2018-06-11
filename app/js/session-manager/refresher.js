'use strict';
const AWS = require('aws-sdk');
const ini = require('ini');
const fs = require('fs');
const state = require(__dirname + '/../utils/state');
const constants = require(__dirname + '/../utils/constants');
const {
  refreshCredentials
} = require(__dirname + '/../handlers/lemonade');

const refresh_credentials = () => {

  refreshCredentials((err, success) => {
    if(err){
      console.log(new Date(),'refreshing credentials... Failed!', err.code);
    }else{
      console.log(new Date(), 'refreshing credentials... Done!');
    }
  });
};

module.exports = {
  refresh_credentials
}