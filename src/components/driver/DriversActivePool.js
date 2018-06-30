import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Heading, Text, Button, Icon, Card } from '@shoutem/ui';
import { ActivePoolOverView, Loading } from '../common';
import CancelJourney from '../Modals/CancelJourney';
import * as actions from '../../actions';

class DriversActivePool extends React.Component {
    state = {
        loading: true,
        showCancelModal: false,
        fetchingModal: false
    }
    componentDidMount() {
        this.setState({ loading: true });
        this.props.getDriversActivePool(() => {
            this.setState({ loading: false });
        });
    }
    onRefresh = () => {
        this.setState({ loading: true });
        this.props.getDriversActivePool(() => {
            this.setState({ loading: false });
        });    
    } 
    onCancel = () => {
        this.setState({ showCancelModal: true });
    }
    onCancelJourenyCancel = () => {
        this.setState({ showCancelModal: false });
    }
    onCancelFinalize = async () => {
        this.setState({ fetchingModal: true });
        await this.props.onCancelActivePoolByDriver(() => {
            this.setState({ fetchingModal: false });
            this.setState({ showCancelModal: false });
       });
    }
    renderContent = () => {
        if (this.state.loading) {
            return (
                <View style={{ height: '100%', width: '100%' }}>
                    <Loading />
                </View>     
            );
        } else if (this.props.activePool.pool === 'nope') {
            return (
                <Card style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Heading>{this.props.activePool.error}</Heading>
                    <Button
                        onPress={this.onRefresh}
                    >
                        <Text> Try Again Driver</Text>
                        <Icon name='refresh' />
                    </Button>
                </Card>    
            );
        } return (
            <View>
            <ActivePoolOverView
                pool={this.props.activePool.pool}
            />
            <Button
                onPress={this.onCancel}
            >
                <Text style={{ color: 'red' }}> Cancel </Text>
            </Button>
            </View>

        );
    }
    render() {
        return (
            <View>
                {this.renderContent()}
                <CancelJourney
                    visible={this.state.showCancelModal}
                    onCancel={this.onCancelJourenyCancel}
                    onDone={this.onCancelFinalize}
                    journey={null}
                    fetching={this.state.fetchingModal}
                />
            </View>      
        );
    }
}
const mapStateToProps = state => {
    return {
        activePool: state.activepool.activePool,
        getActivePoolError: state.activepool.error
    };
};
export default connect(mapStateToProps, actions)(DriversActivePool);
