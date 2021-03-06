import axios from 'axios';
import { AsyncStorage } from 'react-native';
import { URL, GOOGLE_MAPS_API_KEY } from './../config';
import {
    POOL_BUDDIES_RECEIVED
} from './types';

const httpClient = axios.create();
httpClient.defaults.timeout = 10000;


export const getPoolBuddies = (done) => async (dispatch) => {
    const token = await AsyncStorage.getItem('userToken');
    const poolId = await AsyncStorage.getItem('poolId');

    try {
        const { data } = await httpClient.post(`${URL}/app/_pools.php`, {
            job: 'getPoolBuddies',
            token,
            poolId
        });
        console.log('getPoolBuddies', data);
        if (data instanceof Array) {
            for (let i = 0; i < data.length; i++) {
                data[i].key = `${data[i].id}`;  
           }
                  dispatch({ type: POOL_BUDDIES_RECEIVED, payload: data });
                  done();
        } else if (!data) {
            dispatch({ type: POOL_BUDDIES_RECEIVED, payload: [] });
        }
            done();
    } catch (error) {
        console.log(error);
        done();
        console.log('Some Problem with server');  
    }
};
export const pickupComplete = (requestId, done) => async (dispatch) => {
    const token = await AsyncStorage.getItem('userToken');
    const poolId = await AsyncStorage.getItem('poolId');

    console.log(requestId);
    try {
        const { data } = await httpClient.post(`${URL}/app/_journey.php`, {
            job: 'pickupComplete',
            token,
            requestId
        });
        console.log('onPickup', data);
        const allRequests = await httpClient.post(`${URL}/app/_pools.php`, {
            job: 'getPoolBuddies',
            token,
            poolId
        });
        if (allRequests.data instanceof Array) {
            for (let i = 0; i < allRequests.data.length; i++) {
                allRequests.data[i].key = `${allRequests.data[i].id}`;  
           }
                dispatch({ type: POOL_BUDDIES_RECEIVED, payload: allRequests.data });
            }
        

        if (typeof done === 'function') { 
            done();
        }
    } catch (error) {
        console.log('Some Problem with server');  
        done();
    }
};
export const dropoffComplete = (requestId, stars, done) => async (dispatch) => {
    const token = await AsyncStorage.getItem('userToken');
    const poolId = await AsyncStorage.getItem('poolId');

    console.log(requestId);
    try {
        const { data } = await httpClient.post(`${URL}/app/_journey.php`, {
            job: 'dropoffComplete',
            token,
            requestId,
            poolId
        });
        const ratingResponse = await httpClient.post(`${URL}/app/_journey.php`, {
            job: 'rateRider',
            requestId,
            token,
            stars
        });
        console.log('Rating response', ratingResponse.data);
        console.log('dropoffComplete', data);
        const allRequests = await httpClient.post(`${URL}/app/_pools.php`, {
            job: 'getPoolBuddies',
            token,
            poolId
        });
        if (allRequests.data instanceof Array) {
            for (let i = 0; i < allRequests.data.length; i++) {
                allRequests.data[i].key = `${allRequests.data[i].id}`;  
           }
                dispatch({ type: POOL_BUDDIES_RECEIVED, payload: allRequests.data });
            }

        if (typeof done === 'function') { 
            done();
        }
    } catch (error) {
        console.log(error);
        console.log('Some Problem with server');  
        done();
    }
};
export const journeyCancelByDriver = (requestId, done) => async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
        const { data } = await httpClient.post(`${URL}/app/_journey.php`, {
            job: 'cancelByDriver',
            token,
            requestId,
        });
        console.log('Cancel By Driver', data);
        done();
    } catch (error) {
        console.log(error);
        done();
    }
};
