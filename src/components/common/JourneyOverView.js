import React from 'react';
import { Card, Heading, Text, Divider, View,  Subtitle, Caption, Button, Icon, TouchableOpacity } from '@shoutem/ui';
import { Linking, Platform } from 'react-native';
import { LIGHT } from '../../config';

class JourneyOverView extends React.Component {
    renderButton = () => {
        const { journey } = this.props;

        if (journey.state === 1) {
            return (
                <Button
                    onPress={this.props.onPickUp}
                >
                    <Text> Pick up complete </Text>
                </Button>    
            );
        } else if (journey.state === 2) {
                return (
                <Button
                     onPress={this.props.onDropOff}
                >
                    <Text> Drop Off Complete</Text>
                </Button> 
                ); 
        }
    }
    render() {
        const { journey } = this.props;
        const { location } = journey;
        const locationObject = JSON.parse(location);
        const coords = locationObject.lat + locationObject.lng;
        return (
                 <Card 
                 backgroundColor={LIGHT}
                 style={{ backgroundColor: LIGHT, width: '90%', margin: 6, alignSelf: 'center', borderRadius: 5 }} >
                    <View style={{ backgroundColor: LIGHT, borderRadius: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Subtitle style={{ color: 'white' }}>{journey.name}</Subtitle>
                            <Subtitle style={{ color: 'white' }}>{journey.gender}</Subtitle>
                        </View>   
                        <TouchableOpacity
                            style={{ backgroundColor: 'transparent' }}
                        >
                            <Text style={{ color: 'red' }}>Cancel Journey?</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <Text style={{ color: 'white' }}>Location: {JSON.parse(journey.location).place}</Text>
                    <Caption style={{ color: 'white' }}>{journey.department_name}</Caption>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                        <Caption style={{ color: 'white' }}>{journey.timestamp}</Caption>
                        <Button 
                            onPress={() => Linking.openURL(Platform.OS === 'ios' ? `maps://?daddr=${locationObject.lat},${locationObject.lng}` : `google.navigation:q=${locationObject.lat}+${locationObject.lng}`)}
                            styleName="tight clear"
                        >
                        <Icon style={{ height: 50, width: 50, color: 'white' }} name="directions" />
                        </Button>
                    </View>
                    {this.renderButton()}  
                    </View>
                 </Card>
           
        );
    }
}
export default JourneyOverView;
