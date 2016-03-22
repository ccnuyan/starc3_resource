import actionTypes from '../actionTypes';
import fetch from 'isomorphic-fetch';
import _ from 'lodash';
import fetchHelper from './fetchHelper';

var getToken = function() {
  return window.localStorage.getItem('userToken');
};

function could(state) {
  return state.getIn(['directories', 'loading']);
}

//onSetSubjectActive
function onSetSubjectActive(key) {
  return {
    type: actionTypes.SUBJECT_SET_ACTIVE,
    key: key,
  };
}

//onSetSubjectAll
function onSetSubjectAll() {
  return {
    type: actionTypes.SUBJECT_SET_ALL,
  };
}

//onSetSubjectActive
function onSetKnowledgeNodeActive(key) {
  return {
    type: actionTypes.KNOWLEDGENODE_SET_ACTIVE,
    key: key,
  };
}

//onSetSubjectAll
function onSetKnowledgeNodeNull() {
  return {
    type: actionTypes.KNOWLEDGENODE_SET_NULL,
  };
}



//searchKnowledgenodes
function beforeSearchKnowledgenodes() {
  var type = actionTypes;
  return {
    type: actionTypes.BEFORE_SEARCH_KNOWLEDGENODES,
  };
}

function afterSearchKnowledgenodes(json) {
  return {
    type: actionTypes.AFTER_SEARCH_KNOWLEDGENODES,
    result: json
  };
}

function errorSearchKnowledgenodes(error) {
  return {
    type: actionTypes.ERROR_SEARCH_KNOWLEDGENODES,
    error: error
  };
}

function dispatchSearchKnowledgenodesAsync(query) {
  return (dispatch, getState) => {
    return dispatch(searchKnowledgenodes(query));
  };
}

function searchKnowledgenodes(query) {
  return dispatch => {
    dispatch(beforeSearchKnowledgenodes());
    return fetch(`${__RESOURCE_HOST}/search/knowledgeNodes?subject=${query.subject}&term=${query.term}`, {
        method: 'get',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      .then(fetchHelper.checkStatus)
      .then(fetchHelper.parseJSON)
      .then(json => dispatch(afterSearchKnowledgenodes(json)))
      .catch(error => dispatch(errorSearchKnowledgenodes(error)));
  };
}


//searchResources
function beforeSearchResources() {
  var type = actionTypes;
  return {
    type: actionTypes.BEFORE_SEARCH_RESOURCES,
  };
}

function afterSearchResources(json) {
  return {
    type: actionTypes.AFTER_SEARCH_RESOURCES,
    result: json
  };
}

function errorSearchResources(error) {
  return {
    type: actionTypes.ERROR_SEARCH_RESOURCES,
    error: error
  };
}

function dispatchSearchResourcesAsync(query) {
  return (dispatch, getState) => {
    return dispatch(searchResources(query));
  };
}

function searchResources(query) {
  return dispatch => {
    dispatch(beforeSearchResources());
    return fetch(`${__RESOURCE_HOST}/search/resources?${fetchHelper.serialize(query)}`, {
        method: 'get',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      .then(fetchHelper.checkStatus)
      .then(fetchHelper.parseJSON)
      .then(json => dispatch(afterSearchResources(json)))
      .catch(error => dispatch(errorSearchResources(error)));
  };
}



//searchKnowledgeNodeResources
function beforeSearchKnowledgeNodeResources(query) {
  var type = actionTypes;
  return {
    type: actionTypes.BEFORE_SEARCH_KNOWLEDGENODE_RESOURCES,
    key:query
  };
}

function afterSearchKnowledgeNodeResources(json) {
  return {
    type: actionTypes.AFTER_SEARCH_KNOWLEDGENODE_RESOURCES,
    result: json
  };
}

function errorSearchKnowledgeNodeResources(error) {
  return {
    type: actionTypes.ERROR_SEARCH_KNOWLEDGENODE_RESOURCES,
    error: error
  };
}

function dispatchSearchKnowledgeNodeResourcesAsync(query) {
  return (dispatch, getState) => {
    return dispatch(searchKnowledgeNodeResources(query));
  };
}

function searchKnowledgeNodeResources(query) {
  return dispatch => {
    dispatch(beforeSearchKnowledgeNodeResources());
    return fetch(`${__RESOURCE_HOST}/search/knowledgeNodes/${query}`, {
        method: 'get',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      })
      .then(fetchHelper.checkStatus)
      .then(fetchHelper.parseJSON)
      .then(json => dispatch(afterSearchKnowledgeNodeResources(json)))
      .catch(error => dispatch(errorSearchKnowledgeNodeResources(error)));
  };
}

export default {
  onSetSubjectActive,
  onSetSubjectAll,

  onSetKnowledgeNodeActive,
  onSetKnowledgeNodeNull,

  dispatchSearchKnowledgenodesAsync,
  dispatchSearchResourcesAsync,

  dispatchSearchKnowledgeNodeResourcesAsync,
};
