import React from 'react';
import { View, SectionList, StyleSheet } from 'react-native';
import { Heading, Icon, Card, Text, Button } from '@shoutem/ui';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import AcceptedOverView from './AcceptedOverView';
import PendingOverView from './PendingOverView';
import { Loading } from '../common/Loading';
import { DARK } from '../../config';
import { start, stop } from '../../utils/background_tracking';


class PoolRequests extends React.Component {
    state = {
        refreshing: false,
        loading: false
    }
    componentDidMount() {
        stop();
        start();
        this.setState({ refreshing: true });
        this.props.getPoolRequests(() => this.setState({ refreshing: false }));
    }
    onRefresh = () => {
        this.setState({ refreshing: true });
        this.props.getPoolRequests(() => this.setState({ refreshing: false }));
    } 
    onAccept = (item) => {
        this.setState({ loading: true });
        this.props.acceptPoolRequest(item.id, () => this.setState({ loading: false }));
        console.log(item);
    }
    onDecline = (item) => {
        this.setState({ loading: true });
        this.props.declinePoolRequest(item.id, () => this.setState({ loading: false }));
    }
    onCancelJourney = (item) => {

    }
    renderAccepted = (item) => {
        return (
            <AcceptedOverView
                pool={item}
                onDropOff={() => this.onDropOff(item)}
                onPickUp={() => this.onPickUp(item)}
                onCancel={() => this.onCancelJourney(item)}
            />
        );
    }

    renderPending = (item) => {
        return (
            <PendingOverView
                pool={item}
                onAccept={() => this.onAccept(item)}
                onDecline={() => this.onDecline(item)}
            />
        );
    }
    renderHeader = (title) => {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: DARK }}>
                <Heading style={{ color: 'lightgrey' }}> {title} </Heading>
                <Icon style={{ color: 'white' }} name='down-arrow' />
            </View>
        );
    }
    generateSections = () => {
        const { pending } = this.props.poolRequests;
        const sections = [];
        // if (accepted.length > 0) {
        //     sections.push({
        //         title: 'Accepted',
        //         data: accepted,
        //         renderItem: ({ item }) => this.renderAccepted(item),
        //         });
        // }
        if (pending.length > 0) {
            sections.push({
                title: 'Pending',
                data: pending,
                renderItem: ({ item }) => this.renderPending(item),
                });
        }
        return sections;
    }
    renderEmptyList = () => {
        return (
            <Card style={{ width: '90%', padding: 20, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                <Heading> No Pending requests.. </Heading>
                <Button
                    onPress={this.onRefresh}
                >
                    <Text> Refresh </Text>
                    <Icon name='refresh' />
                </Button>
            </Card>
        );
    }
    render() {
        if (this.state.loading) {
            return (
            <View style={{ height: '100%', width: '100%' }}>
                <Loading />
            </View>
            );
        } 
        return (
            <SectionList
            ListEmptyComponent={this.renderEmptyList}
            renderSectionHeader={({ section: { title } }) => (
                this.renderHeader(title)
            )}
            sections={this.generateSections()}
            refreshing={this.state.refreshing}    
            keyExtractor={(item, index) => index} 
            onRefresh={this.onRefresh}
            />    
        ); 
  }
}
const styles = StyleSheet.create({
 
    SectionHeaderStyle: {
   
      backgroundColor: '#CDDC39',
      fontSize: 20,
      padding: 5,
      color: '#fff',
    },
   
    SectionListItemStyle: {
   
      fontSize: 15,
      padding: 5,
      color: '#000',
      backgroundColor: '#F5F5F5'
   
    }
   
   
  });
const mapStateToProps = state => {
    return {
        poolRequests: state.driver.poolRequests
    };
};
export default connect(mapStateToProps, actions)(PoolRequests);
