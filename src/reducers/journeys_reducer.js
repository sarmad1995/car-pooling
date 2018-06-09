import { 
    POOL_BUDDIES_RECEIVED
  } from './../actions/types';
  
  const INITIAL_STATE = {
    poolBuddies: []
    
  };
  export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case POOL_BUDDIES_RECEIVED: 
      return { ...state, poolBuddies: action.payload };
    default:
      return state;
    }
  };