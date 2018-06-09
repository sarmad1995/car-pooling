import React from 'react';
import { View, Text, Alert } from 'react-native';
import { Icon, Card } from 'react-native-elements';
import { connect } from 'react-redux';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import { Loading } from '../../components/common';
import DriverFeed from '../../components/driver/DriverFeed';
import * as actions from '../../actions';
import { DARK } from '../../config';

class DriverScreen extends React.Component {
  static navigationOptions = {
      header: null,
  };
      
  state = {
    showContent: 1
  }
  componentWillMount() {
    BackgroundGeolocation.events.forEach(event => BackgroundGeolocation.removeAllListeners(event));
  }
  componentDidMount() {
    this.props.isDriver(() => this.props.navigation.navigate('Auth'));
  }
  renderDriverScreen() {
    if (this.props.isDriverLoading) {
      return <Loading />;
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
