'use strict';
const electron = require('electron')
const fs = require('fs');

const application_data_dir = (electron.app || electron.remote.app).getPath('userData');
const dot_aws_data_dir = `${(electron.app || electron.remote.app).getPath('home')}/.aws/`;
const sample_config_file = {
  default: {
    output: "json",
    region: "eu-west-1",
    aws_access_key_id: "XX",
    aws_secret_access_key: "XX",
    role_session_name: "XX",
    mfa_serial: "XX"
},
olympos: {
  source_profile: "default",
  role_arn: "arn:aws:iam::xxx:role/role_name"
},
}
const StateInitialValues = {
  configs: {},
  primaryCredentials: {},
  secondaryCredentials: {},
  refreshManager: {
    last_refresh: 1527147091611,
    refresh_interval: 3600 /* once every hour */
  }
}

const credential_check_interval = 300; /* once every 5 mins */

module.exports = {
  application_data_dir,
  dot_aws_data_dir,
  sample_config_file,
  credential_check_interval,
  StateInitialValues
}