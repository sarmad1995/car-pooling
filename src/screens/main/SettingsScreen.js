import React from 'react';
import { View, AsyncStorage } from 'react-native';
import { Button, Text, Card } from '@shoutem/ui';
import { DARK } from '../../config';

class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
    headerStyle: {
    backgroundColor: DARK,
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
    fontWeight: 'bold',
    },
    };
  logOut = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  }
  render() {
    return (
      <View>
        <Card
        style= {{
          backgroundColor: DARK,
          borderRadius: 6,
          width: '100%',
          marginTop: 50,
          padding: 20
        }}>
        <Button
          style={{
            backgroundColor: DARK,
            borderWidth: 0,
          }}
        >
          <Text style={{ color: 'white' }}> Change Password </Text>
        </Button>
        <Button
          style={{
            backgroundColor: DARK,
            borderWidth: 0,
          }}
        >
          <Text style={{ color: 'white' }}> Contact Us? </Text>
        </Button>
        <Button
          style={{
            backgroundColor: DARK,
            borderWidth: 0,
          }}
          onPress={this.logOut}
        >
            <Text style={{ color: 'white' }}> Log Out </Text>
        </Button>
        </Card>
      </View>
    );
  }
}
export default SettingsScreen;
