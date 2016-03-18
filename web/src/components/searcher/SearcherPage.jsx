import React, {PropTypes} from 'react';
import style from './SearcherPage.scss';
import styleable from 'react-styleable';
import helpers from '../../helpers.scss';
import classnames from 'classnames';
import backgroundImage from '../../resource/background.jpg';
import {connect} from 'react-redux';
import _ from 'lodash';
import seacherActions from '../../redux/actions/searcherActions';
import KnowledgeNodeList from './KnowledgeNodeList';
import ResourceList from './ResourceList';

class SearcherPage extends React.Component {
  constructor() {
    super();
    this.goSearch = this.goSearch.bind(this);
    this.setSubjectActive = this.setSubjectActive.bind(this);
    this.setSubjectAll = this.setSubjectAll.bind(this);
  }

  componentDidMount() {
    if (this.props.routeParams.subject) {
      var subject = this.props.routeParams.subject;
      this.props.dispatch(seacherActions.onSetSubjectActive(subject));
    }
  }

  goSearch() {
    var term = this.refs['searchInput'].value;
    var subjectId = this.props.searcher.getIn(['activeSubject', 'key']);
    var knowledgeNodeId = this.props.searcher.getIn(['activeKnowledgeNode', 'key']);

    console.log(subjectId);
    console.log(knowledgeNodeId);

    if (subjectId) {
      var knowledgeNodeQuery = {
        subject: subjectId,
        term: term
      };

      seacherActions.dispatchSearchKnowledgenodesAsync(knowledgeNodeQuery)(this.props.dispatch, function() {
        return this.props.searcher;
      }.bind(this));
    }

    var resourceQuery = {
      perPage: 100,
      page: 1,
      term: term
    };

    if (subjectId) {
      resourceQuery.subject = subjectId;
    }
    if (knowledgeNodeId) {
      resourceQuery.knowledgeNode = knowledgeNodeId;
    }

    seacherActions.dispatchSearchResourcesAsync(resourceQuery)(this.props.dispatch, function() {
      return this.props.searcher;
    }.bind(this));

  }

  setSubjectActive(event) {
    this.props.dispatch(seacherActions.onSetSubjectActive(event.target.dataset['subject']));
  }

  setSubjectAll(event) {
    this.props.dispatch(seacherActions.onSetSubjectAll());
  }

  render() {
    var css = this.props.css;

    var subjects = this.props.searcher.get('subjects').toObject();

    var activeSubject = this.props.searcher.get('activeSubject');

    var subjectTobeDiskplayed = _.reduce(Object.keys(subjects), function(sum, key) {
      var sbj = subjects[key].toObject();
      if (sbj.type !== 'standalone') {
        sum.push(sbj);
      }
      return sum;
    }, []);

    return (
      <div className={classnames(helpers['container-mid'])}>
        <div className={classnames(css.pageContainer, helpers['grid-parent'])}>
          <h1 className={classnames(css.primaryHeading, helpers['center'])}>{activeSubject.toObject().name
              ? activeSubject.toObject().name + '资源搜索'
              : '资源搜索'}</h1>
        </div>
        <div className={classnames(helpers['center'])}>
          {!(activeSubject && activeSubject.toObject().type === 'standalone')
            ? <div>
                {subjectTobeDiskplayed.map(function(sbj) {
                  return <button onClick={this.setSubjectActive} data-subject={sbj.key} className={classnames(sbj.key === activeSubject.get('key')
                    ? helpers['successButton']
                    : helpers['button-hollow'], css.subjectButton, helpers['font-smallest'])} key={sbj.key}>{sbj.name}</button>;
                }.bind(this))}
                <button onClick={this.setSubjectAll} className={classnames(helpers['errorButton'], css.subjectButton, helpers['font-smallest'])}>清除选择</button>
              </div>
            : ''}
          <div style={{
            margin: 20
          }}>
            <input style={{
              margin: 5,
              paddingLeft: 15
            }} ref="searchInput" className={classnames(css.searchInput)} type="text"/>
            <button onClick={this.goSearch} className={classnames(css.searchButton, helpers['button'])}>
              <i className="fa fa-search"></i>
            </button>
          </div>
          <div>
            <KnowledgeNodeList></KnowledgeNodeList>
            <ResourceList></ResourceList>
          </div>
        </div>
      </div>
    );
  }
}

SearcherPage.contextTypes = {
  router: React.PropTypes.object.isRequired
};

var selector = function(state) {
  return {user: state.user, searcher: state.searcher};
};

export default connect(selector)(styleable(style)(SearcherPage));
