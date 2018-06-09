import { combineReducers } from 'redux';

import pools from './pool_reducer';
import driver from './driver_reducer';
import journeys from './journeys_reducer';
import activepool from './activepool_reducer';

export default combineReducers({
  pools,
  driver,
  journeys,
  activepool
});
