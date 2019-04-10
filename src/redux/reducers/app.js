import {handleActions} from 'redux-actions';
import {SAVE_ROOT_USER} from '../actions';

const init = {
  view: 'register',
  root_user: {}
};

const onSaveRootUser = function(state, action) {
  return {view: 'main', root_user: action.payload};
};

const actionMapper = {
  [SAVE_ROOT_USER]: onSaveRootUser
};

export default handleActions(actionMapper, init);
