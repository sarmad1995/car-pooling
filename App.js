/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  View,
  YellowBox,
  SafeAreaView
} from 'react-native';
import { Provider } from 'react-redux';
import SwitchNavigator from './src/screens/SwitchNavigator';
import store from './src/store/index';
import { DARK } from './src/config';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);


export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
      <SafeAreaView style={{ flex: 1, backgroundColor: DARK }}>
        <View style={{ flex: 1 }}>
            <SwitchNavigator />
        </View>
        </SafeAreaView>
       </Provider>
    );
  }
}

