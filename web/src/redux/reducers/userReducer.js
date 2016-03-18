import immutable from 'immutable';
import actionTypes from '../actionTypes';
import myHumane from '../../service/myHumane';
var storage = window.localStorage;

var USER_STATE = immutable.fromJS({
  isLogining: false,
  isRegistering: false,
  isUpdating: false,
  isInitializing: false,
  payload: immutable.Map({}),
  token: ''
});

var userReducer = function(state = USER_STATE, action) {
  switch (action.type) {
    //initialize
    case actionTypes.BEFORE_INITIALIZE:
      state = state.set('payload', immutable.Map({}));
      state = state.set('isInitializing', true);
      return state;
    case actionTypes.AFTER_INITIALIZE:
      state = state.set('payload', immutable.Map(action.result.payload));
      state = state.set('isInitializing', false);

      myHumane.info('欢迎回来，' + action.result.payload.username);

      return state;
    case actionTypes.ERROR_INITIALIZE:
      state = state.set('payload', immutable.Map({}));
      state = state.set('isInitializing', false);
      storage.clear('userToken');
      return state;

      //logout
    case actionTypes.LOGOUT:
      state = state.set('payload', immutable.Map({}));
      state = state.set('isLogining', false);
      state = state.set('isRegistering', false);
      state = state.set('isInitializing', false);

      storage.clear('userToken');

      myHumane.success('您已成功注销');

      return state;

    default:
      return state;
  }
};

export default userReducer;
