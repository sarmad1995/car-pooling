import React from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { Card, Heading, Text, Divider,  Subtitle, Caption, Button, Icon } from '@shoutem/ui';

import Loading from './../common/Loading';
import PoolOverView from '../common/PoolOverView';
import DriverDetailModal from './../Modals/DriverDetailModal';
import * as actions from './../../actions';

class PoolList extends React.Component {

    state = {
        refreshing: false,
        showDriverDetails: false
    };
    componentDidMount() {
        this.props.getPools(() => { this.setState({ refreshing: false }); });
    }
    onRefresh = () => {
        this.setState({ refreshing: true });
        this.props.getPools(() => { this.setState({ refreshing: false }); });
    }
    onPoolOverViewPress = (item) => {
        this.setState({ showDriverDetails: true });
        console.log(item);
        this.props.setDriverDetailModal(item);
    }
    onDriverDetailModalBack = () => {
        this.props.resetDriverDetails();
        this.setState({ showDriverDetails: false });
      }
    renderRow = ({ item, index }) => {
        return (
          <PoolOverView
            index={index}
            item={item}
            onPress={() => this.onPoolOverViewPress(item)}
          />
        );
      }
      ListEmptyView = () => {
        return (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Card style={{ width: '90%', justifyContent: 'center', alignSelf: 'center', padding: 10, alignItems: 'center', marginTop: 6 }}>
     
                <Subtitle style={{ textAlign: 'center' }}> {this.props.pools.error} </Subtitle>
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
    render() {
        const { data } = this.props.pools;
        return (
            <View>
                {data !== undefined && <FlatList 
                    ListEmptyComponent={this.ListEmptyView}
                    data={data} 
                    renderItem={this.renderRow}
                    refreshing={this.state.refreshing}
                    onRefresh={this.onRefresh}
                />}
                {data === undefined && <Loading />}
                <DriverDetailModal
                    navigation={this.props.navigation}
                    visible={this.state.showDriverDetails}
                    onBack={this.onDriverDetailModalBack}
                />
            </View>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        pools: state.pools.pools
    };
};
export default connect(mapStateToProps, actions)(PoolList);
