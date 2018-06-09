import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import CreateRide from './CreateRide';
import { Loading } from '../common';
import PoolRequests from './PoolRequests';
import * as actions from '../../actions';

class DriverFeed extends React.Component {
    
    componentDidMount() {
        this.props.isActivePool();
    }
    renderContent() {
        if (this.props.isActive === null) {
            return (
                <Loading />
            );
        } else if (this.props.isActive) {
            return (
                <View>
                    <PoolRequests />
                </View>
            );
        } 
        return (
            <View>
                <CreateRide navigation={this.props.navigation} />
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

export default connect(mapStateToProps, actions)(DriverFeed);
