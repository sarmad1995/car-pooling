import React from 'react';

import { View } from 'react-native';
import { Heading } from '@shoutem/ui';
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
    componentDidMount() {
        this.props.isActivePool();
    }
    onDriverCancel = (done) => {
        this.props.suspendActivePool(() => {
            this.props.isActivePool();
            done();
            }
        );
    }
    renderContent() {
        if (this.props.isActive === null) {
            return (
                <Loading />
            );
        } else if (this.props.isActive) {
            return (
                <View>
                    <DriversActivePool
                        onCancelActivePoolByDriver={this.onDriverCancel}
                    />
                </View>
            );
        } 
        return (
            <View>
                <RidersActivePool
                    navigation={this.props.navigation}
                />
            </View>
        );
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
