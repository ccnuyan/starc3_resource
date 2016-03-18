import React, {PropTypes} from 'react';
import style from './App.scss';
import Header from './common/Header';
import Footer from './common/Footer';
import helpers from '../helpers.scss';
import styleable from 'react-styleable';
import userActions from '../redux/actions/userActions';
import {connect} from 'react-redux';
import classnames from 'classnames';

class App extends React.Component {
  constructor() {
    super();
  }
  render() {
    var css = this.props.css;

    return (
      <div className={css.app}>
        <Header></Header>
        <div className={css.pageContent}>
          {this.props.children}
        </div>
        <Footer></Footer>
      </div>
    );
  }
}

var selector = function(state) {
  return {user: state.user};
};

App.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default connect(selector)(styleable(style)(App));
