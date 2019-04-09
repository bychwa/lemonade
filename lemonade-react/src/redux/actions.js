import {createAction} from 'redux-actions';

export const ADD_TODO = 'ADD_TODO'
export const TOGGLE_TODO = 'TOGGLE_TODO'

export const addTodo = createAction(ADD_TODO);

export const toggleTodo = createAction(TOGGLE_TODO);
