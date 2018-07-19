import React from 'react';

import { View } from 'react-native';
import { Card, Icon, Text, Button } from '@shoutem/ui';
import { connect } from 'react-redux';
import { DARK } from '../../config';
import { Loading } from '../../components/common';
import DriversActivePool from '../../components/driver/DriversActivePool';
import RidersActivePool from '../../components/rider/RidersActivePool';
import * as actions from '../../actions';
import Header from '../../components/common/Header';
import ActivePoolError from '../../components/common/ActivePoolError';


class ActivePool extends React.Component {
    static navigationOptions = {
        header: null,
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
                <ActivePoolError
                    error={this.state.error}
                    onRefresh={this.onRefresh}
                />
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
            <Header> Active Pool </Header>
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
