import { 
  DRIVER_DETAIL_RECEIVED,
  RESET_DRIVER_DETAILS,
  POOLS_RECEIVED
} from './../actions/types';

const INITIAL_STATE = {
  driverDetail: {
    driver: {
      name: null,
      number: '',
      gender: '',
      title: '',
      vacancies: '',
      flag: '',
      location: {
         lat: '',
         Lng: '',
         place: ''
         }
    },
    coords: []
  },
  pools: {
    data: [],
    error: ''
  }
  
};
export default function (state = INITIAL_STATE, action) {
switch (action.type) {
  case DRIVER_DETAIL_RECEIVED: 
    return { ...state, driverDetail: action.payload };
  case RESET_DRIVER_DETAILS: 
    return { ...state, driverDetail: INITIAL_STATE.driverDetail };
  case POOLS_RECEIVED:
    return { ...state, pools: action.payload };
  default:
    return state;
  }
}
