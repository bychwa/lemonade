import {combineReducers} from 'redux';
import {handleActions} from 'redux-actions';

import {ADD_TODO, TOGGLE_TODO} from './actions'

const initialState = {
  activeProfile: 'offline'
};

const profiles = handleActions(
    {
      [ADD_TODO]: (state, action) => {
        return {...state};
      },
      [TOGGLE_TODO]: (state, action) => {
        return {...state};
      }
    },
    initialState);

const todoApp = combineReducers({profiles})

export default todoApp