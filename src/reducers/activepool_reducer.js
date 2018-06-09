import {
    ACTIVE_POOL_RECEIVED
    } from '../actions/types.js';

const INITIAL_STATE = {
   activePool: {
     error: '',
     pool: null
   }
  };
export default function (state = INITIAL_STATE, action) {
  console.log(action);
    switch (action.type) {
      case ACTIVE_POOL_RECEIVED:
      return { ...state, activePool: action.payload };
      default:
        return state;
      }
  }
