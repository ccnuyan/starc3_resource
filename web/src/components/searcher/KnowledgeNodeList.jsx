import React, {PropTypes} from 'react';
import style from './SearcherPage.scss';
import styleable from 'react-styleable';
import helpers from '../../helpers.scss';
import classnames from 'classnames';
import diskActions from '../../redux/actions/diskActions';
import {connect} from 'react-redux';

class KnowledgeNodeList extends React.Component {
  render() {
    var css = this.props.css;

    var knowledgeNodes = this.props.searcher.get('knowledgeNodes');
    var nodes = knowledgeNodes.size !== 0
      ? Object.keys(knowledgeNodes.toObject()).map(key => knowledgeNodes.toObject()[key].toObject())
      : [];

    var createKnowledgeNodeRow = function(node) {
      return <button className={classnames(helpers['primaryButton'],
        helpers['font-smallest'],css.knowledgeButton)} key={node._id}>{node.title}</button>;
    };
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
