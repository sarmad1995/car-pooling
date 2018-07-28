import React from 'react';
import { Image } from 'react-native';
import { Icon } from 'react-native-elements';
import { StackNavigator, SwitchNavigator, TabNavigator } from 'react-navigation';
import SignInScreen from './auth/SignInScreen';
import PoolsScreen from './main/PoolScreen';
import DriverScreen from './main/DriverScreen';
import SettingsScreen from './main/SettingsScreen';
import AppLoadingScreen from './auth/AuthLoadingScreen';
import PickLocation from './main/PickLocation';
import JourneyScreen from './main/JourneyScreen';
import ActivePool from './main/ActivePool';
import { DARK } from '../config';
import TrackDriver from './main/TrackDriver';

import accountDark from '../../assets/icons/accountDark.png';
import accountLight from '../../assets/icons/accountLight.png';

import activePoolLight from '../../assets/icons/activePoolLight.png';

import poolListLight from '../../assets/icons/poolListLight.png';

import journeyDark from '../../assets/icons/journeyDark.png';
import journeyLight from '../../assets/icons/journeyLight.png';

import driverFeed from '../../assets/icons/steering.png';

// Implementation of HomeScreen, OtherScreen, SignInScreen, AuthLoadingScreen
// goes here.
// Implementation of HomeScreen, OtherScreen, SignInScreen, AuthLoadingScreen
// goes here.

const AppStack = TabNavigator({
   poolscreen: {
      screen: StackNavigator({
        pools: {
          navigationOptions: {
            tabBarLabel: 'Pools',
            tabBarIcon: ({ tintColor }) => {
            return setImage('pools', tintColor);
            }
          },
          screen: PoolsScreen
           },
      })
    },
   driverscreen: {
     screen: new TabNavigator({
       driverfeed: {
        screen: StackNavigator({
          driver: { screen: DriverScreen },
          pickLocation: { screen: PickLocation }
        }, {
          navigationOptions: {
            tabBarLabel: 'Driver Feed',
            tabBarIcon: ({ tintColor }) => {
            return setImage('driverfeed', tintColor);
            }
          },
        }
      ) 
       },
       journey: {
        screen: StackNavigator({
          pools: {
            navigationOptions: {
              tabBarLabel: 'Journey',
              tabBarIcon: ({ tintColor }) => {
              return setImage('journey', tintColor);
              }
            },
            screen: JourneyScreen
             },
        }, 
      )
      },
        
     }, { 
      headerMode: 'none',       // I don't want a NavBar at top
      tabBarPosition: 'top', // So your Android tabs go bottom
      swipeEnabled: false,
      lazy: true,
      animationEnabled: false,
      tabBarOptions: {
          activeTintColor: 'white',  // Color o f tab when pressed
          inactiveTintColor: '#b5b5b5', // Color of tab when not pressed
          showIcon: 'true', // Shows an icon for both iOS and Android
          //showLabel: (Platform.OS !== 'android'), //No label for Android
          labelStyle: {
            fontSize: 12,
            margin: 2,
            padding: 0,
          },
          indicatorStyle: {
           borderBottomColor: '#f5e9dd',
           borderBottomWidth: 2,
         },
          style: {
            height: 70,
            backgroundColor: DARK, // Makes Android tab bar white instead of standard blue
            }
          }
            }
    )
   },
   
   activepool: { 
    navigationOptions: {
      tabBarLabel: 'Active Pool',
      tabBarIcon: ({ tintColor }) => {
      return setImage('activepool', tintColor);
      }
    },
    screen: StackNavigator({
      pools: {
        screen: ActivePool
        },
      trackdriver: {
        screen: TrackDriver
      }  
    })
   },
   settings: { 
    navigationOptions: {
      tabBarLabel: 'Settings',
      tabBarIcon: ({ tintColor }) => {
        return setImage('settings', tintColor);
      }
    },
     screen: SettingsScreen
     }
 },
  {
    headerMode: 'none',       // I don't want a NavBar at top
    tabBarPosition: 'bottom', // So your Android tabs go bottom
    swipeEnabled: false,
    lazy: true,
    animationEnabled: false,
    tabBarOptions: {
        activeBackgroundColor: 'white',
        activeTintColor: DARK,  // Color o f tab when pressed
        inactiveTintColor: 'white', // Color of tab when not pressed
        showIcon: 'true', // Shows an icon for both iOS and Android
        //showLabel: (Platform.OS !== 'android'), //No label for Android
        labelStyle: {
          fontSize: 10,
          fontFamily: 'OpenSans-Light',
          fontWeight: '500',
          margin: 4,
          padding: 0,
        },
        indicatorStyle: {
         backgroundColor: 'white',
         height: 73
       },
         style: {
           height: 65,
           borderTopWidth: 0,
           backgroundColor: DARK, // Makes Android tab bar white instead of standard blue
           }
        }
          });
const AuthStack = StackNavigator({
    signin: { screen: SignInScreen }
   },
   {
    headerMode: 'none',
    navigationOptions: {
        headerVisible: false,
    }
}
);

export default SwitchNavigator(
  {
    AuthLoading: AppLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);

const setImage = (tabName, tintColor) => {
  if (tintColor === 'white' | tintColor === '#b5b5b5') {
    switch (tabName) { 
      case 'settings':
      return <Image source={accountLight} style={{ height: 20, width: 20 }} />;
      case 'activepool': 
      return <Image source={activePoolLight} style={{ height: 20, width: 20 }} />;
      case 'pools': 
      return <Image source={poolListLight} style={{ height: 20, width: 20 }} />;
      case 'journey': 
      return <Image source={journeyLight} style={{ height: 25, width: 25 }} />;
      case 'driverfeed': 
      return <Image source={driverFeed} style={{ height: 35, width: 35 }} />;
      default:
        return;
    }
  } else if (tintColor === DARK) {
    switch (tabName) {
      case 'settings':
        return <Image source={accountDark} style={{ height: 35, width: 30 }} />;
      case 'activepool': 
        return <Image source={activePoolLight} style={{ height: 35, width: 30 }} />;
      case 'pools': 
      return <Image source={poolListLight} style={{ height: 45, width: 45 }} />;  
      case 'journey': 
      return <Image source={journeyDark} style={{ height: 35, width: 35 }} />;
      case 'driverfeed': 
      return <Image source={driverFeed} style={{ height: 45, width: 45 }} />;
      default:
        return;
    }
  }
};