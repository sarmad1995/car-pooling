import React from 'react';
import { View, Text, Alert } from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import { Loading } from '../../components/common';
import DriverFeed from '../../components/driver/DriverFeed';
import * as actions from '../../actions';
import { DARK } from '../../config';
import { Button, Icon } from '../../../node_modules/@shoutem/ui';

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
        <Card containerStyle={{ height: '90%', margin: 20 }}>
          <Text>{this.state.error}</Text>
          <Button
            onPress={this.onRefresh}
          >
            <Icon name='refresh' />
            <Text>
            Try again 
            </Text>
          </Button>
        </Card>
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
      <Card>
          <Text>Not a registered driver, Please register in your respective department </Text>
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
  const mapStateToProps = state => {
    return {
      driverStatus: state.driver.driverStatus,
      isDriverLoading: state.driver.isDriverLoading
    };
  };
export default connect(mapStateToProps, actions)(DriverScreen);
