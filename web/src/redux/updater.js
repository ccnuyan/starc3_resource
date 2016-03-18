import {is} from 'immutable';

export default {
  shouldContainerUpdate: function(nextProps, nextState) {
    const thisProps = this.props || {};

    if (Object.keys(thisProps).length !== Object.keys(nextProps).length) {
      return true;
    }

    for (const key in nextProps) {
      if (thisProps[key] !== nextProps[key] || !is(thisProps[key], nextProps[key])) {
        return true;
      }
    }

    const thisState = this.state || {};

    if (Object.keys(thisState).length !== Object.keys(nextState).length) {
      return true;
    }

    for (const key in nextState) {
      if (thisState[key] !== nextState[key] || !is(thisState[key], nextState[key])) {
        return true;
      }
    }
    return false;
  },
  shouldComponentUpdate: function(nextProps) {
    const thisProps = this.props || {};

    if (Object.keys(thisProps).length !== Object.keys(nextProps).length) {
      return true;
    }

    for (const key in nextProps) {
      if (thisProps[key] !== nextProps[key] || !is(thisProps[key], nextProps[key])) {
        return true;
      }
    }
    return false;
  }
};
