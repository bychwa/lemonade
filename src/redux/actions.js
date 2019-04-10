import {createAction} from 'redux-actions';

export const ADD_TODO = 'ADD_TODO'
export const CHANGE_VIEW = 'CHANGE_VIEW'
export const SAVE_ROOT_USER = 'SAVE_ROOT_USER';

export const addTodo = createAction(ADD_TODO);

export const changeView = createAction(CHANGE_VIEW);

export const saveRootUser = createAction(SAVE_ROOT_USER)