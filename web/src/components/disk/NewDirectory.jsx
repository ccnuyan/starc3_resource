import React, {PropTypes} from 'react';
import style from './Disk.scss';
import styleable from 'react-styleable';
import helpers from '../../helpers.scss';
import classnames from 'classnames';
import diskActions from '../../redux/actions/diskActions';
import {connect} from 'react-redux';

class NewDirectory extends React.Component {
  constructor() {
    super();
    this.onCreateNewDirectory = this.onCreateNewDirectory.bind(this);
  }

  onCreateNewDirectory() {
    var currentDirectory = this.props.disk.get('currentDirectory').toObject();
    if (currentDirectory && currentDirectory._id) {
      var query = {
        parentId: currentDirectory._id,
        body: {
          name: this.refs['newDirectoryInput'].value
        }
      };
      diskActions.dispatchCreateNewDirectoryAsync(query)(this.props.dispatch, function() {
        return this.props.disk;
      }.bind(this));
    }
  }

  render() {
    var css = this.props.css;

    return <div className={classnames(css.directory)}>
      <div className={classnames(css.directoryInputDiv)}>
        <input ref="newDirectoryInput" className={classnames(helpers['input-text'], css.directoryInput)} type="text"></input>
      </div>
      <div className={classnames(css.directoryOptions)}>
        <button ref="submit" onClick={this.onCreateNewDirectory} className={classnames(helpers['successButton'], css.optionButton, css.itemButton)}>
          <i className={classnames('fa', 'fa-check')}></i>
        </button>
      </div>
    </div>;
  }
}

var selector = function(state) {
  return {user: state.user, disk: state.disk};
};

export default connect(selector)(styleable(style)(NewDirectory));
