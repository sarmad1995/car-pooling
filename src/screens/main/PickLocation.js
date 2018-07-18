import React from 'react';
import { View, StyleSheet, Dimensions, Platform, PermissionsAndroid, Alert } from 'react-native';
import MapView from 'react-native-maps';
import { Button, Text } from '@shoutem/ui';
import { connect } from 'react-redux';
import { Card, Icon } from 'react-native-elements';

import RNGooglePlaces from 'react-native-google-places';
import FusedLocation from 'react-native-fused-location';
import { DARK, LIGHT, IUST_COORDS_OBJECT, IUST_COORDS } from '../../config';
import { start } from '../../utils/background_tracking';


import { Loading } from '../../components/common';
import * as actions from '../../actions';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0322;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

let regionChangeFlagIOS = 0;
let selectedLocation;

class PickLocation extends React.Component {
    static navigationOptions = {
        title: 'Pick Location',
        headerStyle: {
        backgroundColor: DARK,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
        fontWeight: 'bold',
        },
        };

    constructor(props) {
        super(props);
        this.state = {
          loading: true,
          HeaderMessage: 'pick',
          buttonLoading: false
        };
    }
    async componentDidMount() {
        if (Platform.OS === 'android') {
            this.requestLocationPermission();
        } else {
            this.getLocationIOS();
        }
    }

    componentWillUnmount() {
        try {
            if (Platform.OS === 'ios') {
                navigator.geolocation.clearWatch(this.watchId);
            } else {
                FusedLocation.off(this.subscription);
                FusedLocation.off(this.errSubscription);
                FusedLocation.stopLocationUpdates();
                navigator.geolocation.clearWatch(this.watchId);
                }
        } catch(e) {
                console.warn(e);
            }
    }
    async requestLocationPermission() {
        const chckLocationPermission = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (chckLocationPermission === PermissionsAndroid.RESULTS.GRANTED) {
            this.getLocationAndroid();
        } else {
            try {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'App required Location ',
                        message: 'We required Location permission in order to get device location ' +
                            'Please grant us.'
                    }
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('Granted');
                    this.getLocationAndroid();
                } else {
                    alert("You don't have access for the location");
                }
            } catch (err) {
                alert(err);
            }
        }
    }

    onRegionChange = (region) => {
        selectedLocation = region;
        console.log('Selected Locaiton', selectedLocation);
        this.setState({ region });
    }
    onDone = () => {
        const { navigation } = this.props;
        const poolDetail = navigation.getParam('poolDetail');
        poolDetail.latLng = `${this.state.region.latitude},${this.state.region.longitude}`;
        // start();
        this.props.setPool(poolDetail, (flag, buttonLoading) => { 
            flag && navigation.pop(); 
            this.setState({ buttonLoading });
        });
    }
    getLocationAndroid = async () => {
        try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
              title: 'App needs to access your location',
              message: 'App needs access to your location ' +
              'so we can let our app be even more awesome.'
              }
          );
          if (granted) {
              console.log('getting fused location');
                FusedLocation.setLocationPriority(FusedLocation.Constants.HIGH_ACCURACY);
                // Get location once.
                const location = await FusedLocation.getFusedLocation(true);
                this.setState({ region: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                    } });
                this.setState({ loading: false });
                // Set options.
                
                this.errSubscription = FusedLocation.on('fusedLocationError', error => {
                console.warn(error);
                });
                }
            } catch (e) {
                console.error(e);
                this.getLocationIOS();
            }
      }
    getLocationIOS = () => {
        try {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                   // for changing the location( custom pickup or drop off point )
                        this.setState({ region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA
                        } });
                        // users current location
                        this.setState({ loading: false });
                },
                (error) => {
                    console.warn(error);
                    this.setState({ region: {
                        latitude: IUST_COORDS_OBJECT.latitude,
                        longitude: IUST_COORDS_OBJECT.longitude,
                        latitudeDelta: LATITUDE_DELTA + 1,
                        longitudeDelta: LONGITUDE_DELTA + 1
                        } });
                    this.setState({ loading: false });    
                },
                
                { enableHighAccuracy: true, timeout: 2000 },
              );
    } catch (e) {
        console.error(e);
    }
    }

    animateToRegion(lat, lng) {
        this.map.animateToRegion({
          latitude: lat,
          longitude: lng,
          longitudeDelta: LONGITUDE_DELTA,
          latitudeDelta: LATITUDE_DELTA
        });
    } 

    openSearchModal = () => {
        RNGooglePlaces.openAutocompleteModal({
          latitude: 34.010160,
          longitude: 74.808882
        })
        .then((place) => {
          this.animateToRegion(place.latitude, place.longitude);
        })
        .catch(error => console.log(error.message));  // error is a Javascript Error object
    }

    renderButton = () => {
        if (this.state.buttonLoading) {
            return <Loading />;
        }
        return (
            <Button 
                onPress={this.onDone}
                style={{ borderRadius: 6, elevation: 10 }} 
            >
                <Icon name="done" />
                <Text>Done</Text>
            </Button>
        );
    }
    render() {
        const { navigation } = this.props;
        const { journeyFlag } = navigation.getParam('poolDetail');
        if (this.state.loading) {
            return <Loading />;
        }
        return (
        <View style={{ flex: 1 }}>
            <MapView
                showsUserLocation
                provider='google'
                ref={ref => { this.map = ref; }}
                initialRegion={this.state.region}
                style={styles.map}
                onRegionChangeComplete={this.onRegionChange}
            />
            <Card
                containerStyle={{ alignSelf: 'center', borderRadius: 6, position: 'absolute', margin: 0, left: 15, right: 15, top: 5, elevation: 10 }}
                title={journeyFlag === 'University' ? 'Pick up your destination' : 'Pick up your starting point'}          
            >
            <Button onPress={this.openSearchModal}>
                <Icon name="search" />
                <Text>Search Location</Text>
            </Button>
            </Card>
            <View style={{ position: 'absolute', left: 45, right: 45, top: height * (50 / 100) }}> 
                {this.renderButton()}
            </View>

            <View pointerEvents='box-none' style={{ position: 'absolute', bottom: '50%', left: 0, right: 0, justifyContent: 'center', alignItems: 'center', elevation: 10 }}>
                <Icon 
                name='location-on'
                color={LIGHT}
                />

            </View>
       
        </View>
        );
    }
}
const styles = StyleSheet.create({
    map: {
      ...StyleSheet.absoluteFillObject,
    },
  });
export default connect(null, actions)(PickLocation);
