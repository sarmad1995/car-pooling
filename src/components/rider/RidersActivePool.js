import React from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import { Heading, Text, Button, Icon, Card } from '@shoutem/ui';
import { ActivePoolOverView, Loading } from '../common';
import PendingRating from './PendingRating';
import PendingRequestOverView from '../common/PendingRequestOverView';
import * as actions from '../../actions';

class RidersActivePool extends React.Component {
    state = {
        loading: true
    }
    componentDidMount() {
        this.setState({ loading: true });
        this.props.getRidersActivePool(() => {
            this.setState({ loading: false });
        });
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
    renderContent = () => {
        if (this.state.loading) {
            return (
                <View style={{ height: '100%', width: '100%' }}>
                    <Loading />
                </View>     
            );
            
        } else if (this.props.activePool.error === 'pending') {
                return (
                    <PendingRequestOverView
                        pool={this.props.activePool.pendingPool}
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
                <Card style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Heading>{this.props.activePool.error}</Heading>
                    <Button
                        onPress={this.onRefresh}
                    >
                        <Text> Try Again </Text>
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
                    onPress={this.onTrackDriver}
                > 
                    <Text> Track </Text>
                </Button>
            </View>    

        );
    }
    render() {
        return (
            <View>
                {this.renderContent()}
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
export default connect(mapStateToProps, actions)(RidersActivePool);
