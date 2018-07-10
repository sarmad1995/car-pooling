import React from 'react';

import { View } from 'react-native';
import { Card, Icon, Text, Button } from '@shoutem/ui';
import { connect } from 'react-redux';
import { DARK } from '../../config';
import { Loading } from '../../components/common';
import DriversActivePool from '../../components/driver/DriversActivePool';
import RidersActivePool from '../../components/rider/RidersActivePool';
import * as actions from '../../actions';

class ActivePool extends React.Component {
    static navigationOptions = {
        title: 'Active Pool',
        headerStyle: {
        backgroundColor: DARK,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
        fontWeight: 'bold',
        }
    };
    state = {
        error: '',
        loading: true
    }
    componentDidMount() {
        this.onRefresh();
    }
    onRefresh = () => {
        this.setState({ loading: true });
        this.props.isActivePool(error => {
            this.setState({ error });
            this.setState({ loading: false });
        });
    }
    onDriverCancel = (done) => {
        this.props.suspendActivePool(() => {
            this.onRefresh();
            done();
            }
        );
    }
    renderContent() {
        if (this.state.loading) {
            return (
                <Loading />
            );
        } else if (this.state.error) {
            return (
              <Card style={{ height: '90%', width: '100%', margin: 20 }}>
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
          } else if (this.props.isActive) {
            return (
                <View>
                    <DriversActivePool
                        onCancelActivePoolByDriver={this.onDriverCancel}
                    />
                </View>
            );
        } else if (!this.props.isActive) {
            return (
                <View>
                    <RidersActivePool
                        navigation={this.props.navigation}
                    />
                </View>
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
const mapStateToProps = state => {
    return {
        isActive: state.driver.isActive
    };
};
export default connect(mapStateToProps, actions)(ActivePool);
