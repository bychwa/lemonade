'use strict';
const fs = require('fs');
const ini = require('ini');
const _ = require('lodash');
const {
  assumeRole,
  getToken,
  saveConfigurations,
  changeLemoProfile,
  removeLemoProfile,
  getLemoProfiles,
  mfaAuthenticate
} = require(__dirname + '/../handlers/lemonade');

const state = require(__dirname + '/state');

const constants = require(__dirname + '/constants');

const dot_aws_dir = `${constants.dot_aws_data_dir}/`;;

const getProfiles = () => {
  const profiles = getLemoProfiles();
  const selectedProf = _.get(state.get(), 'secondaryCredentials.AssumedProfile.RoleName', '');
  
  return Object.keys(profiles).reduce((p, c) => {
    p.push({
      name: c,
      active: c === selectedProf
    })
    return p;
  }, []);
};

const getMenus = () => {
  return [
    { name: 'Profiles', active: true },
    { name: 'Settings'}
  ];
}

const prepareFileSystem = () => {
  state.init();
  if(!fs.existsSync(`${dot_aws_dir}`)){
    fs.mkdirSync(`${dot_aws_dir}`);
  }
  if(_.isEmpty(state.get().configs)){
     state.init();
  }
  if(_.isEmpty(state.get().primaryCredentials)){
    state.set(Object.assign({},
      state.get(),
      {
      secondaryCredentials: constants.StateInitialValues['secondaryCredentials']
    }));
    ['credentials','config']
    .forEach(file => {
      const fileLink = `${dot_aws_dir}/${file}`;
      if (fs.existsSync(fileLink)) {
        fs.writeFileSync(fileLink + '.bkp',fs.readFileSync(fileLink))
        fs.unlinkSync(fileLink);
      }
    });
  }
};

const getLemonadeState = (callback) => {
  if(_.isEmpty(state.get().configs)){
    return 'NEEDS_CONFIGS';
  };
  if (_.isEmpty(state.get().primaryCredentials)) {
    return 'NEEDS_MFA_AUTH';
  };
  return 'OKAY';
};

const saveConfigs = (newConfigs) => {
  try {
    saveConfigurations(JSON.parse(newConfigs));
  } catch (error) {
    console.log('malfunctioned profile', error.code);
  }
}

const mfaAuth = mfaAuthenticate;
const changeProfile = changeLemoProfile;
const removeProfile = removeLemoProfile;
module.exports = {
  getProfiles,
  getMenus,
  prepareFileSystem,
  getLemonadeState,
  mfaAuth,
  saveConfigs,
  changeProfile,
  removeProfile
}