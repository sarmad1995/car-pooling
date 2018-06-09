import React from 'react';
import { View, Text, AsyncStorage } from 'react-native';
import { Button, Icon } from 'react-native-elements';
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
    tabBarIcon: ({ tintColor }) => {
          return <Icon name="settings" size={20} color={tintColor} />;
         }
    };
  signOut = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  }
  render() {
    return (
      <View>
        <Text>Sign Out</Text>
        <Button
          raised
          icon={{ name: 'cached' }}
          title='Sign Out'
          onPress={this.signOut}
        />
      </View>
    );
  }
}
export default SettingsScreen;
