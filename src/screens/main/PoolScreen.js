import React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import PoolList from '../../components/pools/PoolList';
import { DARK } from '../../config';

class PoolsScreen extends React.Component {
  static navigationOptions = {
    title: 'Pools',
    headerStyle: {
    backgroundColor: DARK,
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

  renderContent() {
    if (this.state.showContent === 1) {
      return (
        <PoolList />
      );
    }
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.renderContent()}
      </View>
    );
  }
}

export default connect(null, actions)(PoolsScreen);
