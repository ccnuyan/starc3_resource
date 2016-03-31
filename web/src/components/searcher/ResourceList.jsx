import React, {PropTypes} from 'react';
import style from './SearcherPage.scss';
import styleable from 'react-styleable';
import helpers from '../../helpers.scss';
import classnames from 'classnames';
import diskActions from '../../redux/actions/diskActions';
import {connect} from 'react-redux';

class ResourceList extends React.Component {
  render() {
    var css = this.props.css;

    var resources = this.props.searcher.get('resources');
    var urs = resources.size !== 0
      ? Object.keys(resources.toObject()).map(key => resources.toObject()[key].toObject())
      : [];

    var rs = _.sortBy(urs, ['score']).reverse();

    var createResourceRow = function(node) {

      return node.res_meta_type === 'link'
        ? <div className={classnames(css.resourceEach)}>
            <div className={classnames(css.resourceEachTitle, helpers['font-smaller'])}>
              知识点：{node.knowledgeNode.title}
            </div>
            <a target="about:blank" href={node.linkObject.uri} key={node._id}>{node.title}</a>
          </div>
        : <div className={classnames(css.resourceEach)} key={node._id}>{node.title}</div>;
    };
    return (
      <div className={classnames(css.resourceContainer, helpers['container-mid'])}>
        {rs.map(createResourceRow)}
      </div>
    );
  }
}

var selector = function(state) {
  return {user: state.user, searcher: state.searcher};
};

export default connect(selector)(styleable(style)(ResourceList));
