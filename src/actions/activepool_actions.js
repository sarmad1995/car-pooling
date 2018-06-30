import axios from 'axios';
import { AsyncStorage } from 'react-native';
import Polyline from '@mapbox/polyline';

import { URL, GOOGLE_MAPS_API_KEY, IUST_COORDS } from './../config';
import {
    ACTIVE_POOL_RECEIVED,
    DRIVER_TRACKING_RECEIVED
} from './types';

//REturns location in , format
const getDriverLocation = async (poolId, token) => {
    try {
        const { data } = await axios.post(`${URL}/app/_pools.php`, {
            job: 'getLastKnownLocation',
            token,
            poolId
        });
        return data;
    } catch (e) {
        return null; 
    }
};

const getDirections = async (origin, des) => {
    try {
        const { data } = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${des}&key=${GOOGLE_MAPS_API_KEY}`);
        const points = Polyline.decode(data.routes[0].overview_polyline.points);
        const coords = points.map((point, index) => {
            return {
                latitude: point[0],
                longitude: point[1]
            };
        });    
        return coords;   
    } catch (error) {
        return null;
    }
};

const setDirections = async (flag, pool, location, token, dispatch, done) => {
    const journeyFlag = pool.title.split(' ')[0];
    const poolLocation = JSON.parse(pool.location);
    let des;
    let origin;
    if (journeyFlag === 'Location') {
        des = flag === 1 ? `${location.lat},${location.lng}` : IUST_COORDS;
        origin = await getDriverLocation(pool.id, token);
        origin = `${origin.latitude},${origin.longitude}`;
    } else if (journeyFlag === 'University') {
        origin = await getDriverLocation(pool.id, token);
        origin = `${origin.latitude},${origin.longitude}`;
        des = flag === 1 ? IUST_COORDS : `${location.lat},${location.lng}`;
    }
    console.log('Origin:', origin);
    console.log('Destination', des);
    const originArray = origin.split(',');
    const desArray = des.split(',');
    const coords = await getDirections(origin, des);
    
    origin = {
        lat: originArray[0],
        lng: originArray[1]
    };
    des = {
        lat: desArray[0],
        lng: desArray[1]
    };
    if (coords != null) {
        dispatch({ type: DRIVER_TRACKING_RECEIVED, payload: { origin, des, coords } });

        if (typeof done === 'function') { 
            done(false, false);
        }
    } else if (typeof done === 'function') {
        done(false, true);
    }
};
const hasToRateLastJourney = async (token) => {
    try { 
        const { data } = await axios.post(`${URL}/app/_journey.php`, {
        job: 'hasToRateLastJourney',
        token,
    });
    if (data instanceof Array) {
        if (data[0] === 'yup') {
            return data[1];
        } else if (data[0] === 'nope') {
            return 'nope';
        } else {
            return null;
        }
    }
    } catch (e) {
        return null;
    }
};

export const getRidersActivePool = (done) => async (dispatch) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
        const { data } = await axios.post(`${URL}/app/_pools.php`, {
            job: 'getRidersActivePool',
            token,
        });
        
        const { ridersActivePool, hasPendingRequest } = data;
        console.log('getRidersActivePool', ridersActivePool);
        console.log('hasPendingRequest', hasPendingRequest);

        // Checking Pending Request 

        if (hasPendingRequest) {
            const { requestId, pendingPool } = hasPendingRequest;
            dispatch({ type: ACTIVE_POOL_RECEIVED, payload: { error: 'pending', pendingPool: { requestId, pool: pendingPool[1][0] } } });
            return done();
        }
        // Checking Riders Active Pool Status

        if (ridersActivePool instanceof Array) {
            if (ridersActivePool[0] === 'yup') {
                dispatch({ type: ACTIVE_POOL_RECEIVED, payload: { error: '', pool: ridersActivePool[1][0] } });
                done();
            } else if (ridersActivePool[0] === 'nope') {
                const lastJourney = await hasToRateLastJourney(token);
                console.log('has to Rate last journey', lastJourney);
                if (lastJourney !== null) {
                    if (lastJourney === 'nope') {
                        dispatch({ type: ACTIVE_POOL_RECEIVED, payload: { error: 'No Active Pool', pool: 'nope' } });
                    } else {
                        console.log(lastJourney);
                        dispatch({ type: ACTIVE_POOL_RECEIVED, payload: { error: 'pendingRating', lastJourney } });
                    }
                } else {
                    dispatch({ type: ACTIVE_POOL_RECEIVED, payload: { error: 'No Active Pool', pool: 'nope' } });
                } 
                done();
            } else {
                dispatch({ type: ACTIVE_POOL_RECEIVED, payload: { error: 'Server Busy', pool: 'nope' } });
                done();
            }
        }
    } catch (error) {
        dispatch({ type: ACTIVE_POOL_RECEIVED, payload: { error: 'Check Connection', pool: 'nope' } });
        done();
        console.log('Some Problem with server');  
    }
};


export const getDriversActivePool = (done) => async (dispatch) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
        const { data } = await axios.post(`${URL}/app/_pools.php`, {
            job: 'getDriversActivePool',
            token,
        });
        console.log('getDriversActivePool', data);

        if (data instanceof Array) {
            if (data[0] === 'yup') {
                dispatch({ type: ACTIVE_POOL_RECEIVED, payload: { error: '', pool: data[1][0] } });
                done();
            } else if (data[0] === 'nope') {
                dispatch({ type: ACTIVE_POOL_RECEIVED, payload: { error: 'No Active Pool', pool: 'nope' } });
                done();
            } else {
                dispatch({ type: ACTIVE_POOL_RECEIVED, payload: { error: 'Server Busy', pool: 'nope' } });
                done();
            }
        }
    } catch (error) {
        dispatch({ type: ACTIVE_POOL_RECEIVED, payload: { error: 'Check Connection', pool: 'nope' } });
        done();
        console.log('Some Problem with server');  
        console.error(error);
    }
};


export const getJourneyState = (pool, done) => async (dispatch) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
        const { data } = await axios.post(`${URL}/app/_journey.php`, {
            job: 'getJourneyState',
            token,
        });
        console.log('getJourneyState', data);

        if (data instanceof Array) {
            if (data[0] === 'yup') {
                if (data[1] === 1) {
                    setDirections(1, pool, JSON.parse(data[2]), token, dispatch, done);
                } else if (data[1] === 2) {
                    setDirections(2, pool, JSON.parse(data[2]), token, dispatch, done);
                }

            } else if (data[0] === 'nope') {
            } else {
            }
        }
    } catch (error) {
        // dispatch({ type: ACTIVE_POOL_RECEIVED, payload: { error: 'Check Connection', pool: 'nope' } });
        // done();
        console.log('Some Problem with server');  
        console.error(error);
    }
};

export const rateDriver = (stars, journeyId, done) => async (dispatch) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
        const { data } = await axios.post(`${URL}/app/_journey.php`, {
            job: 'rateDriver',
            journeyId,
            token,
            stars
        });
        console.log(data);
        done();
    } catch (e) {
        console.warn(e);
    }
};
export const trackDirections = (pool, des) => async (dispatch) => {
    const token = await AsyncStorage.getItem('userToken');
    let origin = await getDriverLocation(pool.id, token);
    const heading = origin.heading;
    origin = `${origin.latitude},${origin.longitude}`;
    const coords = await getDirections(origin, `${des.lat},${des.lng}`);
    
    console.log('heading:', heading);
    if (coords != null && origin != null) {
        const originArray = origin.split(',');    
        origin = {
            lat: originArray[0],
            lng: originArray[1],
            heading
        };
        dispatch({ type: DRIVER_TRACKING_RECEIVED, payload: { origin, des, coords } });
    }
};


export const cancelPendingRequestByRider = (requestId, done) => async (dispatch) => {
    console.log(requestId);
    const token = await AsyncStorage.getItem('userToken');
    try {
        const { data } = await axios.post(`${URL}/app/_requests.php`, {
            job: 'cancelPendingRequest',
            token,
            requestId
        });
        console.log('Cancel PendingRequest By Rider', data);
        done();
    } catch (error) {
       done();
    }
};
export const cancelActivePoolByRider = (requestId, done) => async (dispatch) => {
    console.log(requestId);
    const token = await AsyncStorage.getItem('userToken');
    try {
        const { data } = await axios.post(`${URL}/app/_journey.php`, {
            job: 'cancelByRider',
            token,
        });
        console.log('Cancel Active Pool By Rider', data);
        done();
    } catch (error) {
       done();
    }
};

export const suspendActivePool = (done) => async (dispatch) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
        const { data } = await axios.post(`${URL}/app/_pools.php`, {
            job: 'suspendActivePool',
            token,
        });
        console.log('Suspend Active Pool', data);
        done();
    } catch (error) {
       done();
    }
};
