import React from 'react';
import { View, StyleSheet, Dimensions, Platform, PermissionsAndroid, Alert } from 'react-native';
import MapView from 'react-native-maps';
import { Button, Text } from '@shoutem/ui';
import { connect } from 'react-redux';
import { Card, Icon } from 'react-native-elements';

import RNGooglePlaces from 'react-native-google-places';
import FusedLocation from 'react-native-fused-location';
import { DARK, LIGHT } from '../../config';
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
          isMapReady: false,
          HeaderMessage: 'pick'
        };
    }
    async componentDidMount() {
        Platform.OS === 'android' && await this.requestLocationPermission();
        Platform.OS === 'ios' ? this.getLocationIOS() : this.getLocationAndroid(); 
    }
    componentWillUnmount() {
        if (Platform.OS === 'ios') {
          navigator.geolocation.clearWatch(this.watchId);
        } else {
          FusedLocation.off(this.subscription);
          FusedLocation.off(this.errSubscription);
          FusedLocation.stopLocationUpdates();
        }
    }
    async requestLocationPermission() {
        const chckLocationPermission = PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (chckLocationPermission === PermissionsAndroid.RESULTS.GRANTED) {
            alert("You've access for the location");
        } else {
            try {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'App required Location ',
                        message: 'We required Location permission in order to get device location ' +
                            'Please grant us.'
                    }
                )
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    alert("You've access for the location");
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
        start();
        this.props.setPool(poolDetail, () => { navigation.pop(); });
    }
    getLocationAndroid = async () => {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
              title: 'App needs to access your location',
              message: 'App needs access to your location ' +
              'so we can let our app be even more awesome.'
              }
          );
          if (granted) {
          FusedLocation.setLocationPriority(FusedLocation.Constants.HIGH_ACCURACY);
          // Get location once.
          const location = await FusedLocation.getFusedLocation(true);
          this.setState({ region: {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA
          } });
          this.setState({ lat: location.latitude, long: location.longitude });
          this.setState({ loading: false });
          // Set options.
          FusedLocation.setLocationPriority(FusedLocation.Constants.HIGH_ACCURACY);
          FusedLocation.setLocationInterval(20000);
          FusedLocation.setFastestLocationInterval(15000);
          FusedLocation.setSmallestDisplacement(10);
          // Keep getting updated location.
          FusedLocation.startLocationUpdates();
          
          // Place listeners.
          this.subscription = FusedLocation.on('fusedLocation', location => {
          /* location = {
          latitude: 14.2323,
          longitude: -2.2323,
          speed: 0,
          altitude: 0,
          heading: 10,
          provider: 'fused',
          accuracy: 30,
          bearing: 0,
          mocked: false,
          timestamp: '1513190221416'
          }
          */
          this.setState({ location });
          console.log(location);
          });
          this.errSubscription = FusedLocation.on('fusedLocationError', error => {
          console.warn(error);
          });
          }
      }
    getLocationIOS = () => {
        this.watchId = navigator.geolocation.watchPosition(
          
          (position) => {
            // for changing the location( custom pickup or drop off point )
            if (regionChangeFlagIOS === 0) {
                this.setState({ region: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                    } });
                    regionChangeFlagIOS = 1;
            } 
            // users current location
            this.setState({ location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              speed: position.coords.speed,
              altitude: position.coords.altitudeAccuracy,
              heading: position.coords.heading,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp
                } });
              this.setState({ loading: false });
            //   console.log(this.state.location);
          },
          (error) => console.log(error),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000, distanceFilter: 10 },
        );
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
          latitude: this.state.location.latitude || 34.010160,
          longitude: this.state.location.longitude || 74.808882
        })
        .then((place) => {
          this.animateToRegion(place.latitude, place.longitude);
        })
        .catch(error => console.log(error.message));  // error is a Javascript Error object
    }
    renderMarker = () => {
        try {
          if (this.state.location.latitude) {
            return (
              <MapView.Marker 
                coordinate={{ latitude: this.state.location.latitude, longitude: this.state.location.longitude }}
              >
               <Icon 
                name='my-location'
                color={DARK}
               />
              </MapView.Marker>
            );
          }
        } catch (e) {
          console.log('');
        }  
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
            > 
            {this.renderMarker()}
            </MapView>
            <Card
                containerStyle={{ alignSelf: 'center', borderRadius: 6, position: 'absolute', margin: 0, left: 15, right: 15, top: 5, elevation: 10 }}
                title={journeyFlag === 'University' ? 'Pick up your destination' : 'Pick up your starting point'}          
            >
            <Button onPress={this.openSearchModal}>
                <Icon name="search" />
                <Text>Search Location</Text>
            </Button>
            </Card>
            <Button 
                onPress={this.onDone}
                style={{ borderRadius: 6, elevation: 10, position: 'absolute', left: 45, right: 45, top: height * (60 / 100) }} 
            >
                <Icon name="done" />
                <Text>Done</Text>
            </Button>


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
