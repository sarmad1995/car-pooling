import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { Heading, Text, Button, Card } from '@shoutem/ui';
import { ActivePoolOverView, Loading } from '../common';
import CancelJourney from '../Modals/CancelJourney';
import * as actions from '../../actions';
import ActivePoolError from '../common/ActivePoolError';
import OpenSansText from '../common/OpenSansText';
import { DARK } from '../../config';

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
        console.log('Drivers active pool');
        console.log(this.state.loading);
        console.log(this.props.activePool);
        if (this.state.loading) {
            return (
                <View style={{ height: '100%', width: '100%' }}>
                    <Loading />
                </View>     
            );
        } else if (this.props.activePool.pool === 'nope') {
            return (
                <ActivePoolError
                    error={this.props.activePool.error + 'inside drivers active pool'}
                    onRefresh={this.onRefresh}
                />  
            );
        } return (
            <View>
            <ActivePoolOverView
                pool={this.props.activePool.pool}
            />
            <Button
                    onPress={this.onCancel}
                    style={{ 
                        marginTop: 10,
                        width: '90%', 
                        alignSelf: 'center',
                        backgroundColor: DARK, 
                        padding: 6,
                        borderRadius: 2,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.6,
                        shadowRadius: 2
                    }}
            > 
                    <OpenSansText style={{ color: 'white', fontWeight: '400', fontSize: 16 }}> Cancel Ride? </OpenSansText>
                    <Icon name='cancel' color='white' />

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
