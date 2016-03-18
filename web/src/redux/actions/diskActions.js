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

//getRoot
function beforeGetRoot() {
  var type = actionTypes;
  return {
    type: actionTypes.BEFORE_GET_ROOT
  };
}

function afterGetRoot(json) {
  return {
    type: actionTypes.AFTER_GET_ROOT,
    result: json
  };
}

function errorGetRoot(error) {
  return {
    type: actionTypes.ERROR_GET_ROOT,
    error: error
  };
}

function dispatchGetRootAsync(query) {
  return (dispatch, getState) => {
    return dispatch(getRoot(query));
  };
}

function getRoot(query) {
  return dispatch => {
    dispatch(beforeGetRoot());
    return fetch(__CLOUD_HOST + `/disk/root`, {
        method: 'get',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getToken()
        }
      })
      .then(fetchHelper.checkStatus)
      .then(fetchHelper.parseJSON)
      .then(json => dispatch(afterGetRoot(json)))
      .catch(error => dispatch(errorGetRoot(error)));
  };
}

//onShowNewDirectory
function onShowNewDirectory() {
  return {
    type: actionTypes.SHOW_NEW_DIRECTORY
  };
}

//createNewDirectory
function beforeCreateNewDirectory() {
  var type = actionTypes;
  return {
    type: actionTypes.BEFORE_CREATE_NEW_DIRECTORY
  };
}

function afterCreateNewDirectory(json) {
  return {
    type: actionTypes.AFTER_CREATE_NEW_DIRECTORY,
    result: json
  };
}

function errorCreateNewDirectory(error) {
  return {
    type: actionTypes.ERROR_CREATE_NEW_DIRECTORY,
    error: error
  };
}

function dispatchCreateNewDirectoryAsync(query) {
  return (dispatch, getState) => {
    return dispatch(createNewDirectory(query));
  };
}

function createNewDirectory(query) {
  return dispatch => {
    dispatch(beforeCreateNewDirectory());
    return fetch(__CLOUD_HOST + `/disk/dir/${query.parentId}/subdir/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify(query.body)
      })
      .then(fetchHelper.checkStatus)
      .then(fetchHelper.parseJSON)
      .then(json => dispatch(afterCreateNewDirectory(json)))
      .catch(error => dispatch(errorCreateNewDirectory(error)));
  };
}

//diveIntoDirectory
function beforeDiveIntoDirectory(query) {
  var type = actionTypes;
  return {
    type: actionTypes.BEFORE_DIVE_INTO_DIRECTORY,
    query: query,
  };
}

function afterDiveIntoDirectory(json) {
  return {
    type: actionTypes.AFTER_DIVE_INTO_DIRECTORY,
    result: json
  };
}

function errorDiveIntoDirectory(error) {
  return {
    type: actionTypes.ERROR_DIVE_INTO_DIRECTORY,
    error: error
  };
}

function dispatchDiveIntoDirectoryAsync(query) {
  return (dispatch, getState) => {
    if (!could(getState())) {
      return dispatch(diveIntoDirectory(query));
    } else {
      return Promise.resolve();
    }
  };

  return Promise.resolve();
}

function diveIntoDirectory(query) {
  return dispatch => {
    dispatch(beforeDiveIntoDirectory(query));
    return fetch(__CLOUD_HOST + `/disk/dir/${query.parentId}/subdir/${query.id}`, {
        method: 'get',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getToken()
        }
      })
      .then(fetchHelper.checkStatus)
      .then(fetchHelper.parseJSON)
      .then(json => dispatch(afterDiveIntoDirectory(json)))
      .catch(error => dispatch(errorDiveIntoDirectory(error)));
  };
}

//switchEditStatus
function switchEditStatus() {
  return {
    type: actionTypes.SWITCH_EDIT_STATUS
  };
}



//removeDirectory
function beforeRemoveDirectory(query) {
  var type = actionTypes;
  return {
    type: actionTypes.BEFORE_REMOVE_DIRECTORY,
    query: query,
  };
}

function afterRemoveDirectory(json) {
  return {
    type: actionTypes.AFTER_REMOVE_DIRECTORY,
    result: json
  };
}

function errorRemoveDirectory(error) {
  return {
    type: actionTypes.ERROR_REMOVE_DIRECTORY,
    error: error
  };
}

function dispatchRemoveDirectoryAsync(query) {
  return (dispatch, getState) => {
    if (!could(getState())) {
      return dispatch(removeDirectory(query));
    } else {
      return Promise.resolve();
    }
  };

  return Promise.resolve();
}

function removeDirectory(query) {
  return dispatch => {
    dispatch(beforeRemoveDirectory(query));
    return fetch(__CLOUD_HOST + `/disk/dir/${query.parentId}/subdir/${query.id}`, {
        method: 'delete',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getToken()
        }
      })
      .then(fetchHelper.checkStatus)
      .then(fetchHelper.parseJSON)
      .then(json => dispatch(afterRemoveDirectory(json)))
      .catch(error => dispatch(errorRemoveDirectory(error)));
  };
}

//editDirectory
function editDirectory(query) {
  return {
    type: actionTypes.EDIT_DIRECTORY,
    query: query
  };
}

//renameDirectory
function beforeRenameDirectory(query) {
  var type = actionTypes;
  return {
    type: actionTypes.BEFORE_RENAME_DIRECTORY,
    query: query,
  };
}

function afterRenameDirectory(json) {
  return {
    type: actionTypes.AFTER_RENAME_DIRECTORY,
    result: json
  };
}

function errorRenameDirectory(error) {
  return {
    type: actionTypes.ERROR_RENAME_DIRECTORY,
    error: error
  };
}

function dispatchRenameDirectoryAsync(query) {
  return (dispatch, getState) => {
    if (!could(getState())) {
      return dispatch(renameDirectory(query));
    } else {
      return Promise.resolve();
    }
  };

  return Promise.resolve();
}

function renameDirectory(query) {
  return dispatch => {
    dispatch(beforeRenameDirectory(query));
    return fetch(__CLOUD_HOST + `/disk/dir/${query.parentId}/subdir/${query.id}`, {
        method: 'put',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify(query.body)
      })
      .then(fetchHelper.checkStatus)
      .then(fetchHelper.parseJSON)
      .then(json => dispatch(afterRenameDirectory(json)))
      .catch(error => dispatch(errorRenameDirectory(error)));
  };
}



//request upload
function beforeRequestUpload(query) {
  var type = actionTypes;
  return {
    type: actionTypes.BEFORE_REQUEST_UPLOAD,
    query: query,
  };
}

function afterRequestUpload(json) {
  return {
    type: actionTypes.AFTER_REQUEST_UPLOAD,
    result: json
  };
}

function errorRequestUpload(error) {
  return {
    type: actionTypes.ERROR_REQUEST_UPLOAD,
    error: error
  };
}

function dispatchRequestUploadAsync(query) {
  return (dispatch, getState) => {
    if (!could(getState())) {
      return dispatch(requestUpload(query));
    } else {
      return Promise.resolve();
    }
  };

  return Promise.resolve();
}

function requestUpload(query) {
  return dispatch => {
    dispatch(beforeRequestUpload(query));
    return fetch(__CLOUD_HOST + `/disk/request/upload/dir/${query.id}/subfile/`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getToken()
        }
      })
      .then(fetchHelper.checkStatus)
      .then(fetchHelper.parseJSON)
      .then(function(transaction) {
        var data = new FormData();
        data.append('file', query.file);
        fetch(`${__STORAGE_HOST}/upload/${transaction._id}`, {
            method: 'POST',
            body: data
          })
          .then(fetchHelper.checkStatus)
          .then(fetchHelper.parseJSON)
          .then(json => dispatch(afterRequestUpload(json)))
          .catch(error => dispatch(errorRequestUpload(error)));
      })
      .catch(error => dispatch(errorRequestUpload(error)));
  };
}



//removeFile
function beforeRemoveFile(query) {
  var type = actionTypes;
  return {
    type: actionTypes.BEFORE_REMOVE_FILE,
    query: query,
  };
}

function afterRemoveFile(json) {
  return {
    type: actionTypes.AFTER_REMOVE_FILE,
    result: json
  };
}

function errorRemoveFile(error) {
  return {
    type: actionTypes.ERROR_REMOVE_FILE,
    error: error
  };
}

function dispatchRemoveFileAsync(query) {
  return (dispatch, getState) => {
    if (!could(getState())) {
      return dispatch(removeFile(query));
    } else {
      return Promise.resolve();
    }
  };

  return Promise.resolve();
}

function removeFile(query) {
  return dispatch => {
    dispatch(beforeRemoveFile(query));
    return fetch(__CLOUD_HOST + `/disk/dir/${query.parentId}/subfile/${query.id}`, {
        method: 'delete',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getToken()
        }
      })
      .then(fetchHelper.checkStatus)
      .then(fetchHelper.parseJSON)
      .then(json => dispatch(afterRemoveFile(json)))
      .catch(error => dispatch(errorRemoveFile(error)));
  };
}

//editFile
function editFile(query) {
  return {
    type: actionTypes.EDIT_FILE,
    query: query
  };
}

//renameFile
function beforeRenameFile(query) {
  var type = actionTypes;
  return {
    type: actionTypes.BEFORE_RENAME_FILE,
    query: query,
  };
}

function afterRenameFile(json) {
  return {
    type: actionTypes.AFTER_RENAME_FILE,
    result: json
  };
}

function errorRenameFile(error) {
  return {
    type: actionTypes.ERROR_RENAME_FILE,
    error: error
  };
}

function dispatchRenameFileAsync(query) {
  return (dispatch, getState) => {
    if (!could(getState())) {
      return dispatch(renameFile(query));
    } else {
      return Promise.resolve();
    }
  };

  return Promise.resolve();
}

function renameFile(query) {
  return dispatch => {
    dispatch(beforeRenameFile(query));
    return fetch(__CLOUD_HOST + `/disk/dir/${query.parentId}/subfile/${query.id}`, {
        method: 'put',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify(query.body)
      })
      .then(fetchHelper.checkStatus)
      .then(fetchHelper.parseJSON)
      .then(json => dispatch(afterRenameFile(json)))
      .catch(error => dispatch(errorRenameFile(error)));
  };
}



//request download
function beforeRequestDownload(query) {
  var type = actionTypes;
  return {
    type: actionTypes.BEFORE_REQUEST_DOWNLOAD,
    query: query,
  };
}

function afterRequestDownload(json) {
  return {
    type: actionTypes.AFTER_REQUEST_DOWNLOAD,
    result: json
  };
}

function errorRequestDownload(error) {
  return {
    type: actionTypes.ERROR_REQUEST_DOWNLOAD,
    error: error
  };
}

function dispatchRequestDownloadAsync(query) {
  return (dispatch, getState) => {
    if (!could(getState())) {
      return dispatch(requestDownload(query));
    } else {
      return Promise.resolve();
    }
  };

  return Promise.resolve();
}

function requestDownload(query) {
  return dispatch => {
    dispatch(beforeRequestDownload(query));
    return fetch(__CLOUD_HOST + `/disk/request/download/dir/${query.parentId}/subfile/${query.id}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getToken()
        }
      })
      .then(fetchHelper.checkStatus)
      .then(fetchHelper.parseJSON)
      .then(json => dispatch(afterRequestDownload(json)))
      .catch(error => dispatch(errorRequestDownload(error)));
  };
}



//switchToMoveMode
function switchToMoveMode(query) {
  return {
    type: actionTypes.SWITCH_TO_MOVE_FILE_MODE,
    query: query
  };
}


//renameDirectory
function beforeMoveFile(query) {
  var type = actionTypes;
  return {
    type: actionTypes.BEFORE_MOVE_FILE,
    query: query,
  };
}

function afterMoveFile(json) {
  return {
    type: actionTypes.AFTER_MOVE_FILE,
    result: json
  };
}

function errorMoveFile(error) {
  return {
    type: actionTypes.ERROR_MOVE_FILE,
    error: error
  };
}

function dispatchMoveFileAsync(query) {
  return (dispatch, getState) => {
    if (!could(getState())) {
      return dispatch(moveFile(query));
    } else {
      return Promise.resolve();
    }
  };

  return Promise.resolve();
}

function moveFile(query) {
  return dispatch => {
    dispatch(beforeMoveFile(query));

    return fetch(`${__CLOUD_HOST}/disk/move/${query.fileId}/from/${query.sourceDirectoryId}/to/${query.targetDirectoryId}`, {
        method: 'put',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getToken()
        },
        body: JSON.stringify(query.body)
      })
      .then(fetchHelper.checkStatus)
      .then(fetchHelper.parseJSON)
      .then(json => dispatch(afterMoveFile(json)))
      .catch(error => dispatch(errorMoveFile(error)));
  };
}


export default {
  dispatchGetRootAsync,
  onShowNewDirectory,
  dispatchCreateNewDirectoryAsync,
  dispatchDiveIntoDirectoryAsync,
  switchEditStatus,
  dispatchRemoveDirectoryAsync,
  editDirectory,
  dispatchRenameDirectoryAsync,
  dispatchRequestUploadAsync,
  dispatchRemoveFileAsync,
  editFile,
  dispatchRenameFileAsync,
  dispatchRequestDownloadAsync,
  switchToMoveMode,
  dispatchMoveFileAsync,
};
