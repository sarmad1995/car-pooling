import axios from 'axios';
import Polyline from '@mapbox/polyline';
import { AsyncStorage } from 'react-native';

import {
    DRIVER_DETAIL_RECEIVED,
    RESET_DRIVER_DETAILS,
    POOLS_RECEIVED,
    POOL_REQUESTS_RECEIVED
} from './types';
import { GOOGLE_MAPS_API_KEY, URL, IUST_COORDS } from './../config';

export const setDriverDetailModal = (item) => async (dispatch) => {

    const { location: { latLng } } = item;
    const lat = latLng.split(',')[0];
    const lng = latLng.split(',')[1];

    const iustLoc = IUST_COORDS;
    const flag = item.title.split(' ')[0];

    let desination;
    let startPoint;
    let title;
    
    if (flag === 'University') {
        desination = latLng;
        startPoint = iustLoc;
        title = `University to ${item.location.place}`;
    } else {
        desination = iustLoc;
        startPoint = latLng;
        title = `${item.location.place} to Univesity`;
    }
    let waypoints = '';
    // if (item.title.includes('Pantha Chowk')) {
    //     waypoints = 'pampore power grid';
    // }
    try {
        const { data } = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${startPoint}&destination=${desination}&waypoints=${waypoints}&key=${GOOGLE_MAPS_API_KEY}`);
        const points = Polyline.decode(data.routes[0].overview_polyline.points);
        const coords = points.map((point, index) => {
            return {
                latitude: point[0],
                longitude: point[1]
            };
        });
        
        console.log('item', item);
       
            const driver = {
                name: item.name,
                number: item.number,
                title,
                gender: item.gender,
                key: item.key,
                vacancies: item.vacancies,
                flag,
                location: {
                    lat,
                    lng,
                    place: item.place
                }
            }; 
        console.log(coords);
         dispatch({ type: DRIVER_DETAIL_RECEIVED, payload: { driver, coords } });
    } catch (error) {
        console.error(error);
    }
};
export const getPools = (done) => async (dispatch) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
    const { data } = await axios.post(`${URL}/app/_pools.php`, {
        job: 'getActivePools',
        token
    });
    console.log('Pools', data);
    if (data instanceof Array) {
        for (let i = 0; i < data.length; i++) {
            data[i].location = JSON.parse(data[i].location);
            data[i].key = `${data[i].id}`;  
       }
       dispatch({ type: POOLS_RECEIVED, payload: data });
    } else {
        dispatch({ type: POOLS_RECEIVED, payload: [] });
    }
    done();
  } catch (e) {
    dispatch({ type: POOLS_RECEIVED, payload: [] });
    done();
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
export const sendPoolRequest = (driverDetail, region, done) => async (dispatch) => {
    const token = await AsyncStorage.getItem('userToken');
    const place = await getPlace(`${region.latitude},${region.longitude}`);
    const location = { lat: region.latitude, lng: region.longitude, place };
    try {
        const { data } = await axios.post(`${URL}/app/_requests.php`, {
            token,
            job: 'requestPool',
            poolId: driverDetail.driver.key,
            location: JSON.stringify(location)
        });
        console.log('send pool request', data);
        if (data instanceof Array) {
            if (data[0] === 'yup') {
                done(false, true, '');
            } else if (data[0] === 'nope') {
                done(false, false, 'You have a pending request or you are in journey');
            } else {
                done(false, false, 'Server error');
            }
        } else {
            done(false, false, 'server problem');
        }
    } catch (e) {
        done(false, false, 'Check connection');
    }
};

export const resetDriverDetails = () => {
    return {
        type: RESET_DRIVER_DETAILS
    };
};
