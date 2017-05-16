'use strict';

import { Map, Record } from 'immutable';

export const UPDATE_UI = 'UPDATE_UI';
const MOUNT_UI = 'MOUNT_UI';
const UNMOUNT_UI = 'UNMOUNT_UI';

const defaultState = new Map({});

export default function reducer(state = defaultState, action) {
  let key = action.payload && action.payload.key

  switch (action.type) {
    case MOUNT_UI:
      const { defaults } = action.payload;
      let Defaults = Record(defaults);

      state = state.set(key, new Defaults);
      break;
    case UPDATE_UI:
      const { values } = action.payload;

      let currentValues = state.get(key);
      state = state.set(key, currentValues.merge(values));
      break;
    case UNMOUNT_UI:
      state = state.delete(key);
      break;
  }

  return state;
};

export function updateUI(key, values) {
  return {
    type: UPDATE_UI,
    payload: {
      key,
      values
    }
  };
};

export function mountUI(key, defaults) {
  return {
    type: MOUNT_UI,
    payload: {
      key,
      defaults
    }
  }
}

export function unmountUI(key) {
  return {
    type: UNMOUNT_UI,
    payload: {
      key
    }
  };
};
