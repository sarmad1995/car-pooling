/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  View,
  YellowBox
} from 'react-native';
import { Provider } from 'react-redux';
import SwitchNavigator from './src/screens/SwitchNavigator';
import store from './src/store/index';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);


export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
            <SwitchNavigator />
        </View>
       </Provider>
    );
  }
}

