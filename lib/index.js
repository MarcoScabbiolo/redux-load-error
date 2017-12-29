'use strict';

/* eslint max-params: ["error", 6] */

module.exports = function(
  reducer,
  loadingActions = [],
  notLoadingActions = [],
  errorActions = [],
  options = {
    loadingProp: 'loading',
    errorProp: 'error',
    keepErrors: false
  }
) {
  function assignState(state, loading, error) {
    let newState = {};
    newState[options.loadingProp] = loading;
    newState[options.errorProp] = options.keepErrors ? state.error : error;
    return Object.assign({}, state, newState);
  }
  return function(state, action) {
    if (loadingActions.includes(action.type)) {
      state = assignState(state, true, undefined);
    } else if (notLoadingActions.includes(action.type)) {
      state = assignState(state, false, undefined);
    } else if (errorActions.includes(action.type)) {
      state = assignState(state, false, action.error);
    }

    return reducer(state, action);
  };
};
