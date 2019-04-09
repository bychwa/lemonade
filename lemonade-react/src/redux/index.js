import {applyMiddleware, createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';

import todoApp from './reducers';

export default createStore(todoApp, composeWithDevTools(applyMiddleware()));