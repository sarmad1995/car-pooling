import axios from 'axios';
import { Platform, AsyncStorage } from 'react-native';
import { URL } from '../config';

export const signIn = (username, password, done) => async () => {
    /*
        expected responses: 
        [yup, token]
        [nope, errorMessage]
    */
    console.log(`${URL}_login.php`);
    try {
        const { data } = await axios.post(`${URL}/app/_login.php`, {
            job: 'loginUser',
            username,
            password,
            platform: Platform.OS
        });
        if (data instanceof Array) {
            console.log('Array found');
            if (data[0] === 'nope') {
                done(false, false, 'Wrong Password');
            } else if (data[0] === 'yup') {
                await AsyncStorage.setItem('userToken', data[1]);
                done(true, false, '');
            }
        } else {
            done(true, false, 'Please try later, server busy.');
        }     
    } catch (error) {
        done(true, false, 'Check connection.'); 
    }
};
