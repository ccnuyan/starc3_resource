import React, {PropTypes} from 'react';
import style from './Disk.scss';
import styleable from 'react-styleable';
import helpers from '../../helpers.scss';
import classnames from 'classnames';
import diskActions from '../../redux/actions/diskActions';
import {connect} from 'react-redux';

class Directory extends React.Component {
  constructor() {
    super();
    this.onTakeAction = this.onTakeAction.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      directoryName: ''
    };
  }

  onRemove(event) {
    event.stopPropagation();

    diskActions.dispatchRemoveDirectoryAsync({id: this.props.directory._id, parentId: this.props.directory.parent})(this.props.dispatch, function() {
      return this.props.disk;
    }.bind(this));
  }

  onEdit(event) {
    event.stopPropagation();
    this.setState({directoryName: this.props.directory.name});
    this.props.dispatch(diskActions.editDirectory({id: this.props.directory._id}));
    this.refs['directoryInput'].focus();
  }

  onConfirm(event) {
    event.stopPropagation();
    diskActions.dispatchRenameDirectoryAsync({
      id: this.props.directory._id,
      parentId: this.props.directory.parent,
      body: {
        name: this.state.directoryName
      }
    })(this.props.dispatch, function() {
      return this.props.disk;
    }.bind(this));
  }

  onChange(event) {
    event.stopPropagation();
    if (event.target.value.length < 16) {
      this.setState({directoryName: event.target.value});
    }
  }

  onTakeAction() {
    event.stopPropagation();
    var fileId = this.props.disk.getIn(['fileToBeMoved', '_id']);
    var currentDirectoryId = this.props.disk.getIn(['currentDirectory', '_id']);
    var isMoving = !!fileId;
    if (isMoving) {
      diskActions.dispatchMoveFileAsync({fileId: fileId, targetDirectoryId: this.props.directory._id, sourceDirectoryId: currentDirectoryId})(this.props.dispatch, function() {
        return this.props.disk;
      }.bind(this));
    } else {
      diskActions.dispatchDiveIntoDirectoryAsync({id: this.props.directory._id, parentId: this.props.directory.parent})(this.props.dispatch, function() {
        return this.props.disk;
      }.bind(this));
    }
  }
  render() {
    var css = this.props.css;
    var editStatus = this.props.disk.get('editStatus');
    var subitemsCount = this.props.directory.subDirectories.length + this.props.directory.subFiles.length;
    var opacity = (editStatus && this.props.directory.isEditing)
      ? 1
      : 0;
    var display = (editStatus && this.props.directory.isEditing)
      ? 'none'
      : 'block';
    var isMoving = !!this.props.disk.getIn(['fileToBeMoved', '_id']);
    return <div style={{
      zIndex: isMoving
        ? 10
        : 0
    }} className={classnames(css.directory)}>
      <div style={{
        opacity: opacity
      }} className={classnames(css.directoryInputDiv)}>
        <input onChange={this.onChange} value={this.state.directoryName} ref="directoryInput" className={classnames(helpers['input-text'], css.directoryInput)} type="text"></input>
      </div>
      <div style={{
        display: display,
        zIndex: isMoving
          ? 10
          : 0
      }} onClick={this.onTakeAction} className={classnames(css.directoryName)}>
        <i className="fa fa-folder"></i>
        <span>{this.props.directory.name}</span>
      </div>
      <div className={classnames(css.subItemsTag, helpers['float-right'])}>
        <div className={classnames(helpers['vertical-center'])}>{`[${subitemsCount}]`}</div>
      </div>
      {editStatus
        ? <div className={classnames(css.directoryOptions)}>
            <button onClick={this.onRemove} className={classnames(helpers['errorButton'], css.optionButton, css.itemButton)}>
              <i className={classnames('fa', 'fa-close')}></i>
            </button>
            {this.props.directory.isEditing
              ? <button onClick={this.onConfirm} className={classnames(helpers['successButton'], css.optionButton, css.itemButton)}>
                  <i className={classnames('fa', 'fa-check')}></i>
                </button>
              : <button onClick={this.onEdit} className={classnames(helpers['primaryButton'], css.optionButton, css.itemButton)}>
                <i className={classnames('fa', 'fa-gear')}></i>
              </button>}
          </div>
        : ''}
    </div>;
  }
}

var selector = function(state) {
  return {user: state.user, disk: state.disk};
};

export default connect(selector)(styleable(style)(Directory));
