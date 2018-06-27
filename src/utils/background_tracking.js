import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import { Alert, AsyncStorage } from 'react-native';
import { URL } from '../config';
import axios from 'axios';

export const start = async () => { 
const token = await AsyncStorage.getItem('userToken');
const poolId = await AsyncStorage.getItem('poolId');
BackgroundGeolocation.configure({
    desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
    stationaryRadius: 50,
    distanceFilter: 50,
    notificationTitle: 'Background tracking',
    notificationText: 'enabled',
    debug: false,
    startOnBoot: false,
    stopOnTerminate: false,
    locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
    interval: 10000,
    fastestInterval: 5000,
    activitiesInterval: 10000,
    stopOnStillActivity: false,
    // url: 'http://carpool.iustconnect.com/app/_test.php',
    // // customize post properties
    // httpHeaders: {
    //   'Content-Type': 'application/json',
    // },
    
    // postTemplate: {
    //   lat: '@latitude',
    //   lng: '@longitude',
    //   foo: 'bar' // you can also add your own properties
    // }
  });

  BackgroundGeolocation.on('location', async (location) => {
    console.log(poolId);
    try {
    const { data } = await axios.post('http://carpool.iustconnect.com/app/_pools.php', {
      job: 'updateLastKnownLocation',
      token,
      poolId,
      location: JSON.stringify(location)
    });
    } catch (e) {
      console.warn('location not updated');
    }
    // to perform long running operation on iOS
    // you need to create background task
    BackgroundGeolocation.startTask(taskKey => {
      // await axios.post(`${URL}/app/_pools.php`, {

      // })
      // execute long running task
      // eg. ajax post location
      // IMPORTANT: task has to be ended by endTask
      BackgroundGeolocation.endTask(taskKey);
    });
  });

  BackgroundGeolocation.on('stationary', async (stationaryLocation) => {
    // handle stationary locations here
    // Actions.sendLocation(stationaryLocation);
  });

  BackgroundGeolocation.on('error', (error) => {
    console.log('[ERROR] BackgroundGeolocation error:', error);
  });

  BackgroundGeolocation.on('start', () => {
    console.log('[INFO] BackgroundGeolocation service has been started');
  });

  BackgroundGeolocation.on('stop', () => {
    console.log('[INFO] BackgroundGeolocation service has been stopped');
  });

  BackgroundGeolocation.on('authorization', (status) => {
    console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
    if (status !== BackgroundGeolocation.AUTHORIZED) {
      // we need to set delay or otherwise alert may not be shown
      setTimeout(() =>
        Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
          { text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() },
          { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
        ]), 1000);
    }
  });

  BackgroundGeolocation.on('background', () => {
    console.log('[INFO] App is in background');
  });

  BackgroundGeolocation.on('foreground', () => {
    console.log('[INFO] App is in foreground');
  });

  BackgroundGeolocation.checkStatus(status => {
    console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
    console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
    console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

    // you don't need to check status before start (this is just the example)
    if (!status.isRunning) {
      BackgroundGeolocation.start(); //triggers start on start event
    }
  });
};

export const stop = () => {
  BackgroundGeolocation.events.forEach(event => BackgroundGeolocation.removeAllListeners(event));
};
