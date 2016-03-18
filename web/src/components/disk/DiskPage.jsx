import React, {PropTypes} from 'react';
import style from './Disk.scss';
import styleable from 'react-styleable';
import helpers from '../../helpers.scss';
import classnames from 'classnames';
import diskActions from '../../redux/actions/diskActions';
import {connect} from 'react-redux';
import DirectoryList from './DirectoryList';
import FileList from './FileList';
import Options from './Options';
import NewDirectory from './NewDirectory';

class DiskPage extends React.Component {
  constructor() {
    super();
    this.onSwitchEditStatus = this.onSwitchEditStatus.bind(this);
  }
  componentWillMount() {
    diskActions.dispatchGetRootAsync()(this.props.dispatch, function() {
      return this.props.disk;
    }.bind(this));
  }

  onSwitchEditStatus() {
    this.props.dispatch(diskActions.switchEditStatus());
  }

  render() {
    var css = this.props.css;
    var newDirectoryShown = this.props.disk.get('newDirectoryShown');
    var isMoving = !!this.props.disk.getIn(['fileToBeMoved', '_id']);
    var currentDirectory = this.props.disk.get('currentDirectory').toObject();
    var editStatus = this.props.disk.get('editStatus');
    return (
      <div className={classnames(helpers['container-mid'])}>
        <div className={classnames(css.pageContainer, helpers['grid-parent'])}>
          <h1 className={classnames(css.primaryHeading, helpers['center'])}>个人网盘</h1>
          <div className={classnames(css.optionsGrid, helpers['grid-child'])}>
            <Options></Options>
          </div>
          <div className={classnames(css.directoryListGrid, helpers['grid-child'])}>
            {newDirectoryShown
              ? (
                <NewDirectory></NewDirectory>
              )
              : ''}
            <DirectoryList></DirectoryList>
          </div>
          <div className={classnames(css.fileListGrid, helpers['grid-child'])}>
            <FileList></FileList>
          </div>
        </div>

        {currentDirectory._id
          ? <div className={classnames(helpers['center'], css.editModeSwitcher)}>
              <div onClick={this.onSwitchEditStatus} className={classnames(helpers['empty-button'])}>
                {editStatus
                  ? <i className="fa fa-2x fa-toggle-on"/>
                  : <i className="fa fa-2x fa-toggle-off"/>}
                <div style={{
                  fontSize: '60%'
                }}>编辑模式</div>
              </div>
            </div>
          : ''}

        {isMoving
          ? <div className={css.movingOverlay}></div>
          : ''}
      </div>
    );
  }
}

var selector = function(state) {
  return {user: state.user, disk: state.disk};
};

DiskPage.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default connect(selector)(styleable(style)(DiskPage));
