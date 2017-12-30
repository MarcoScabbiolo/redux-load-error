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

const newStore = options =>
  createStore(
    preReducer(reducer, loadingActions, notLoadingActions, errorActions, options)
  );
const assertLoading = (store, loadingProp = 'loading') =>
  assert.strictEqual(store.getState()[loadingProp], true);
const assertNotLoading = (store, loadingProp = 'loading') =>
  assert.strictEqual(store.getState()[loadingProp], false);
const assertError = (store, erorrProp = 'error') =>
  assert.strictEqual(store.getState()[erorrProp], 'test');
const assertNoError = (store, erorrProp = 'error') =>
  assert.strictEqual(store.getState()[erorrProp], undefined);

describe('redux-load-error', () => {
  it('runs only with a reducer', () => {
    assert.doesNotThrow(() => createStore(preReducer(reducer)));
  });
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

  it('changes the loading property', () => {
    const loadingProp = 'otherLoading';
    let store = newStore({ loadingProp });
    store.dispatch({ type: loadingActions[0] });
    assertLoading(store, loadingProp);
    assert.strictEqual(store.getState().loading, undefined);
    store.dispatch({ type: notLoadingActions[0] });
    assertNotLoading(store, loadingProp);
    assert.strictEqual(store.getState().loading, undefined);
  });

  it('changes the error property', () => {
    const errorProp = 'otherError';
    let store = newStore({ errorProp });
    store.dispatch({ type: errorActions[0], error: testError });
    assertError(store, errorProp);
    assert.strictEqual(store.getState().error, undefined);
    store.dispatch({ type: notLoadingActions[0] });
    assertNoError(store, errorProp);
    assert.strictEqual(store.getState().error, undefined);
  });

  it('keeps the error', () => {
    let store = newStore({ keepErrors: true });
    store.dispatch({ type: errorActions[0], error: testError });
    store.dispatch({ type: notLoadingActions[0] });
    assertError(store);
    const errorProp = 'otherError';
    store = newStore({ keepErrors: true, errorProp });
    store.dispatch({ type: errorActions[0], error: testError });
    store.dispatch({ type: notLoadingActions[0] });
    assertError(store, errorProp);
  });
});
