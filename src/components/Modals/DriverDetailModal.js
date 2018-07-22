import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import RNGooglePlaces from 'react-native-google-places';
import { connect } from 'react-redux';
import { Subtitle } from '@shoutem/ui';

import { Text, Button, Icon } from 'react-native-elements';
import { Loading } from './../common';
import ProgressBar from './../common/ProgressBar';
import { DARK, LIGHT, IUST_COORDS_OBJECT } from '../../config';
import * as actions from '../../actions';
import OpenSansText from '../common/OpenSansText';


const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };

class DriverDetailModal extends React.Component {

    state = {
        loading: true,
        showHeader: 1,
        fetching: false,
        error: ''
    }
    componentWillReceiveProps({ driverDetail }) {
        if (driverDetail.driver.name != null) {
            this.setState({ loading: false });
        }    
    }
    onBack = () => {
        this.setState({ loading: true });
        this.setState({ showHeader: 1 });
        this.setState({ fetching: false });
        this.setState({ error: '' });
        this.props.onBack();
    }
    onLayout = () => {
        const { location: { lat, lng } } = this.props.driverDetail.driver;
        setTimeout(
            () => {
                try {
                    // this.map.setMapBoundaries({ latitude: 34.277865, longitude: 75.351941 }, { latitude: 33.635500, longitude: 74.522094 });
                    this.map.fitToCoordinates([{ latitude: IUST_COORDS_OBJECT.latitude, longitude: IUST_COORDS_OBJECT.longitude }, { latitude: Number(lat), longitude: Number(lng) }], {
                        edgePadding: DEFAULT_PADDING,
                        animated: true,
                    });
                } catch (e) {
                    console.error('Too early my friend');
                } 
            }, 1000
        );   
    }
    onFinialize = (fetching, shouldGoBack, error) => {
        if (shouldGoBack) {
            this.onBack();
            this.props.navigation.navigate('activepool');
        }
        this.setState({ fetching, error });
    }
    onConfirm = () => {
        if (this.state.showHeader === 2) {
           this.setState({ fetching: true });
           this.props.sendPoolRequest(this.props.driverDetail, this.state.region, this.onFinialize);
        } else {
            this.setState({ showHeader: 2 });
        }
    }
    
    onRegionChangeComplete = (region) => {
        this.setState({ region });
    }
    animateToRegion(lat, lng) {
        this.map.animateToRegion({
          latitude: lat,
          longitude: lng,
          longitudeDelta: 0.004,
          latitudeDelta: 0.004
        });
      }

    openSearchModal = () => {
        RNGooglePlaces.openAutocompleteModal({
          latitude: 34.010160,
          longitude: 74.808882
        })
        .then((place) => {
           this.animateToRegion(place.latitude, place.longitude);
            console.log(place);
            // place represents user's selection from the
            // suggestions and it is a simplified Google Place object.
        })
        .catch(error => console.log(error.message));  // error is a Javascript Error object
      }
    renderMap() {
        const { location: { lat, lng } } = this.props.driverDetail.driver;
        const { coords } = this.props.driverDetail;
        return (
            <MapView
                style={{ height: 300, width: 300 }}
                provider='google'
                ref={ref => { this.map = ref; }}
                initialRegion={{
                    latitude: 33.9260206,
                    longitude: 75.0173499,
                    latitudeDelta: 0.009,
                    longitudeDelta: 0.009
                }}
                onRegionChangeComplete={this.onRegionChangeComplete}
                onLayout={this.onLayout}
            >
                {coords.length > 1 && 
                <MapView.Polyline
                            coordinates={coords}
                            strokeWidth={2}
                            strokeColor="black"
                />
                }

                {coords.length === 0 && 
                <MapView.Polyline
                    coordinates={[
                        { latitude: IUST_COORDS_OBJECT.latitude, longitude: IUST_COORDS_OBJECT.longitude },
                        { latitude: Number(lat), longitude: Number(lng) },
                    ]}
                    strokeWidth={2}
                    strokeColor="red"
                />
                }
                 <MapView.Marker
                    pinColor={DARK}
                    coordinate={{ latitude: IUST_COORDS_OBJECT.latitude, longitude: IUST_COORDS_OBJECT.longitude }}
                    title={'IUST'}
                 />
    
                 <MapView.Marker
                    pinColor={DARK}
                    coordinate={{ latitude: Number(lat), longitude: Number(lng) }}
                 />
            </MapView>
        );
    }
    renderHeader = () => {
        const { name, title, number, gender, flag } = this.props.driverDetail.driver;
        if (this.state.showHeader === 1) {
            return (
                     <View>
                        <View style={{ alignSelf: 'center', width: 300 }}>
                            <Text style={{ fontSize: 20, margin: 6 }}>{name}</Text>
                        <Text style={{ fontSize: 16, margin: 6 }}>Number: {number}</Text>
                        <Text style={{ fontSize: 16, margin: 6 }}>Gender: {gender}</Text>
                        <Text style={{ fontSize: 16, margin: 6 }}>Journey: {title}</Text>
                        </View>
                        
                    </View>
            );
        }
        return (
            <View>
                <Text style={{ alignSelf: 'center', margin: 6, fontSize: 20 }}> { flag === 'University' ? 'Select your destination' : 'Select your pickup point'}</Text>
                <Button    
                    icon={{ name: 'location-on' }}
                    backgroundColor={DARK}
                    buttonStyle={{ borderRadius: 6, marginBottom: 6 }}
                    title='Search for a location'
                    onPress={this.openSearchModal}
                />
            </View>
         );
    }
    renderFetching = () => {
        if (this.state.fetching) {
            return (
                <View style={{ width: 300, height: 40 }}>
                    <ProgressBar
                        style={{
                            flex: 1
                        }}
                    />
                </View>
            );
        } 
        return (
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
                <Button
                    onPress={this.onBack}
                    icon={{ name: 'subdirectory-arrow-left' }}
                    textStyle={styles.buttonText}
                    buttonStyle={styles.buttonStyle}
                    title='Go Back'
                /> 
                <Button
                    onPress={this.onConfirm}
                    icon={{ name: 'subdirectory-arrow-left' }}
                    textStyle={styles.buttonText}
                    buttonStyle={styles.buttonStyle}
                    title={this.state.showHeader === 1 ? 'Confirm' : 'Done'}
                />
             </View>
        );
    }
    renderContent() {
        if (this.state.loading) {
            return <Loading />;
        }
        
        return (
            <View style={styles.alertContainerStyle}>
                <View style={styles.parentStyle}>
                    {this.renderHeader()}
                    <View>
                     {this.renderMap()}
                         {this.state.showHeader === 2 && 
                            <View pointerEvents='box-none' style={{ position: 'absolute', bottom: '52%', left: 0, right: 0, justifyContent: 'center', alignItems: 'center', elevation: 10 }}>
                                    <Icon 
                                        name='location-on'
                                        color={LIGHT}
                                    />
                            </View>
                        }
                    </View>
                    {this.renderFetching()}
                    
                    {this.state.error !== '' &&
                        <View style={{ padding: 20, alignItems: 'center', justifyContent: 'center', width: 300 }}>
                            <OpenSansText style={{ width: 300, color: 'red', alignSelf: 'center', margin: 8 }}>{this.state.error}</OpenSansText> 
                        </View>
                    }
                </View>
            </View>
        );
    }
    render() {
        const { visible } = this.props;
        return (
        <Modal
            animationType="fade"
            transparent
            visible={visible}
            onRequestClose={() => { }}
        >
            {this.renderContent()}
        </Modal>
        );
    }
    }
const styles = StyleSheet.create({
  alertContainerStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    position: 'relative',
    flex: 1,
    justifyContent: 'center',

  },
  buttonStyle: {
      backgroundColor: 'white'
  },
  buttonText: {
      color: DARK
  },
  dialogStyle: {
    backgroundColor: 'white'
  },
  pinTextStyle: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 40,
    margin: 8
  },
  parentStyle: {
    backgroundColor: 'white',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    position: 'relative'
  }
});
const mapsStateToProps = (state) => {
    return {
        driverDetail: state.pools.driverDetail
    };
};
export default connect(mapsStateToProps, actions)(DriverDetailModal);

