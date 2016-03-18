import React, {PropTypes} from 'react';
import {IndexRoute, Router, Route, browserHistory} from 'react-router';
import {createHistory, useBasename} from 'history';
import {Provider} from 'react-redux';
import Initializer from './Initializer';
import store from './redux/store';

require('./global.scss');
require('react-tap-event-plugin')();
require('es6-promise').polyfill();

class StoreProvider extends React.Component {
  constructor() {
    super();
    this.onEnter = this.onEnter.bind(this);
  }
  onEnter(nextState, replace) {
    replace({
      pathname: '/login?',
      query: {
        the: 'query'
      }
    });
  }
  render() {
    return (
      <Provider store={store}>
        <Initializer></Initializer>
      </Provider>
    );
  }
}
var selector = function(state) {
  return {user: state.user};
};
export default StoreProvider;
