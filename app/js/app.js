'use strict';
const _ = require('lodash');
const ini = require('ini');
const cache = require(__dirname + '/js/utils/cache');
const state = require(__dirname + '/js/utils/state');
const constants = require(__dirname + '/js/utils/constants');

const {
  getProfiles,
  removeProfile,
  getLemonadeState,
  getMenus,
  mfaAuth,
  saveConfigs,
  changeProfile
} = require(__dirname + '/js/utils/helpers');


let activeProfile = getProfiles().find(p => p.active);

cache.put('currentProfile', activeProfile && activeProfile.name || 'offline');
cache.del('application_error')

const activeMenu = getMenus().find(m => m.active);

function onChangeView(view) {
  cache.put('currentView', view);
  render();
};
function removeCredentials(profile) {
  removeProfile(profile, (err, success)=>{
    if(!err || success){
      cache.del('application_error');
      cache.put('currentProfile', profile);
    }else{
      cache.put('application_error', (err && err.code + ' - Reload App!' )|| 'Error while changing profile!');
    }
    render();
  });
  
};
function onChangeProfile(profile) {
  $("#loading-view").show();
  const action = profile === 'offline' ? removeCredentials : changeProfile;
  action(profile, (err, success) => {
    if (!err && success) {
      cache.del('application_error');
      cache.put('currentProfile', profile);
    }else{
      cache.put('application_error', (err && err.code + ' - Reload App!' )|| 'Error while changing profile!');
    }
    render();
  });
};

function save_configs() {
  $("#loading-view").show();
  const newConfigs = $('#config-editor').val();
  saveConfigs(newConfigs);
  render();
};

function submit_mfa() {
  $("#loading-view").show();
  const mfa = $("#mfa_code").val();
  if(mfa && mfa.trim().length === 6 && mfa.trim().match(/^\d+$/)){
      mfaAuth(mfa, (err, success) => {
        if (err || !success) {
          cache.put('application_error', err && err.message || 'Invalid Mfa Code!');
        }else{
          cache.del('application_error');
        }
        render();
      });
  }else{
    cache.put('application_error', 'Mfa needs 6 integers numbers!');
    render();
  }
  
};

function render() {
  const lemoState = getLemonadeState();
  console.log('app state - ', lemoState);
  if (lemoState === 'NEEDS_CONFIGS') {
    cache.put('currentView', 'Settings');
  }
  
  const profiles = getProfiles();
  const menus = getMenus();
  const errorView = `
  <div class="ui ${cache.get('application_error') ? '' :'hidden' } message red">
    <p>${ cache.get('application_error') ? cache.get('application_error') : '' }
    </p>
  </div>
  `;

  const mfaView = `
      <div class="ui container mfa-container">
        <div class="ui">
          <h2 class="ui header" style='text-align:center;'>Mfa Auth!</h2>
          ${errorView}
          <div class="ui divider"></div>
          <div class="ui form">
            <div class="field">
              <input type="text" id="mfa_code" style="font-size: 150%; text-align:center;" name="first-name" placeholder="MFA Code">
            </div>
            <div class="ui divider"></div>
            <button class="ui button huge primary fluid" type="submit" onClick="submit_mfa()">Submit</button>
          </div>
        </div>
      </div>`;

  const menuView = menus.reduce((mv, menu) => {
    return `
          ${mv}
          <a class="${cache.get('currentView') === menu.name ? 'active': ''} item"
          onClick="onChangeView('${menu.name}')">${menu.name}</a>
        `;
  },'');

  const profilesView = profiles.reduce((pv, profile) => {
    const active = (profile.name === cache.get('currentProfile'));
    const messageColor = active ? profile.name === 'offline' ? 'red': 'green': '' 
    return `
      ${pv}
      <div onClick="onChangeProfile('${profile.name}')" class='ui profile small icon message ${messageColor}'>
        <i class='square ${active ? '': 'outline' } icon mini'></i>
        <div class='content'>
          <div class='header'>${profile.name}</div>
        </div>
      </div>`;
  }, ``);

  const settingsView = `
    <div class="ui form">
      <div class="field">
        <label>Configurations:</label>
        <div class="ui divider"></div>
        <textarea rows="30" style="height: 100%" id='config-editor'></textarea>
        <div class="ui divider"></div>
      </div>
      <button class="ui button" type="submit" onClick="save_configs()">Save Configs</button>
    </div>
  `;
  if(lemoState ==='NEEDS_MFA_AUTH') {
    $("#mfa-view").html(mfaView);
    $("#mfa-view").show();
    $("#main-view").hide();
    $("#menu-view").hide();
  }else{
    let mainView = '';
    if(cache.get('currentView') === 'Profiles'){
      mainView = profilesView;
    }else if(cache.get('currentView') === 'Settings'){
      mainView =settingsView;
    }
    $("#mfa-view").hide();
    $("#main-view").show();
    $("#menu-view").show();
    $("#menu-view").html(menuView);
    $('#main-view').html(mainView);
    $("#error-view").html(errorView)
  }
  if (cache.get('currentView') === 'Settings') {
    const configsText = !_.isEmpty(state.get().configs) ?
      JSON.stringify(state.get().configs, null, 4) :
      JSON.stringify(constants.sample_config_file, null, 4);
    $('#config-editor').text(configsText);
  }
  $("#loading-view").hide();
};

function onDocumentReady() {
  render();
}