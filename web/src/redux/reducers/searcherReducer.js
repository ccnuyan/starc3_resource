import immutable from 'immutable';
import actionTypes from '../actionTypes';
import myHumane from '../../service/myHumane';

var SEACHER_STATE = {
  subjects: immutable.Map({}),
  activeSubject: immutable.Map({}),
  knowledgeNodes: immutable.Map({}),
  activeKnowledgeNode: immutable.Map({}),
  resources: immutable.Map({}),
};

var searcherReducer = function(state = SEACHER_STATE, action) {
  switch (action.type) {

    case actionTypes.SUBJECT_SET_ALL:
      state = state.set('activeSubject', immutable.Map({}));
      state = state.set('knowledgeNodes', immutable.Map({}));
      return state;

    case actionTypes.SUBJECT_SET_ACTIVE:
      state = state.set('activeSubject', state.getIn(['subjects', action.key]));
      state = state.set('knowledgeNodes', immutable.Map({}));
      return state;

      //Get KnowledgeNodes
    case actionTypes.BEFORE_SEARCH_KNOWLEDGENODES:
      state = state.set('loading', true);
      state = state.set('resources', immutable.Map({}));
      state = state.set('knowledgeNodes', immutable.Map({}));
      return state;
    case actionTypes.AFTER_SEARCH_KNOWLEDGENODES:
      var ks = action.result;
      ks.forEach(function(k) {
        state = state.setIn(['knowledgeNodes', k._id], immutable.Map(k));
      });
      return state;
    case actionTypes.ERROR_SEARCH_KNOWLEDGENODES:
      state = state.set('resources', immutable.Map({}));
      state = state.set('knowledgeNodes', immutable.Map({}));
      state = state.set('loading', false);
      return state;

      //Get Resources
    case actionTypes.BEFORE_SEARCH_RESOURCES:
      state = state.set('loading', true);
      state = state.set('resources', immutable.Map({}));
      return state;
    case actionTypes.AFTER_SEARCH_RESOURCES:
      var ks = action.result.resources;
      ks.forEach(function(k) {
        state = state.setIn(['resources', k._id], immutable.Map(k));
      });
      return state;
    case actionTypes.ERROR_SEARCH_RESOURCES:
      state = state.set('resources', immutable.Map({}));
      state = state.set('loading', false);
      return state;


      //Get Resources
    case actionTypes.BEFORE_SEARCH_KNOWLEDGENODE_RESOURCES:
      state = state.set('activeKnowledgeNode', immutable.Map({}));

      state = state.set('loading', true);
      state = state.set('resources', immutable.Map({}));
      return state;
    case actionTypes.AFTER_SEARCH_KNOWLEDGENODE_RESOURCES:
      var knowledgeNode = action.result;
      var kn = state.getIn(['knowledgeNodes', knowledgeNode._id]);
      state = state.set('activeKnowledgeNode', kn);
      var ks = action.result.resources;
      ks.forEach(function(k) {
        state = state.setIn(['resources', k._id], immutable.Map(k));
      });
      return state;
    case actionTypes.ERROR_SEARCH_KNOWLEDGENODE_RESOURCES:
      state = state.set('activeKnowledgeNode', immutable.Map({}));

      state = state.set('resources', immutable.Map({}));
      state = state.set('loading', false);
      return state;

    default:
      return state;
  }
};

export default searcherReducer;
