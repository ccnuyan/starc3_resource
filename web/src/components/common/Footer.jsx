import React, {PropTypes} from 'react';
import styleable from 'react-styleable';
import style from './Footer.scss';
import helpers from '../../helpers.scss';

class Footer extends React.Component {
  render () {
    var css  = this.props.css;
    return (
      <footer className={css.footer}>
        <div className={helpers['container-full']}>
          <div className={helpers['grid-parent']}>
            <div className={this.props.css.footerCopyrightBlock}>
              <div>Copyright 2016, NERCEL, Inc. All rights reserved.</div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default styleable(style)(Footer);
