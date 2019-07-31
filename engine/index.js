const { Configs, Credentials } = require('./aws_files');
const ADAuth = require('./ad_auth');
const change_case = require('change-case');

const keys_to_snake = (object, prefix = '', suffix = '') => {
  return Object.keys(object).reduce((new_object, field) => {
    new_object[prefix + change_case.snakeCase(field) + suffix] = object[field];
    return new_object;
  }, {});
};

const assume_role = async ({ profile, username, password, mfa_code }) => {
  const configs = new Configs('/Users/bouer/.aws/aws-adfs.toml')
  const profile_settings = configs.getValue('profiles')[profile];
  const { idp_role_arn, idp_entry_url, idp_principal_arn } = profile_settings;
  const user = new ADAuth({
    idp_entry_url,
    idp_principal_arn,
    username,
    password,
    mfa_code,
  });
  const assumed = await user.assume(idp_role_arn);
  const credentials = new Credentials();
  credentials.addKey(profile, keys_to_snake(assumed.Credentials, 'aws_'))
  credentials.switch(profile, 'default');
  credentials.save();
  console.log('[success] assumed ' + profile);
  return user;
};

(async () => {
  const user = await assume_role({
    profile: 'dev',
    username: 'x.x@danielwellington.com',
    password: 'xxx!',
    mfa_code: '551573',
  });
  setTimeout(async () => {
    await assume_role({
      profile: 'test',
      username: 'x.x@danielwellington.com',
      password: 'xxx!',
      mfa_code: '551573',
    });
  }, 10000);

  // console.log(credentials.toObject());
})()
