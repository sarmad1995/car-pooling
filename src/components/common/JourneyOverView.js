import React from 'react';
import { Card, Heading, Text, Divider, View,  Subtitle, Caption, Button, Icon, TouchableOpacity } from '@shoutem/ui';
import { Linking, Platform } from 'react-native';
import StarRating from 'react-native-star-rating';
import { LIGHT } from '../../config';

class JourneyOverView extends React.Component {
    state = {
        buttonDisabled: true,
        starCount: 1
    }
    onPickUp = () => {
        this.props.onPickUp();
    }
    onDropOff = () => {
        this.props.onDropOff(this.state.starCount);
    }
    onStarRatingPress(rating) {
        this.setState({ buttonDisabled: false });
        this.setState({
          starCount: rating
        });
      }
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
                     disabled={this.state.buttonDisabled}
                     onPress={this.onDropOff}
                >
                    <Text> Drop Off Complete</Text>
                </Button> 
                ); 
        }
    }
    render() {
        const { journey } = this.props;
        const { location, state } = journey;
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
                        {journey.state <= 2 && <TouchableOpacity
                            style={{ backgroundColor: 'transparent' }}
                            onPress={this.props.onCancel}
                        >
                            <Text style={{ color: 'red' }}>Cancel Journey?</Text>
                        </TouchableOpacity>}
                    </View>
                    
                    <Text style={{ color: 'white' }}>Location: {JSON.parse(journey.location).place}</Text>
                    <Caption style={{ color: 'white' }}>{journey.department_name}</Caption>
                    <Text style={{ color: 'white' }}>Cost: {journey.cost} INR</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                        <Caption style={{ color: 'white' }}>{journey.timestamp}</Caption>
                        <Button 
                            onPress={() => Linking.openURL(Platform.OS === 'ios' ? `maps://?daddr=${locationObject.lat},${locationObject.lng}` : `google.navigation:q=${locationObject.lat}+${locationObject.lng}`)}
                            styleName="tight clear"
                        >
                        <Icon style={{ height: 50, width: 50, color: 'white' }} name="directions" />
                        </Button>
                    </View>
                    {state === 2 && <StarRating
                        fullStarColor='white'
                        disabled={false}
                        maxStars={5}
                        rating={this.state.starCount}
                        selectedStar={(rating) => this.onStarRatingPress(rating)}
                    />}
                    {this.renderButton()}  
                    </View>
                 </Card>
           
        );
    }
}
export default JourneyOverView;
