import {
    ACTIVE_POOL_RECEIVED,
    DRIVER_TRACKING_RECEIVED
    } from '../actions/types.js';

const INITIAL_STATE = {
   activePool: {
     error: '',
     pool: null
   },
   liveLocation: {
     origin: null,
     des: null,
     coords: null
   }
  };
export default function (state = INITIAL_STATE, action) {
  console.log(action);
    switch (action.type) {
      case ACTIVE_POOL_RECEIVED:
      return { ...state, activePool: action.payload };
      case DRIVER_TRACKING_RECEIVED: 
      return { ...state, liveLocation: action.payload };
      default:
        return state;
      }
  }
