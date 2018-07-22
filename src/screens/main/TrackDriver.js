import React from 'react';
import { View, StyleSheet, Platform, Image, TouchableOpacity } from 'react-native';
import MapView, { AnimatedRegion } from 'react-native-maps';
import { connect } from 'react-redux';
import { Card, Heading, Text, Button } from '@shoutem/ui';
import { Icon } from 'react-native-elements';
import { DARK } from '../../config';
import * as actions from '../../actions';
import { Loading } from '../../components/common';
import ActivePoolError from '../../components/common/ActivePoolError';
import OpenSansText from '../../components/common/OpenSansText';

const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };
const IUST = {
    latitude: 33.9260206, longitude: 75.0173499
};
let IntervalFlag = 0;
//Because without this componentWillUpdate will call setInterval as many times componentUpdates

class TrackDriver extends React.Component {
  state = {
    loading: true,
    error: false,
    showCallButton: false,
    coordinate: new AnimatedRegion({
      latitude: IUST.latitude,
      longitude: IUST.longitude,
    }),
  }
  onDone = (loadingFlag, error) => {
    this.setState({ loading: loadingFlag });
    this.setState({ error });
  }
  onLayout = () => {
    const { origin, des } = this.props.liveLocation;
    console.log(origin);
    console.log(des);
    setTimeout(
        () => {
            try {
                this.map.setMapBoundaries({ latitude: 34.277865, longitude: 75.351941 }, { latitude: 33.635500, longitude: 74.522094 });
                this.map.fitToCoordinates([{ latitude: Number(origin.lat), longitude: Number(origin.lng) }, { latitude: Number(des.lat), longitude: Number(des.lng) }], {
                    edgePadding: DEFAULT_PADDING,
                    animated: true,
                });
            } catch (e) {
                console.error(e);
            } 
        }, 1000
    );   
}
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  componentDidMount() {
    IntervalFlag = 0;
    this.setState({ loading: true });
    const { navigation } = this.props;
    const pool = navigation.getParam('pool');
    this.props.getJourneyState(pool, this.onDone);
  }  
  componentWillReceiveProps(nextProps) {
    const duration = 1000;
    if (nextProps.liveLocation.distance.split(' ')[0] < 2) {
      this.setState({ showCallButton: true });
    }
    
    if (this.props.liveLocation.origin !== nextProps.liveLocation.origin) {
      const newCoordinate = {
        latitude: Number(nextProps.liveLocation.origin.lat),
        longitude: Number(nextProps.liveLocation.origin.lng)
      };
      

      if (Platform.OS === 'android') {
        if (this.marker) {
          this.marker._component.animateMarkerToCoordinate(
            newCoordinate,
            duration
          );
        }
      } else if (this.props.liveLocation.origin != null) {
        const oldCoordinate = new AnimatedRegion({
          latitude: Number(this.props.liveLocation.origin.lat),
          longitude: Number(this.props.liveLocation.origin.lng)
        });
        oldCoordinate.timing(newCoordinate).start();
        }
    }
  }
  componentWillUpdate() {
    const { navigation, liveLocation } = this.props;
    const pool = navigation.getParam('pool');
    if (this.state.loading === false && IntervalFlag === 0) {
      IntervalFlag = 1;
      this.interval = setInterval(() => this.props.trackDirections(pool, liveLocation.des), 3000);
     }
  }
  
  renderContent() {
    if (this.state.loading) {
      return (
        <Loading />
      );
    } else if (this.state.error) {
      return (
        <ActivePoolError
          error='oops.!! no directions available :(' 
        />
      );
    } 
    if (this.props.liveLocation.origin !== null) {
      const { origin, des, coords } = this.props.liveLocation;
      return (
        
        <MapView
              provider='google'
              style={{ height: '100%', width: '100%' }}
              ref={ref => { this.map = ref; }}
              initialRegion={{
                latitude: Number(origin.lat),
                longitude: Number(origin.lng),
                longitudeDelta: 0.2,
                latitudeDelta: 0.2
              }}
              onLayout={this.onLayout}
        >
          {origin != null && <MapView.Marker.Animated 
            coordinate={{ latitude: Number(origin.lat), longitude: Number(origin.lng) }}
            ref={marker => { this.marker = marker }}
            flat
            style={{ transform: [{
              rotate: origin.heading === undefined ? '0deg' : `${origin.heading}deg`
            }]
          }}
            >
            {/* <Image
              style={{ 
                height: 25,
                width: 25,
                transform: [{
                rotate: '270deg'
                }]
              }}
              source={require('../../assets/car.png')}
              />
               */}
              <Icon name='directions-car' width={25} height={25} />
            
          </MapView.Marker.Animated>}

           {des != null && <MapView.Marker 
            coordinate={{ latitude: Number(des.lat), longitude: Number(des.lng) }}
           >
             <Icon name='place' />
             </MapView.Marker>}

          {coords.length > 1 && 
                <MapView.Polyline
                          coordinates={coords}
                          strokeWidth={2}
                          strokeColor="black"
                />
                }
                
        </MapView>
      );
    }  
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
      {this.renderContent()}
      { !this.state.loading && !this.state.error && <Card 
                  style={{
                      position: 'absolute',
                      width: '90%',
                      alignSelf: 'center',
                      borderWidth: 1,
                      borderRadius: 2,
                      borderColor: '#ddd',
                      borderBottomWidth: 0,
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.6,
                      shadowRadius: 2,
                      elevation: 6,
                      marginLeft: 0,
                      marginRight: 0,
                      marginTop: 10,
                      marginBottom: 10,
                  }}
              > 
              <OpenSansText style={styles.durationStyle}>Duration: {this.props.liveLocation.duration} </OpenSansText>
              <OpenSansText style={styles.durationStyle}>Distance: {this.props.liveLocation.distance} </OpenSansText>
              {this.state.showCallButton && <TouchableOpacity
                    onPress={this.props.callDriver}
                    style={{ 
                        // width: '90%', 
                        alignSelf: 'center', 
                        marginTop: 8, 
                        padding: 6,
                    }}
                > 
                    <OpenSansText style={{ color: DARK, fontWeight: '400', fontSize: 16 }}> Call {this.props.activePool.pool.name} </OpenSansText>
                    <Icon name='call' color={DARK} />

                </TouchableOpacity>}

              </Card>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  durationStyle: {
    alignSelf: 'center',
    color: DARK,
    fontWeight: '500',
    margin: 4
  }
});
const mapStateToProps = state => {
  return {
    activePool: state.activepool.activePool,
    liveLocation: state.activepool.liveLocation
  };
};
export default connect(mapStateToProps, actions)(TrackDriver);
