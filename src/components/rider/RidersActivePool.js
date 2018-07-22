import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Icon } from 'react-native-elements';
import { Heading, Text, Button, Card } from '@shoutem/ui';
import { ActivePoolOverView, Loading } from '../common';
import PendingRating from './PendingRating';
import PendingRequestOverView from '../common/PendingRequestOverView';
import CancelJourney from '../Modals/CancelJourney';
import * as actions from '../../actions';
import ActivePoolError from '../common/ActivePoolError';
import { DARK } from '../../config';
import OpenSansText from '../common/OpenSansText';

class RidersActivePool extends React.Component {
    state = {
        loading: true,
        showCancelModal: false,
        poolFlag: null,
        fetchingModal: false
    }
    componentWillMount() {
        console.log('cleared interval for active pool');
        clearInterval(this.interval);
    }
    componentDidMount() {
        this.setState({ loading: true });
        this.props.getRidersActivePool(() => {
            this.setState({ loading: false });
        });
        this.interval = setInterval(() => this.props.getRidersActivePool(() => {
            console.log('got new data for active Pool');
        }), 7000);
    }
    componentDidUpdate() {
            if (this.props.isActive) {
                clearInterval(this.interval);
            }
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    onRefresh = () => {
        this.setState({ loading: true });
        this.props.getRidersActivePool(() => {
            this.setState({ loading: false });
        });    
    } 
    onTrackDriver = () => {
        this.props.navigation.navigate('trackdriver', { pool: this.props.activePool.pool });
    }
    onDriverRatingDone = (rating) => {
         this.props.rateDriver(rating, this.props.activePool.lastJourney.journeyId, this.onRefresh);
    }
    onCancel = () => {
        this.setState({ showCancelModal: true });
    }
    onCancelJourenyCancel = () => {
        this.setState({ showCancelModal: false });
    }
    onCancelPendingRequest = async (journey) => {
        this.setState({ fetchingModal: true });
        const { requestId } = this.props.activePool.pendingPool;
        await this.props.cancelPendingRequestByRider(requestId, () => {
            this.setState({ fetchingModal: false });
            this.setState({ showCancelModal: false });
        });
        this.onRefresh();
    }
    onCancelActivePool = async () => {
        console.log('active ppooool');
        this.setState({ fetchingModal: true });
        console.log(this.props.activePool.pool);
        const { id: requestId } = this.props.activePool.pool;
        await this.props.cancelActivePoolByRider(requestId, () => {
            this.setState({ fetchingModal: false });
            this.setState({ showCancelModal: false });
        });
        this.onRefresh();
    }
    renderContent = () => {
        if (this.state.loading) {
            return (
                <View style={{ height: '100%', width: '100%' }}>
                    <Loading />
                </View>     
            );
            
        } else if (this.props.activePool.error === 'pending') {
            console.log('Pending Pool', this.props.activePool.pendingPool);
                return (
                    <PendingRequestOverView
                        pool={this.props.activePool.pendingPool}
                        cost={this.props.activePool.cost}
                        onCancel={this.onCancel}
                    />
                );
        } else if (this.props.activePool.error === 'pendingRating') {
            console.log(this.props.activePool.lastJourney);
            return (
                <PendingRating
                    lastJourney={this.props.activePool.lastJourney}
                    onDone={(rating) => this.onDriverRatingDone(rating)}
                />
            );
        } else if (this.props.activePool.pool === 'nope') {
            return (
                <ActivePoolError
                    error={this.props.activePool.error}
                    onRefresh={this.onRefresh}
                    buttonName='Refresh'
                /> 
            );
        } return (
            <View style={{ height: '100%' }}>
                <Button
                    onPress={this.onTrackDriver}
                    style={{ 
                        width: '90%', 
                        alignSelf: 'center', 
                        marginTop: 8, 
                        backgroundColor: DARK, 
                        padding: 6,
                        borderRadius: 2,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.6,
                        shadowRadius: 2
                    }}
                > 
                    <OpenSansText style={{ color: 'white', fontWeight: '400', fontSize: 20, padding: 4 }}> Track Driver </OpenSansText>
                    <Icon name='location-on' color='white' />
                </Button>

                <ActivePoolOverView
                    pool={this.props.activePool.pool}
                    cost={this.props.activePool.cost}
                />

                <Button
                    onPress={this.onCancel}
                    style={{ 
                        position: 'absolute',
                        bottom: 100,
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
                    onDone={this.props.activePool.error === 'pending' ? this.onCancelPendingRequest : this.onCancelActivePool}
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
        getActivePoolError: state.activepool.error,
        isActive: state.driver.isActive

    };
};
export default connect(mapStateToProps, actions)(RidersActivePool);
