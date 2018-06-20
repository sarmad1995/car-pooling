import axios from 'axios';
import { Platform, AsyncStorage } from 'react-native';
import { URL } from '../config';

export const signIn = (username, password, done) => async () => {
    /*
        expected responses: 
        [yup, token]
        [nope, errorMessage]
    */
    try {
        const { data } = await axios.post(`${URL}/app/_login.php`, {
            job: 'loginUser',
            username,
            password,
            platform: Platform.OS
        });
        console.log('LOGIN response', data);
        if (data instanceof Array) {
            console.log('Array found');
            if (data[0] === 'nope') {
                done(false, false, 'Wrong Password');
            } else if (data[0] === 'yup') {
                await AsyncStorage.setItem('userToken', data[1]);
                done(true, false, '');
            }
        } else {
            done(false, false, 'Please try later, server busy.');
        }     
    } catch (error) {
        done(false, false, 'Check connection.'); 
    }
};
