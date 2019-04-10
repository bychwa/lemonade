import {combineReducers} from 'redux';
import profiles from './profiles';
import app from './app';

export default combineReducers({
  profiles,
  app
});
