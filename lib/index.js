'use strict';

/* eslint max-params: ["error", 6] */

const defaultOptions = {
  loadingProp: 'loading',
  errorProp: 'error',
  keepErrors: false
};

module.exports = function(
  reducer,
  loadingActions,
  notLoadingActions,
  errorActions,
  options
) {
  loadingActions = loadingActions || [];
  notLoadingActions = notLoadingActions || [];
  errorActions = errorActions || [];
  options = Object.assign({}, defaultOptions, options || {});
  function assignState(state, loading, error) {
    var newState = {};
    newState[options.loadingProp] = loading;
    if (error || (!error && !options.keepErrors)) {
      newState[options.errorProp] = error;
    }
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
