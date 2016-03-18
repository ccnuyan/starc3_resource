import React, {PropTypes} from 'react';
import style from './HomePage.scss';
import styleable from 'react-styleable';
import helpers from '../helpers.scss';
import classnames from 'classnames';
import backgroundImage from '../resource/background.jpg';
import {connect} from 'react-redux';
import _ from 'lodash';
import SeacherPage from './searcher/SearcherPage.jsx';

class HomePage extends React.Component {

  render() {
    var css = this.props.css;

    return (
      <div className={css.home}>
        <div style={{
          backgroundImage: 'Url("' + backgroundImage + '")'
        }} className={classnames(css.backgroundBlockHome, helpers['background-block'])}>
          <div className={classnames(css.infoBlock, helpers['center'])}>
            <h1 className={css.homeHeading}>starC 3 - Resource</h1>
          </div>
          <div className={helpers['overlay']}></div>
        </div>
      </div>
    );
  }
}

HomePage.contextTypes = {
  router: React.PropTypes.object.isRequired
};

var selector = function(state) {
  return {user: state.user, searcher: state.searcher};
};

export default connect(selector)(styleable(style)(HomePage));
