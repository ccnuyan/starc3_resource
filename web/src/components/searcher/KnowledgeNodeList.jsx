import React, {PropTypes} from 'react';
import style from './SearcherPage.scss';
import styleable from 'react-styleable';
import helpers from '../../helpers.scss';
import classnames from 'classnames';
import diskActions from '../../redux/actions/diskActions';
import {connect} from 'react-redux';
import searcherActions from '../../redux/actions/searcherActions';

class KnowledgeNodeList extends React.Component {

  constructor() {
    super();
    this.onSearch = this.onSearch.bind(this);
  }

  onSearch(event) {
    this.props.onKnowledgeSearch(event.target.dataset.key);
  }

  render() {
    var css = this.props.css;

    var knowledgeNodes = this.props.searcher.get('knowledgeNodes');
    var activeKnowledgeNodeId = this.props.searcher.getIn(['activeKnowledgeNode', '_id']);
    var nodes = knowledgeNodes.size !== 0
      ? Object.keys(knowledgeNodes.toObject()).map(key => knowledgeNodes.toObject()[key].toObject())
      : [];

    var createKnowledgeNodeRow = function(node) {
      return <button data-key={node._id} onClick={this.onSearch} className={classnames(helpers[node._id === activeKnowledgeNodeId
          ? 'primaryButton'
          : 'button-hollow'], helpers['font-smallest'], css.knowledgeButton)} key={node._id}>{node.title}</button>;
    }.bind(this);
    return (
      <div>
        {nodes.map(createKnowledgeNodeRow)}
      </div>
    );
  }
}

var selector = function(state) {
  return {user: state.user, searcher: state.searcher};
};

export default connect(selector)(styleable(style)(KnowledgeNodeList));
