import { assert } from 'chai';
import preReducer from '../index';
import { createStore } from 'redux';

const identityAction = 'identiy';
const fooChangedAction = 'foo-change';
const fooChangedActionCreator = foo => ({ type: fooChangedAction, foo });
const loadingActions = ['loading/1', 'loading/2'];
const notLoadingActions = ['not-loading/1', 'not-loading/2'];
const errorActions = ['error/1', 'error/2'];
const testError = 'test';
const reducer = (state = { foo: 'foo' }, action) => {
  switch (action.type) {
    case identityAction:
      return { ...state };
    case fooChangedAction:
      return { ...state, foo: action.foo };
    default:
      return state;
  }
};

const newStore = advanced =>
  createStore(
    preReducer(reducer, loadingActions, notLoadingActions, errorActions, advanced)
  );
const assertLoading = store => assert.equal(store.getState().loading, true);
const assertNotLoading = store => assert.equal(store.getState().loading, false);
const assertError = store => assert.equal(store.getState().error, 'test');
const assertNoError = store => assert.equal(store.getState().error, undefined);

describe('redux-load-error', () => {
  it('sets and unsets loading', () => {
    let store = newStore();
    store.dispatch({ type: loadingActions[0] });
    assertLoading(store);
    store.dispatch({ type: notLoadingActions[1] });
    assertNotLoading(store);
    store.dispatch({ type: loadingActions[1] });
    assertLoading(store);
    store.dispatch({ type: errorActions[0], error: testError });
    assertNotLoading(store);
  });
  it('sets and unsets error', () => {
    let store = newStore();
    store.dispatch({ type: errorActions[0], error: testError });
    assertError(store);
    store.dispatch({ type: loadingActions[0] });
    assertNoError(store);
    store.dispatch({ type: errorActions[0], error: testError });
    assertError(store);
    store.dispatch({ type: notLoadingActions[0] });
    assertNoError(store);
  });
  it('preserves the original reducer functionality', () => {
    let store = newStore();
    assert.deepEqual(store.getState(), { foo: 'foo' });
    store.dispatch({ type: identityAction });
    assert.deepEqual(store.getState(), { foo: 'foo' });
    store.dispatch(fooChangedActionCreator('newFoo'));
    assert.deepEqual(store.getState(), { foo: 'newFoo' });
    store.dispatch({ type: loadingActions[0] });
    store.dispatch({ type: notLoadingActions[0] });
    store.dispatch({ type: errorActions[0], error: testError });
    assert.deepEqual(store.getState(), {
      foo: 'newFoo',
      loading: false,
      error: testError
    });

    let prevState = store.getState();
    store.dispatch({ type: 'unexistent' });
    assert.strictEqual(prevState, store.getState());
  });
});
