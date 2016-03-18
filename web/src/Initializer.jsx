import React, {PropTypes} from 'react';
import MainRoutes from './MainRoutes';
import userActions from './redux/actions/userActions';
import helpers from './helpers.scss';
import styleable from 'react-styleable';
import {connect} from 'react-redux';
import style from './Initializer.scss';
import classnames from 'classnames';

class Initializer extends React.Component {
  componentWillMount() {
    var token = window.localStorage.getItem('userToken');
    if (token) {
      userActions.dispatchIntializeAsync()(this.props.dispatch, function() {
        return this.props.user;
      }.bind(this));
    }
  }
  render() {
    var css = this.props.css;
    var isInitializing = this.props.user.get('isInitializing');

    return (
      <div>
        {(isInitializing)
          ? <div className={css.spinnerContainer}>
              <div className={classnames(css.spinner, helpers['dead-center'])}>
                <div className={css.bounce1}></div>
                <div className={css.bounce2}></div>
                <div className={css.bounce3}></div>
              </div>
            </div>
          : ''}
        <MainRoutes></MainRoutes>
      </div>
    );
  }
}

var selector = function(state) {
  return {user: state.user};
};
export default connect(selector)(styleable(style)(Initializer));
