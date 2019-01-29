# redux-load-error [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Pre-reducer for UI reducers that can be loading or have an error

## Installation

```sh
$ npm install --save redux-load-error
```

## Usage

Compose your reducer with this pre-reducer to have it handle the `loading` and `error` properties for the UI component you are referencing.
You need to declare which actions will cause the component to load, display an error, or display its default content.
```js
import * as actions from 'actions';
import loadAndError from 'redux-load-error';

const loadingActions = [actions.LOADING];
const notLoadingActions = [actions.DONE];
const errorActions = [actions.ERROR];

const reducer = (state = { foo: 'foo' }, action) => {
  switch (action.type) {
    case actions.FOO:
      return { ...state, foo: action.foo };
    default:
      return state;
  }
}

export default loadAndError(reducer, loadingActions, notLoadingActions, errorActions);
```

Now the pre-reducer will handle the `loading` and `error` properties for you.

```js
import { createStore } from 'redux';
import * as actions from 'actions';
import reducer from 'reducer';

let store = createStore(reducer);

store.dispatch({ type: actions.LOADING }); 
// loading: true, error: undefined

store.dispatch({ type: actions.DONE });
// loading: false, error: undefined

store.dispatch({ type: actions.ERROR, error: 'An error' });
// loading: false, error: 'An error'
```

## Reference

### `loadAndError(reducer, loadingActions, notLoadingActions, errorActions, [options])`

#### `reducer`

The base reducer to compose

#### `loadingActions`

An array of action types that will set `loading` to `true` and `error` to `undefined`

#### `notLoadingActions`

An array of action types that will set `loading` to `false` and `error` to `undefined`

#### `errorActions`

An array of action types that will set `loading` to `false` and `error` to `action.error`

#### `options`

An object containing one, all or none of the following options:

##### `loadingProp`

A string that denotes the property key to use for `loading`, defaults to `loading`

##### `errorProp`

A string that denotes the property key to use for `error`, defaults to `error`

##### `keepErrors`

If set to `true` nothing will set the `error` property to `undefined`, you can do it in your base reducer. Defaults to `false`.

## Related

- [react-hoc-loading](https://github.com/MarcoScabbiolo/react-hoc-loading): HOC to show and hide a loading image or message across all your mayor UI components
- [react-bootstrap-hoc-error](https://github.com/MarcoScabbiolo/react-bootstrap-hoc-error): HOC to show and hide errors across all your mayor UI components using [react-bootstrap](https://react-bootstrap.github.io/)

## License

MIT © [Marco Scabbiolo]()


[npm-image]: https://badge.fury.io/js/redux-load-error.svg
[npm-url]: https://npmjs.org/package/redux-load-error
[travis-image]: https://travis-ci.org/MarcoScabbiolo/redux-load-error.svg?branch=master
[travis-url]: https://travis-ci.org/MarcoScabbiolo/redux-load-error
[daviddm-image]: https://david-dm.org/MarcoScabbiolo/redux-load-error.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/MarcoScabbiolo/redux-load-error
[coveralls-image]: https://coveralls.io/repos/MarcoScabbiolo/redux-load-error/badge.svg
[coveralls-url]: https://coveralls.io/r/MarcoScabbiolo/redux-load-error
