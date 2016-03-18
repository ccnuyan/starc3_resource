import immutable from 'immutable';
import actionTypes from '../actionTypes';
import myHumane from '../../service/myHumane';
var storage = window.localStorage;

var DISK_STATE = immutable.fromJS({
  directories: immutable.Map({}),
  files: immutable.Map({}),
  currentDirectory: immutable.Map({}),
  errorMessage: '',
  loading: false,
  uploading: false,
  newDirectoryShown: false,
  editStatus: false,
  fileToBeMoved: immutable.Map({})
});

var diskReducer = function(state = DISK_STATE, action) {
  switch (action.type) {
    //Get root
    case actionTypes.BEFORE_GET_ROOT:
      state = state.set('directories', immutable.Map({}));
      state = state.set('currentDirectory', immutable.Map({}));
      state = state.set('files', immutable.Map({}));
      state = state.set('errorMessage', '');
      state = state.set('loading', true);
      return state;
    case actionTypes.AFTER_GET_ROOT:
      state = state.set('currentDirectory', immutable.Map(action.result));
      state = state.setIn(['directories', action.result._id], immutable.Map(action.result));

      action.result.subDirectories.forEach(function(directory) {
        state = state.setIn(['directories', directory._id], immutable.Map(directory));
      });
      action.result.subFiles.forEach(function(file) {
        state = state.setIn(['files', file._id], immutable.Map(file));
      });

      state = state.set('errorMessage', '');
      state = state.set('loading', false);
      return state;
    case actionTypes.ERROR_GET_ROOT:
      state = state.set('directories', immutable.Map({}));
      state = state.set('files', immutable.Map({}));
      state = state.set('errorMessage', 'something wrong');
      state = state.set('loading', true);
      return state;

      //Show new directory
    case actionTypes.SHOW_NEW_DIRECTORY:
      state = state.set('newDirectoryShown', true);
      return state;

      //Create new directory
    case actionTypes.BEFORE_CREATE_NEW_DIRECTORY:
      state = state.set('newDirectoryShown', false);
      state = state.set('errorMessage', '');
      state = state.set('loading', true);
      return state;
    case actionTypes.AFTER_CREATE_NEW_DIRECTORY:
      state = state.setIn(['directories', action.result._id], immutable.Map(action.result));
      action.result.subDirectories.forEach(function(directory) {
        state = state.setIn(['directories', directory._id], immutable.Map(directory));
      });

      state = state.set('loading', false);
      return state;
    case actionTypes.ERROR_CREATE_NEW_DIRECTORY:
      state = state.set('errorMessage', '');
      state = state.set('loading', false);
      return state;

      //Dive into directory
    case actionTypes.BEFORE_DIVE_INTO_DIRECTORY:
      state = state.set('currentDirectory', state.getIn(['directories', action.query.id]));
      state = state.set('errorMessage', '');
      state = state.set('loading', true);
      return state;

    case actionTypes.AFTER_DIVE_INTO_DIRECTORY:
      state = state.setIn(['directories', action.result._id], immutable.Map(action.result));

      action.result.subDirectories.forEach(function(directory) {
        state = state.setIn(['directories', directory._id], immutable.Map(directory));
      });

      action.result.subFiles.forEach(function(file) {
        state = state.setIn(['files', file._id], immutable.Map(file));
      });

      state = state.set('loading', false);
      return state;
    case actionTypes.ERROR_DIVE_INTO_DIRECTORY:
      state = state.set('errorMessage', '');
      state = state.set('loading', false);
      return state;

      //Switch Edit Status
    case actionTypes.SWITCH_EDIT_STATUS:
      var editStatus = state.get('editStatus');
      state = state.set('editStatus', !editStatus);
      if (editStatus) {
        state = state.set('newDirectoryShown', false);
      }
      return state;


      //remove directory
    case actionTypes.BEFORE_REMOVE_DIRECTORY:
      state = state.set('errorMessage', '');
      state = state.set('loading', true);
      return state;

    case actionTypes.AFTER_REMOVE_DIRECTORY:
      state = state.deleteIn(['directories', action.result._id]);
      state = state.set('loading', false);
      return state;
    case actionTypes.ERROR_REMOVE_DIRECTORY:
      state = state.set('errorMessage', '');
      state = state.set('loading', false);
      return state;

      //Edit directory
    case actionTypes.EDIT_DIRECTORY:
      state = state.setIn(['directories', action.query.id, 'isEditing'], true);
      return state;

      //rename directory
    case actionTypes.BEFORE_RENAME_DIRECTORY:
      state = state.set('errorMessage', '');
      state = state.set('loading', true);
      return state;

    case actionTypes.AFTER_RENAME_DIRECTORY:
      state = state.setIn(['directories', action.result._id], immutable.Map(action.result));
      state = state.set('loading', false);
      return state;

    case actionTypes.ERROR_RENAME_DIRECTORY:
      state = state.set('errorMessage', '');
      state = state.set('loading', false);
      return state;



      //requestUpload
    case actionTypes.BEFORE_REQUEST_UPLOAD:
      state = state.set('errorMessage', '');
      state = state.set('uploading', true);
      return state;

    case actionTypes.AFTER_REQUEST_UPLOAD:
      state = state.setIn(['files', action.result._id], immutable.Map(action.result));
      state = state.set('uploading', false);
      return state;

    case actionTypes.ERROR_REQUEST_UPLOAD:
      state = state.set('errorMessage', '');
      state = state.set('uploading', false);
      return state;



      //remove file
    case actionTypes.BEFORE_REMOVE_FILE:
      state = state.set('errorMessage', '');
      state = state.set('loading', true);
      return state;

    case actionTypes.AFTER_REMOVE_FILE:
      state = state.deleteIn(['files', action.result._id]);
      state = state.set('loading', false);
      return state;
    case actionTypes.ERROR_REMOVE_FILE:
      state = state.set('errorMessage', '');
      state = state.set('loading', false);
      return state;

      //Edit file
    case actionTypes.EDIT_FILE:
      state = state.setIn(['files', action.query.id, 'isEditing'], true);
      return state;

      //rename file
    case actionTypes.BEFORE_RENAME_FILE:
      state = state.set('errorMessage', '');
      state = state.set('loading', true);
      return state;

    case actionTypes.AFTER_RENAME_FILE:
      state = state.setIn(['files', action.result._id], immutable.Map(action.result));
      state = state.set('loading', false);
      return state;

    case actionTypes.ERROR_RENAME_FILE:
      state = state.set('errorMessage', '');
      state = state.set('loading', false);
      return state;;



      //requestDownload
    case actionTypes.BEFORE_REQUEST_DOWNLOAD:
      return state;

    case actionTypes.AFTER_REQUEST_DOWNLOAD:
      var url = `${__STORAGE_HOST}/download/${action.result._id}`;
      window.location = url;
      //document.getElementById('download_frame').src = `${__STORAGE_HOST}/download/${action.result._id}`;
      return state;

    case actionTypes.ERROR_REQUEST_DOWNLOAD:
      return state;


      //SWITCH TO MOVE FILE MODE
    case actionTypes.SWITCH_TO_MOVE_FILE_MODE:
      var fileId = action.query.id;
      if (state.getIn(['fileToBeMoved', '_id']) === fileId) {
        state = state.set('fileToBeMoved', immutable.Map({}));
      } else {
        state = state.set('fileToBeMoved', state.getIn(['files', fileId]));
      }
      return state;



      //requestDownload
    case actionTypes.BEFORE_MOVE_FILE:
      state = state.set('loading', true);
      return state;

    case actionTypes.AFTER_MOVE_FILE:
      state = state.setIn(['directories', action.result.source._id], immutable.Map(action.result.source));
      state = state.setIn(['directories', action.result.target._id], immutable.Map(action.result.target));
      state = state.setIn(['files', action.result.file._id], immutable.Map(action.result.file));

      state = state.set('fileToBeMoved', immutable.Map({}));
      state = state.set('loading', false);
      return state;

    case actionTypes.ERROR_MOVE_FILE:
      state = state.set('fileToBeMoved', immutable.Map({}));
      return state;


    default:
      return state;
  }
};

export default diskReducer;
