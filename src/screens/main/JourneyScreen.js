import React from 'react';

import { View } from 'react-native';
import { Text, Icon } from '@shoutem/ui';
import { connect } from 'react-redux';

import JourneyList from '../../components/driver/JourneyList';
import { DARK } from '../../config';
import * as actions from '../../actions';

class JourneyScreen extends React.Component {
    static navigationOptions = {
        header: null
    } 
    render() {
        return (
            <View>
                <JourneyList />
            </View>    
        );
    }
}
const mapStateToProps = state => {
    return {
        poolBuddies: state.journeys.poolBuddies
    };
};
export default connect(mapStateToProps, actions)(JourneyScreen);
