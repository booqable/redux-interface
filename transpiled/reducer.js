'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UPDATE_UI = undefined;
exports.default = reducer;
exports.updateUI = updateUI;
exports.mountUI = mountUI;
exports.unmountUI = unmountUI;

var _immutable = require('immutable');

var UPDATE_UI = exports.UPDATE_UI = 'UPDATE_UI';
var MOUNT_UI = 'MOUNT_UI';
var UNMOUNT_UI = 'UNMOUNT_UI';

var defaultState = new _immutable.Map({});

function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments[1];

  var key = action.payload && action.payload.key;

  switch (action.type) {
    case MOUNT_UI:
      var defaults = action.payload.defaults;

      var Defaults = (0, _immutable.Record)(defaults);

      state = state.set(key, new Defaults());
      break;
    case UPDATE_UI:
      var values = action.payload.values;


      if (state.get(key)) {
        for (var propertyName in values) {
          state = state.setIn([key, propertyName], values[propertyName]);
        }
      }
      break;
    case UNMOUNT_UI:
      state = state.delete(key);
      break;
  }

  return state;
}

function updateUI(key, values) {
  return {
    type: UPDATE_UI,
    payload: {
      key: key,
      values: values
    }
  };
}

function mountUI(key, defaults) {
  return {
    type: MOUNT_UI,
    payload: {
      key: key,
      defaults: defaults
    }
  };
}

function unmountUI(key) {
  return {
    type: UNMOUNT_UI,
    payload: {
      key: key
    }
  };
}