import axios from 'axios';
import { AsyncStorage } from 'react-native';
import { URL, GOOGLE_MAPS_API_KEY } from './../config';
import {
    IS_DRIVER,
    IS_DRIVER_LOADING,
    DRIVER_POOL_DETAILS_RECEIVED,
    IS_ACTIVE_POOL,
    DRIVER_CALLBACK_LOADING,
    POOL_REQUESTS_RECEIVED,
} from './types';
import { stop } from '../utils/background_tracking';

function isDriverLoading(dispatch, flag) {
    dispatch({ type: IS_DRIVER_LOADING, payload: flag });
}
function driverCallbackLoding(dispatch, flag) {
    dispatch({ type: DRIVER_CALLBACK_LOADING, payload: flag });
}
function logout(navigate) {
    navigate();
    AsyncStorage.clear();
}
   

const getDriverDetails = async (dispatch, token) => {
   try {
    const { data } = await axios.post(`${URL}/app/_drivers.php`, {
        job: 'getVehicles',
        token
    });
    

    const journeys = await axios.post(`${URL}/app/_journey.php`, {
        job: 'getJourneyTypes',
        token
    });
    //Renaming Name property with value
    for (let i = 0; i < data.length; i++) {
        data[i].value = data[i].vehicle_name;
        delete data[i].vehicle_name;
    }
    //Renaming Name property with value
    for (let i = 0; i < journeys.data.length; i++) {
    journeys.data[i].value = journeys.data[i].title;
    delete journeys.data[i].title;
    }
    console.log('vehicles', data);
    console.log('journey', journeys.data);

    dispatch({ type: IS_DRIVER, payload: true });
    dispatch({ type: DRIVER_POOL_DETAILS_RECEIVED, payload: { vehicles: data, journeys: journeys.data } });
    isDriverLoading(dispatch, false);
   } catch (error) {
        return null;
   }      
};

const getPlace = async (latLng) => {
    console.log(latLng);
    try {
        const { data } = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latLng}&rankby=distance&type=sublocality,&key=${GOOGLE_MAPS_API_KEY}`);
        return data.results[0].vicinity;
    } catch (e) {
        console.log(e);
    }
};

export const isDriver = (navigate) => async (dispatch) => {
    /*
        expected responses: 
        yup
        nope
        noAuth

    */
    navigate(false, '');
    isDriverLoading(dispatch, true);

    const token = await AsyncStorage.getItem('userToken');
    try {
        let { data } = await axios.post(`${URL}/app/_drivers.php`, {
            job: 'isDriver',
            token
        });
        console.log('isDriver', data);
        if (data.trim() === 'yup') {
           const response = await getDriverDetails(dispatch, token);
           if (response === null) {
                isDriverLoading(dispatch, false);
                navigate(false, 'Something went wrong. Please try again.');
           }
        } else if (data.trim() === 'nope') {
            dispatch({ type: IS_DRIVER, payload: false });
            isDriverLoading(dispatch, false);
        } else if (data.trim() === 'noAuth') {
            logout(navigate(true, ''));
            isDriverLoading(dispatch, false);
        } else {
            isDriverLoading(dispatch, false);
            navigate(false, 'Something went wrong. Please try again.');
        }
    } catch (error) {
        isDriverLoading(dispatch, false);
        navigate(false, 'Please check your internet connection.');
    }
};
export const setPool = ({ vehicle, journeyType, latLng, vacancies }, navigate) => async (dispatch) => {
    /*
        expected responses: 
        [yup, requestID]
        [nope, errorMessage]
    */
    navigate(false, true);
    driverCallbackLoding(dispatch, true);
    const place = await getPlace(latLng);
    let location;
    // For creating a location object with latLng and place 
    if (place) {
         location = {
            latLng,
            place
        };
    } else {
         location = {
            latLng,
            place: 'unnamed'
        };
    }
    
    const token = await AsyncStorage.getItem('userToken');
    try {
        let { data } = await axios.post(`${URL}/app/_pools.php`, {
            job: 'createPool',
            token,
            vehicle,
            vacancies,
            journeyType,
            location: JSON.stringify(location)
        });
        console.log('creating pool', data);
        if (data instanceof Array) {
            if (data[0] === 'yup') {
                await AsyncStorage.setItem('poolId', JSON.stringify(data[1]));
                const poolId = await AsyncStorage.getItem('poolId');
                console.log(poolId);
                navigate(true, false, '');
                  dispatch({ type: IS_ACTIVE_POOL, payload: true });
            } else if (data[0] === 'nope') {
                return navigate(false, false, 'Already in journey, Try again');
            }
            else {
                return navigate(false, false, 'Something went wrong, Try again');
            }
        }
        navigate(false, false, 'Something went wrong, Try again');
    } catch (error) {
        navigate(false, false, 'Something went wrong, Try again');
    }
};

export const isActivePool = (callback) => async (dispatch) => {
    /*
        expected responses: 
        yup
        nope
    */
    
    const token = await AsyncStorage.getItem('userToken');
    try {
        const { data } = await axios.post(`${URL}/app/_drivers.php`, {
            job: 'hasActivePool',
            token
        });
        console.log('isActivePool', data);
        if (isString(data)) {
            if (data === 'yup') {
                dispatch({ type: IS_ACTIVE_POOL, payload: true });
                if (typeof callback === 'function') { 
                    callback('');
                    }
            } else if (data === 'nope') {
                stop();
                dispatch({ type: IS_ACTIVE_POOL, payload: false });
                if (typeof callback === 'function') { 
                    callback('');
                    }
            }
        } else {
            if (typeof callback === 'function') {
            callback('Something went wrong, Please try again');
            }
        }   
    } catch (error) {
        if (typeof callback === 'function') {
            callback('Please check your internet connection');
        }
    }
};
export const getPoolRequests = (done) => async (dispatch) => {
    /*
        expected responses: 
        [{}, ...]
    */
    const token = await AsyncStorage.getItem('userToken');
    try {
        let { data } = await axios.post(`${URL}/app/_requests.php`, {
            job: 'getPoolRequests',
            token
        });
        console.log('Requests', data);
        if (data instanceof Object) {
           dispatch({ type: POOL_REQUESTS_RECEIVED, payload: data });    
       }
       console.log('pool requests', data);
           if (typeof done === 'function') { 
               done();
           }
    } catch (error) {
        done();
        console.log('Some Problem with server');  
        console.error(error);
    }
};

export const acceptPoolRequest = (requestId, done) => async (dispatch) => {
    const token = await AsyncStorage.getItem('userToken');
    const poolId = await AsyncStorage.getItem('poolId');
    console.log(requestId);
    console.log(poolId);
    try {
        const { data } = await axios.post(`${URL}/app/_requests.php`, {
            job: 'acceptPoolRequest',
            token,
            poolId,
            requestId
        });
        console.log(data);
        const allRequests = await axios.post(`${URL}/app/_requests.php`, {
            job: 'getPoolRequests',
            token
        });
        dispatch({ type: POOL_REQUESTS_RECEIVED, payload: allRequests.data });

        console.log('pool requests', allRequests.data);
        if (typeof done === 'function') { 
            done();
        }
    } catch (error) {
        console.log('Some Problem with server');  
        console.error(error);
    }
};
export const declinePoolRequest = (requestId, done) => async (dispatch) => {
    const token = await AsyncStorage.getItem('userToken');
    const poolId = await AsyncStorage.getItem('poolId');
    console.log(requestId);
    console.log(poolId);
    try {
        const { data } = await axios.post(`${URL}/app/_requests.php`, {
            job: 'declinePoolRequest',
            token,
            poolId,
            requestId
        });
        console.log(data);
        const allRequests = await axios.post(`${URL}/app/_requests.php`, {
            job: 'getPoolRequests',
            token
        });
        dispatch({ type: POOL_REQUESTS_RECEIVED, payload: allRequests.data });

        console.log('pool requests', allRequests.data);
        if (typeof done === 'function') { 
            done();
        }
    } catch (error) {
        console.log('Some Problem with server');  
        console.error(error);
    }
};

function isString(s) {
    return typeof (s) === 'string' || s instanceof String;
}
