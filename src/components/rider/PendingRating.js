import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Heading, Card, Subtitle, Text, Caption, Button } from '@shoutem/ui';
import StarRating from 'react-native-star-rating';

import { DARK } from '../../config';

class PendingRating extends React.Component {
    state = {
        starCount: 3.5,
        buttonHidden: true
    }
    onStarRatingPress = (rating) => {
        this.setState({ buttonHidden: false });
        this.setState({ starCount: rating });
    }
    onDone = () => {
        this.props.onDone(this.state.starCount);
    }
    render() {
        const { department_name, driver, end_time, journeyTime, number, start_time, vehicle_name } = this.props.lastJourney;
        return (
            <View>
                <Card 
                    style={{ 
                        width: '90%',
                        alignSelf: 'center', 
                        marginTop: 8, 
                        padding: 8,
                        borderRadius: 6,
                        backgroundColor: DARK 
                    }}
                >
                    <View>
                        <Heading style={{ color: 'white' }}>{driver}</Heading>
                        <Subtitle style={{ color: 'white' }}>{vehicle_name}</Subtitle>
                    </View>
                    <View style={{ marginTop: 6 }}>
                        <Text style={{ color: 'white' }}>{department_name}</Text>
                        <Caption style={{ color: 'white' }}>Start Time: {start_time} </Caption>
                        <Caption style={{ color: 'white' }}>End Time: {end_time} </Caption>
                    </View>
                     <StarRating
                        fullStarColor='white'
                        disabled={false}
                        maxStars={5}
                        rating={this.state.starCount}
                        selectedStar={(rating) => this.onStarRatingPress(rating)}
                     />
                    {!this.state.buttonHidden && <Button 
                        style={{ width: '100%', marginTop: 6 }}
                        onPress={this.onDone}
                    >
                        <Text> Done </Text>
                    </Button>
                    }
                </Card>
            </View>
         );
    }
}
export default PendingRating;
