import React from 'react';
import { View, Platform, DeviceEventEmitter, StyleSheet, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';
import * as actions from '../../actions';
import PoolList from '../../components/pools/PoolList';
import { DARK } from '../../config';
import Header from '../../components/common/Header';


class PoolsScreen extends React.Component {
  static navigationOptions = {
    header: null,
    headerStyle: {
    backgroundColor: DARK,
    borderWidth: 0,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
    fontWeight: 'bold',
    },
    tabBarIcon: ({ tintColor }) => {
          return <Icon name="list" size={20} color={tintColor} />;
         }
    };

  state = {
    showContent: 1,
    showDriverDetails: false,
  }
  componentDidMount() {
    if (Platform.OS === 'android') {
      LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message: "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
        ok: "YES",
        cancel: "NO",
        enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
        showDialog: true, // false => Opens the Location access page directly
        openLocationServices: true, // false => Directly catch method is called if location services are turned off
        preventOutSideTouch: true, //true => To prevent the location services popup from closing when it is clicked outside
        preventBackClick: true, //true => To prevent the location services popup from closing when it is clicked back button
        providerListener: true // true ==> Trigger "locationProviderStatusChange" listener when the location state changes
    }).then(function(success) {
        // success => {alreadyEnabled: true, enabled: true, status: "enabled"} 
          
        }.bind(this)
    ).catch((error) => {
        console.log(error.message);
    });
    
    DeviceEventEmitter.addListener('locationProviderStatusChange', function(status) { // only trigger when "providerListener" is enabled
        console.log(status); //  status => {enabled: false, status: "disabled"} or {enabled: true, status: "enabled"}
    });
      }
  }
  componentWillUnmount() {
    if (Platform.OS === 'android') {
      LocationServicesDialogBox.stopListener(); // Stop the "locationProviderStatusChange" listener.
    }
  }

  renderContent() {
    if (this.state.showContent === 1) {
      return (
        <PoolList
          navigation={this.props.navigation}
        />
      );
    }
  }
 
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header> Pools </Header>
        {this.renderContent()}
      </View>
    );
  }
}


export default connect(null, actions)(PoolsScreen);
