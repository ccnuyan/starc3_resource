import React, {PropTypes} from 'react';
import style from './Disk.scss';
import styleable from 'react-styleable';
import helpers from '../../helpers.scss';
import classnames from 'classnames';
import diskActions from '../../redux/actions/diskActions';
import {connect} from 'react-redux';
import Directory from './Directory';

class DirectoryList extends React.Component {
  render() {
    var css = this.props.css;
    var isMoving = !!this.props.disk.getIn(['fileToBeMoved', '_id']);

    var createDirectoryRow = function(directory) {
      directory = directory.toObject();
      return <Directory key={directory._id} directory={directory}></Directory>;
    };
    var currentDirectory = this.props.disk.get('currentDirectory').toObject();
    var loading = this.props.disk.get('loading');
    var directories = isMoving
      ? this.props.disk.get('directories').filter(function(directory) {
        return directory.get('_id') !== currentDirectory._id;
      }).toList()
      : this.props.disk.get('directories').filter(function(directory) {
        return directory.get('parent') === currentDirectory._id;
      }).toList();
    return (
      <div>
        {!directories.size && !loading
          ? <div className={classnames(css.emptyWarning)}>这里还没有目录，请创建</div>
          : ''}
        {directories.map(createDirectoryRow)}
      </div>
    );
  }
}

var selector = function(state) {
  return {user: state.user, disk: state.disk};
};

export default connect(selector)(styleable(style)(DirectoryList));
