import React, {PropTypes} from 'react';
import {IndexRoute, Router, Route, browserHistory} from 'react-router';
import App from './components/App';
import HomePage from './components/HomePage';
import AboutPage from './components/about/AboutPage';
import DiskPage from './components/disk/DiskPage';
import SearcherPage from './components/searcher/SearcherPage';
import NotFoundPage from './components/common/NotFoundPage';
import userActions from './redux/actions/userActions';

import {createHistory, useBasename} from 'history';
import {Provider} from 'react-redux';
import {connect} from 'react-redux';

class MainRoutes extends React.Component {
  constructor() {
    super();
    this.onEnter = this.onEnter.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }
  onEnter(nextState, replace, callback) {
    var payload,
      isInitializing;
    var check = function() {
      payload = this.props.user.get('payload').toObject();
      isInitializing = this.props.user.get('isInitializing');
      if (payload.username) {
        callback();
      } else if (isInitializing) {
        setTimeout(check, 100);
      } else {
        if (window.location.search) {
          window.location = '/login' + window.location.search + '&callback=' + window.location.pathname;
        } else {
          window.location = '/login?callback=' + window.location.pathname;
        }
      }
    }.bind(this);

    check();
  }
  render() {
    return (
      <Router history={browserHistory}>
        <Route path="resource/" component={App}>
          <IndexRoute components={HomePage}/>
          <Route name="home" path="home" components={HomePage}/>
          <Route name="searcher" path="searcher" components={SearcherPage}/>
          <Route name="subjectSearcher" path="searcher/:subject" components={SearcherPage}/>
          <Route path="about" components={AboutPage}/>
          <Route onEnter={this.onEnter} name="disk" path="disk" components={DiskPage}/>
          <Route path="*" components={NotFoundPage}/>
        </Route>
      </Router>
    );
  }
}
var selector = function(state) {
  return {user: state.user};
};
export default connect(selector)(MainRoutes);
