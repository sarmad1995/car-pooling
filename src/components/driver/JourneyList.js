import React from 'react';

import { View, FlatList } from 'react-native';
import { Text, Icon, Card, Heading, Subtitle, Button } from '@shoutem/ui';
import { connect } from 'react-redux';

import { Loading } from '../common/Loading';
import JourneyOverView from '../common/JourneyOverView';
import { DARK } from '../../config';
import * as actions from '../../actions';

class JourneyList extends React.Component {

    state = {
        refreshing: false,
        loading: false
    }
    componentWillMount() {
        this.setState({ loading: true });
        this.props.getPoolBuddies(() => {
            this.setState({ loading: false });
            this.setState({ refreshing: false });
        });
    }
    onRefresh = () => {
        this.setState({ refreshing: true });
        this.props.getPoolBuddies(() => this.setState({ refreshing: false }));
    }

    onDropOff = (item) => {
        this.setState({ loading: true });
        this.props.dropoffComplete(item.id, () => this.setState({ loading: false }));
    }
    onPickUp = (item) => {
        this.setState({ loading: true });
        this.props.pickupComplete(item.id, () => this.setState({ loading: false }));
    }
    ListEmptyView = () => {
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Card style={{ width: '90%', justifyContent: 'center', alignSelf: 'center', padding: 10, alignItems: 'center', marginTop: 6 }}>
     
                <Subtitle style={{ textAlign: 'center' }}> No Journeys right now. </Subtitle>
                <Button
                    style={{ width: '100%', margin: 6 }}
                    onPress={this.onRefresh}
                > 
                    <Text> Try Again </Text>
                    <Icon name='refresh' />
                </Button>    
        
            </Card>
          </View>  
          
     
        );
      }
    renderRow = ({ item, index }) => {
        return (
            <JourneyOverView
                onPickUp={() => this.onPickUp(item)}
                onDropOff={() => this.onDropOff(item)}
                index={index}
                journey={item}
                onPress={() => this.onPoolOverViewPress(item)}
            />
        );
    }
    renderContent = () => {
        if (this.state.loading) {
            return (
                <View style={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Loading />
                </View>
                
            );
        }
        return (
            <FlatList 
                ListEmptyComponent={this.ListEmptyView}
                data={this.props.poolBuddies} 
                renderItem={this.renderRow}
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
            />
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
        poolBuddies: state.journeys.poolBuddies
    };
};
export default connect(mapStateToProps, actions)(JourneyList);
