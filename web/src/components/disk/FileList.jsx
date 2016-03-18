import React, {PropTypes} from 'react';
import style from './Disk.scss';
import styleable from 'react-styleable';
import helpers from '../../helpers.scss';
import classnames from 'classnames';
import diskActions from '../../redux/actions/diskActions';
import {connect} from 'react-redux';
import File from './File';

class FileList extends React.Component {
  render() {
    var css = this.props.css;

    var createFileRow = function(file) {
      file = file.toObject();
      return <File key={file._id} file={file}></File>;
    };

    var currentDirectory = this.props.disk.get('currentDirectory').toObject();
    var loading = this.props.disk.get('loading');
    var files = this.props.disk.get('files').filter(function(file) {
      return file.get('parent') === currentDirectory._id;
    }).toList();

    return (
      <div>
        {!files.size && !loading
          ? <div className={classnames(css.emptyWarning)}>这里还没有文件，请上传</div>
          : ''}
        {files.map(createFileRow)}
      </div>
    );
  }
}

var selector = function(state) {
  return {user: state.user, disk: state.disk};
};

export default connect(selector)(styleable(style)(FileList));
