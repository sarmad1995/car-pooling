import React from 'react';
import { View, StyleSheet, Platform, Image } from 'react-native';
import MapView, { AnimatedRegion } from 'react-native-maps';
import { connect } from 'react-redux';
import { Card, Heading, Text, Button } from '@shoutem/ui';
import { Icon } from 'react-native-elements';
import { DARK } from '../../config';
import * as actions from '../../actions';
import { Loading } from '../../components/common';

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
                // this.map.setMapBoundaries({ latitude: 34.277865, longitude: 75.351941 }, { latitude: 33.635500, longitude: 74.522094 });
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
        <Card>
            <Heading> No directions available </Heading>
            <Button> 
              <Text> Retry </Text>
              <Icon name='refresh' />
            </Button>
        </Card>
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
            <Image
              style={{ 
                height: 25,
                width: 25,
                transform: [{
                rotate: '270deg'
                }]
              }}
              source={require('../../assets/car.png')}
            />
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
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    liveLocation: state.activepool.liveLocation
  };
};
export default connect(mapStateToProps, actions)(TrackDriver);
