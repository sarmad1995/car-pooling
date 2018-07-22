import React from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { connect } from 'react-redux';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import { Loading } from '../../components/common';
import DriverFeed from '../../components/driver/DriverFeed';
import * as actions from '../../actions';
import { DARK, URL } from '../../config';
import { Button, Icon, Card } from '../../../node_modules/@shoutem/ui';
import ActivePoolError from '../../components/common/ActivePoolError';
import OpenSansText from '../../components/common/OpenSansText';

class DriverScreen extends React.Component {
  static navigationOptions = {
      header: null,
  };
      
  state = {
    showContent: 1,
    error: ''
  }
  componentWillMount() {
    BackgroundGeolocation.events.forEach(event => BackgroundGeolocation.removeAllListeners(event));
  }
  
  componentDidMount() {
    this.onRefresh();
  }
  onRefresh = () => {
    this.props.isDriver((flag, error) => {
      flag && this.props.navigation.navigate('Auth');
      this.setState({ error });
    });
  } 
  renderDriverScreen() {
    if (this.props.isDriverLoading) {
      return <Loading />;
    }
    if (this.state.error) {
      return (
        <ActivePoolError
          error={this.state.error}
          onRefresh={this.onRefresh}
          buttonName='Try again'
        />
      );
    }
    if (this.props.driverStatus) {
      return (
        <DriverFeed
            navigation={this.props.navigation}
        />
      );
    } 
    return (
      <Card 
          backgroundColor={'white'}
            style={{ 
                      width: '80%',
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
                <OpenSansText style={styles.cardHeading}> Not a registered driver </OpenSansText>
                <TouchableOpacity onPress={() => Linking.openURL(URL)}style={{ alignItems: 'center', alignSelf: 'center' }}>
                <OpenSansText style={styles.cardDetail}> Register here </OpenSansText>
                </TouchableOpacity>
            </Card>
    );
  }
  render() {
    return (
        <View style={{ flex: 1 }}>
            {this.renderDriverScreen()}
        </View>
    );
  }
}
const styles = StyleSheet.create({
  cardHeading: {
      color: 'grey',
      fontSize: 20,
      fontWeight: 'bold',
      alignSelf: 'center'
  },
  cardDetail: {
      alignSelf: 'center',
      color: DARK,
      marginTop: 6,
  }
});
  const mapStateToProps = state => {
    return {
      driverStatus: state.driver.driverStatus,
      isDriverLoading: state.driver.isDriverLoading
    };
  };
export default connect(mapStateToProps, actions)(DriverScreen);
