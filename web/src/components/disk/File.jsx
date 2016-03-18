import React, {PropTypes} from 'react';
import style from './Disk.scss';
import styleable from 'react-styleable';
import helpers from '../../helpers.scss';
import classnames from 'classnames';
import diskActions from '../../redux/actions/diskActions';
import {connect} from 'react-redux';
import mapping from './iconMapping';

class File extends React.Component {
  constructor() {
    super();

    this.onRemove = this.onRemove.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onDownload = this.onDownload.bind(this);
    this.onMove = this.onMove.bind(this);

    this.state = {
      fileName: ''
    };
  }

  onRemove(event) {
    event.stopPropagation();

    diskActions.dispatchRemoveFileAsync({id: this.props.file._id, parentId: this.props.file.parent})(this.props.dispatch, function() {
      return this.props.disk;
    }.bind(this));
  }

  onEdit(event) {
    event.stopPropagation();
    this.setState({fileName: this.props.file.name});
    this.props.dispatch(diskActions.editFile({id: this.props.file._id}));
    this.refs['fileInput'].focus();
  }

  onMove(event) {
    event.stopPropagation();
    this.props.dispatch(diskActions.switchToMoveMode({id: this.props.file._id}));
  }

  onConfirm(event) {
    event.stopPropagation();
    diskActions.dispatchRenameFileAsync({
      id: this.props.file._id,
      parentId: this.props.file.parent,
      body: {
        name: this.state.fileName
      }
    })(this.props.dispatch, function() {
      return this.props.disk;
    }.bind(this));
  }

  onChange(event) {
    event.stopPropagation();
    if (event.target.value.length < 16) {
      this.setState({fileName: event.target.value});
    }
  }

  onDownload() {
    event.stopPropagation();
    diskActions.dispatchRequestDownloadAsync({id: this.props.file._id, parentId: this.props.file.parent})(this.props.dispatch, function() {
      return this.props.disk;
    }.bind(this));
  }
  render() {
    var css = this.props.css;
    var editStatus = this.props.disk.get('editStatus');
    var opacity = (editStatus && this.props.file.isEditing)
      ? 1
      : 0;
    var display = (editStatus && this.props.file.isEditing)
      ? 'none'
      : 'block';

    var isMoving = !!this.props.disk.getIn(['fileToBeMoved', '_id']);
    var isThisMoving = isMoving
      ? this.props.disk.getIn(['fileToBeMoved', '_id']) === this.props.file._id
      : false;

    var icon = mapping[this.props.file.fileObject.extension.toLowerCase()];
    if(!icon) icon = 'fa fa-file-o';
    return <div style={{
      zIndex: isThisMoving
        ? 10
        : 0
    }} className={classnames(css.file)}>
      <div style={{
        opacity: opacity
      }} className={classnames(css.fileInputDiv)}>
        <input ref="fileInput" onChange={this.onChange} value={this.state.fileName} className={classnames(helpers['input-text'], css.fileInput)} type="text"></input>
      </div>
      <div style={{
        display: display
      }} onClick={this.onDownload} className={classnames(css.fileName)}>
        <i className={icon}></i>
        <span>{this.props.file.name}</span>
      </div>
      {editStatus
        ? <div className={classnames(css.fileOptions)}>
            <button onClick={this.onMove} className={classnames(helpers['button'], css.optionButton, css.itemButton)}>
              <i className={classnames('fa', 'fa-list-ul')}></i>
            </button>
            {!isThisMoving
              ? <button onClick={this.onRemove} className={classnames(helpers['errorButton'], css.optionButton, css.itemButton)}>
                  <i className={classnames('fa', 'fa-close')}></i>
                </button>
              : ''}
            {!isThisMoving
              ? this.props.file.isEditing
                ? <button onClick={this.onConfirm} className={classnames(helpers['successButton'], css.optionButton, css.itemButton)}>
                    <i className={classnames('fa', 'fa-check')}></i>
                  </button>
                : <button onClick={this.onEdit} className={classnames(helpers['primaryButton'], css.optionButton, css.itemButton)}>
                    <i className={classnames('fa', 'fa-gear')}></i>
                  </button>
              : ''}
          </div>
        : ''}
    </div>;;
  }
}

var selector = function(state) {
  return {user: state.user, disk: state.disk};
};

export default connect(selector)(styleable(style)(File));
