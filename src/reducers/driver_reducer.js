import {
    IS_DRIVER,
    IS_DRIVER_LOADING,
    DRIVER_POOL_DETAILS_RECEIVED,
    IS_ACTIVE_POOL,
    POOL_REQUESTS_RECEIVED
    } from '../actions/types.js';

const INITIAL_STATE = {
    isActive: null,
    isDriver: false,
    isDriverLoading: true,
    driverPoolDetails: { vehicles: [], journeys: [] },
    poolRequests: {
      accepted: [],
      pending: []
    }

  };
export default function (state = INITIAL_STATE, action) {
  console.log(action);
    switch (action.type) {
      case IS_DRIVER:
      return { ...state, driverStatus: action.payload };
      case IS_DRIVER_LOADING:
      return { ...state, isDriverLoading: action.payload };
      case DRIVER_POOL_DETAILS_RECEIVED:
      return { ...state, driverPoolDetails: action.payload };
      case IS_ACTIVE_POOL:
      return { ...state, isActive: action.payload };
      case POOL_REQUESTS_RECEIVED:
      return { ...state, poolRequests: action.payload };
      default:
        return state;
      }
  }
