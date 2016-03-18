import user from './reducers/userReducer.js';
import disk from './reducers/diskReducer.js';
import searcher from './reducers/searcherReducer.js';
import {
  combineReducers
}
from 'redux';

const app = combineReducers({
  user: user,
  disk: disk,
  searcher:searcher
});

export default app;
