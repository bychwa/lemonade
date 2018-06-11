'use strict';
const fs = require('fs');
const ini = require('ini');
const _ = require('lodash');
const state = require(__dirname + '/../utils/state');
const constants = require(__dirname + '/../utils/constants');

const dot_aws_dir = `${constants.dot_aws_data_dir}/`;;

const saveConfigurations = (configs)=>{
  updateCredentialsFile(
    _.pick(configs.default,
      ['aws_access_key_id','aws_secret_access_key','aws_session_token']
    )
  );
  state.set(Object.assign({},
    state.get(),
    {  configs: configs })
  );
}
const getLemoProfiles = () => {
  const configs = state.get().configs;
  const lempProfiles = Object.keys(configs)
    .reduce((profiles, profilename) => {
      if (profilename !== 'default') {
        const profileData =Object.assign(
          { profile: profilename },
          configs[profilename],
          configs[configs[profilename].source_profile]
        );
        delete profileData.source_profile;
        return Object.assign({},
          profiles,
         { [profilename]: profileData }
        );
      }
      return profiles;
    }, {});
  return lempProfiles;
};

const refreshCredentials = (callback) => {
    if(!_.isEmpty(state.get().primaryCredentials) && !_.isEmpty(state.get().secondaryCredentials)){
      const RoleName = _.get(state.get(), 'secondaryCredentials.AssummedProfile.RoleName');
      if(RoleName){
        changeLemoProfile(RoleName, callback);
      }else{
        callback(null, true);
      }
    }else{
      callback(null, true)
    }
};

const getToken = (TokenCode, SerialNumber, callback) => {
    const AWS = require('aws-sdk');
    const sts = new AWS.STS();
    const params = {
      SerialNumber, TokenCode,
      DurationSeconds: 129600 /* 36 hrs */
    };
    sts.getSessionToken(params, callback);
}

const assumeRole = (RoleSessionName, RoleArn, callback) => {
  const AWS = require('aws-sdk');
  const sts = new AWS.STS();
  const options = {
    RoleArn,
    RoleSessionName, 
    DurationSeconds: 3600 /* 1hr */
  }
  sts.assumeRole(options, callback);
}

const removeCredentialsFile = () => {
  if (fs.existsSync(`${dot_aws_dir}/credentials`)) {
    fs.unlinkSync(`${dot_aws_dir}/credentials`);
  }
}
const saveSecondaryCredentials = (profile, assumedRole) => {
  console.log('assume role - saved');
  state.set(Object.assign({},
    state.get(),
    {
    secondaryCredentials: {
      AssumedProfile: Object.assign({},
          assumedRole.AssumedRoleUser,
          {
          RoleName: profile
        }),
        AssumedCredentials: assumedRole.Credentials
      }
    }
));
}
const updateConfigsFile = (configs) => {
  console.log('configs file - updated');
  fs.writeFileSync(`${dot_aws_dir}/config`, 
    ini.stringify({
      default: configs
    })
  );
};
const updateCredentialsFile = (credentials) => {
  console.log('credentials file - updated');
  fs.writeFileSync(`${dot_aws_dir}/credentials`, 
    ini.stringify({
      default: credentials
    })
  );
};

const convertCredentials = (credentials) => {
  return {
    aws_access_key_id: credentials.AccessKeyId,
    aws_secret_access_key: credentials.SecretAccessKey,
    aws_session_token: credentials.SessionToken
  };
};

const savePrimaryCredentials = (credentials) => {
  updateCredentialsFile(convertCredentials(credentials));
  state.set(Object.assign({},
    state.get(),
    {
    primaryCredentials : credentials,
    refreshManager:Object.assign({},
      state.get().refreshManager,
      {
      last_refresh: new Date().getTime()
    })
  }));
};

const handleError = (error) => {
  if(error.code === 'ExpiredToken'){
    state.set(
        Object.assign({},
        state.get(),
        {
        secondaryCredentials: constants.StateInitialValues['secondaryCredentials'],
        primaryCredentials: constants.StateInitialValues['primaryCredentials']
        }
      )
    );
    removeCredentialsFile();
  }
  if(error.code === 'AccessDenied') {
    // removeCredentialsFile();
  }
  console.log('handle - error', error.code);
};

const mfaAuthenticate = (mfatoken, callback) => {
  
  const profConfigs = _.get(state.get(),'configs.default');
  
  if(profConfigs){

    const MFA_TOKEN = mfatoken;
    const MFA_SERIAL = profConfigs['mfa_serial'];
    
    updateCredentialsFile(
      _.pick(profConfigs,
      ['aws_access_key_id','aws_secret_access_key','aws_session_token']
      )
    );
    getToken(MFA_TOKEN, MFA_SERIAL, (err, creds) => {
      if (err) {
        console.log('token-err', err.code)
        handleError(err);
        callback(err);
      } else {
        savePrimaryCredentials(creds.Credentials);
        callback(null, creds.Credentials);
      }
    });
  }else{
    console.log('no-configs found');
  }

}

const removeLemoProfile = (profile, callback) => {
  try {
    removeCredentialsFile();
    state.set(Object.assign({},
      state.get(),
      {
      secondaryCredentials: constants.StateInitialValues.secondaryCredentials
    }));
    callback(null, true);
  } catch (error) {
    callback(error, true);
  }
};

const changeLemoProfile = (profile, callback) => {
  
  const profConfigs = getLemoProfiles()[profile];
  const ROLE_ARN = profConfigs['role_arn'];
  const ROLE_NAME = profConfigs['role_session_name'];

  updateCredentialsFile(
    convertCredentials(state.get().primaryCredentials)
  );

  assumeRole(ROLE_NAME, ROLE_ARN, (err, assumed) => {
    if (err) {
      console.log('assume - err', err.code);
      handleError(err);
      callback(err);
    } else {
      console.log('assumed role', profile);
      updateCredentialsFile(convertCredentials(assumed.Credentials));
      saveSecondaryCredentials(profile, assumed);
      callback(null, true);
    }
  });
}
module.exports = {
  getLemoProfiles,
  mfaAuthenticate,
  saveConfigurations,
  savePrimaryCredentials,
  updateCredentialsFile,
  refreshCredentials,
  removeLemoProfile,
  changeLemoProfile
}
