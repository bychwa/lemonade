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
  removeProfile(profile, (err, success) => {
    if (!err || success) {
      cache.del('application_error');
      cache.put('currentProfile', profile);
    } else {
      cache.put('application_error', (err && err.code + ' - Reload App!') || 'Error while changing profile!');
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
    } else {
      cache.put('application_error', (err && err.code + ' - Reload App!') || 'Error while changing profile!');
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
  if (mfa && mfa.trim().length === 6 && mfa.trim().match(/^\d+$/)) {
    mfaAuth(mfa, (err, success) => {
      if (err || !success) {
        cache.put('application_error', err && err.message || 'Invalid Mfa Code!');
      } else {
        cache.del('application_error');
      }
      render();
    });
  } else {
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
  <div class="ui ${cache.get('application_error') ? '' : 'hidden'} message red" style="text-align:center">
    ${ cache.get('application_error') ? cache.get('application_error') : ''}
  </div>
  `;

  const mfaView = `
      <div class="ui container mfa-container animated fadeIn">
        <div class="ui">
          <h2 class="ui header" style='text-align:center;'>Mfa Auth!</h2>
          ${errorView}
          <div class="ui divider"></div>
          <div class="ui form">
            <div class="field">
              <input type="text" id="mfa_code" class="${ cache.get('application_error') ? 'animated shake fast' : ''}" style="font-size: 150%; text-align:center;" placeholder="MFA Code">
            </div>
            <div class="ui divider"></div>
            <button class="ui button huge primary fluid" type="submit" onClick="submit_mfa()">Submit</button>
          </div>
        </div>
      </div>`;

  const menuView = menus.reduce((mv, menu) => {
    return `
          ${mv}
          <a class="${cache.get('currentView') === menu.name ? 'active' : ''} item"
          onClick="onChangeView('${menu.name}')">${menu.name}</a>
        `;
  }, '');

  const profilesView = `
    <div class="ui form">
    ${profiles.reduce((pv, profile) => {
      const active = (profile.name === cache.get('currentProfile'));
      const messageColor = active ? profile.name === 'offline' ? 'red' : 'green' : ''
      return `
        ${pv}
        <div onClick="onChangeProfile('${profile.name}')" class='ui profile small icon message ${messageColor}'>
          <i class='square ${active ? '' : 'outline'} icon mini'></i>
          <div class='content'>
            <div class='header'>${profile.name}</div>
          </div>
        </div>`;
    }, ``)}
    </div>
  `;

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
  if (lemoState === 'NEEDS_MFA_AUTH') {
    $("#mfa-view").html(mfaView);
    $("#mfa-view").show();
    $("#main-view").hide();
    $("#menu-view").hide();
  } else {
    let mainView = '';
    if (cache.get('currentView') === 'Profiles') {
      mainView = profilesView;
    } else if (cache.get('currentView') === 'Settings') {
      mainView = settingsView;
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
  $.getJSON('https://api.github.com/repos/bychwa/lemonade/releases').then(function (releases) {
    const thisVersion = require('electron').remote.app.getVersion();
    if (releases.length > 0) {
      if (_.get(releases[0], 'tag_name').indexOf(thisVersion) < 0) {
        const platform = 'mac';
        const contentTypes = {
          mac: 'application/octet-stream'
        };
        const asset = releases[0].assets.find(a => a.content_type === contentTypes[platform]);
        if (asset) {
          $("#update-widget").html(`
            <a href="${asset['browser_download_url']}" class="fluid ui positive button attached"> A new version of lemonade (${releases[0]['tag_name']}) is available. click here to update.</a>
          `);
        } else {
        }
      }
    }
  });
  render();
}