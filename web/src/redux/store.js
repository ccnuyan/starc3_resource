import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import {
  createStore,
  applyMiddleware
}

from 'redux';
import immutable from 'immutable';
import app from './app';


const loggerMiddleware = createLogger();

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware, // lets us dispatch() functions
  loggerMiddleware // neat middleware that logs actions
)(createStore);

var subjects = {
  zhongxue_yuwen: immutable.Map({
    key: 'zhongxue_yuwen',
    name: '中学语文'
  }),
  zhongxue_shuxue: immutable.Map({
    key: 'zhongxue_shuxue',
    name: '中学数学'
  }),
  zhongxue_yingyu: immutable.Map({
    key: 'zhongxue_yingyu',
    name: '中学英语'
  }),
  zhongxue_dili: immutable.Map({
    key: 'zhongxue_dili',
    name: '中学地理'
  }),
  zhongxue_wuli: immutable.Map({
    key: 'zhongxue_wuli',
    name: '中学物理'
  }),
  zhongxue_huaxue: immutable.Map({
    key: 'zhongxue_huaxue',
    name: '中学化学'
  }),
  zhongxue_shengwu: immutable.Map({
    key: 'zhongxue_shengwu',
    name: '中学生物'
  }),
  mjsk: immutable.Map({
    key: 'mjsk',
    name: '苏科初中数学',
    type: 'standalone'
  })
};

//initialState here represent real data it could be from the server;
var initialState = {
  searcher: immutable.Map({
    subjects: immutable.Map(subjects),
    activeSubject: immutable.Map({}),
    knowledgeNodes: immutable.Map({}),
    activeKnowledgeNode: immutable.Map({}),
    resources: immutable.Map({}),
  })
};

// const store = createStoreWithMiddleware(app);
const store = createStoreWithMiddleware(app, initialState);

export default store;
