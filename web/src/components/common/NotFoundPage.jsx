import React, {PropTypes} from 'react';
import style from './NotFoundPage.scss';
import styleable from 'react-styleable';
import classnames from 'classnames';
import helpers from '../../helpers.scss';

class NotFoundPage extends React.Component {
  render() {
    var css = this.props.css;
    return (
      <div className={css.pageContainer}>
        <div className={helpers['container-mid']}>
          <h1 className={classnames(css.primaryHeading, helpers['horizontal-center'])}>
            没找到你要的东西
          </h1>
        </div>
      </div>
    );
  }
}

export default styleable(style)(NotFoundPage);
