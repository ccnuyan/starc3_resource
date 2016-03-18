import React, {PropTypes} from 'react';
import {PropTypes as RouterPropTypes} from 'react-router';
import {IndexLink, Link} from 'react-router';
import style from './Header.scss';
import helpers from '../../helpers.scss';
import styleable from 'react-styleable';
import classnames from 'classnames';
import userActions from '../../redux/actions/userActions';
import {connect} from 'react-redux';

class Header extends React.Component {
  constructor() {
    super();
    this.logout = this.logout.bind(this);
  }

  logout() {
    this.props.dispatch(userActions.logout());
    this.context.router.push('/resource/home');
  }

  render() {
    var isActive = function(name) {
      var flag = this.context.router.isActive(name);
      if (flag)
        return true;
      return false;
    }.bind(this);

    var css = this.props.css;
    var payload = this.props.user.get('payload').toObject();
    return (
      <header className={classnames(css.header, helpers['header'])}>
        <div className={helpers['clearfix']}>
          <div className={classnames(css.logoBlock, helpers['grid-child'], helpers['vertical-center'])}>
            <IndexLink to="/resource/home" className={classnames(css.logo, helpers['grid-child'], helpers['font-largest'])}>
              starC 3 - Resource
            </IndexLink>
          </div>
          <div className={css.navBlock}>
            <ul className={classnames(css.nav, helpers['ul-base'])}>
              {!payload.username
                ? <li>
                    <a href={'/login?callback=' + window.location.href}>
                      登录
                    </a>
                  </li>
                : ''}
              {payload.username
                ? <li>
                    <a href="/">
                      {payload.username}
                    </a>
                  </li>
                : ''}
              {payload.username
                ? <li>
                    <a onClick={this.logout}>
                      注销
                    </a>
                  </li>
                : ''}
            </ul>
          </div>
        </div>
      </header>
    );
  }
}

Header.contextTypes = {
  router: React.PropTypes.object.isRequired
};

function select(state) {
  return {dispatch: state.user.dispatch, user: state.user};
}

export default connect(select)(styleable(style)(Header));
