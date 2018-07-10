import React from 'react';
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
            return <Icon name="list" size={20} color={tintColor} />;
            }
          },
          screen: PoolsScreen
           },
      })
    },
   driverscreen: {
     screen: new TabNavigator({
       driverFeed: {
        screen: StackNavigator({
          driver: { screen: DriverScreen },
          pickLocation: { screen: PickLocation }
        }, {
          navigationOptions: {
            tabBarLabel: 'Driver Feed',
            tabBarIcon: ({ tintColor }) => {
            return <Icon name="rss-feed" size={20} color={tintColor} />;
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
              return <Icon name="directions-run" size={20} color={tintColor} />;
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
      return <Icon name="directions-car" size={20} color={tintColor} />;
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
      return <Icon name="settings" size={20} color={tintColor} />;
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
          margin: 0,
          padding: 0,
        },
        indicatorStyle: {
         backgroundColor: 'white',
         height: 68
       },
         style: {
           height: 60,
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
