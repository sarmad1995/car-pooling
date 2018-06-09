import axios from 'axios';
import { AsyncStorage } from 'react-native';
import { URL } from './../config';
import {
    ACTIVE_POOL_RECEIVED
} from './types';

export const getRidersActivePool = (done) => async (dispatch) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
        const { data } = await axios.post(`${URL}/app/_pools.php`, {
            job: 'getRidersActivePool',
            token,
        });
        console.log('getRidersActivePool', data);

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
