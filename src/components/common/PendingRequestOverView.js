import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Heading, Card, Subtitle, Text } from '@shoutem/ui';

class PendingRequestOverView extends React.Component {
    render() {
        console.log(this.props.pool);
        const { name, vehicle_name, number } = this.props.pool.pool;
        return (
            <View>
                <Card style={{ 
                        width: '90%',
                        alignSelf: 'center',
                        padding: 8,
                        shadowOffset: { width: 2, height: 5 },
                        shadowColor: 'black'
                     }}
                >
                    <Heading style={{ alignSelf: 'center' }}>Pending Request</Heading>
                    <Subtitle>{name}</Subtitle>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                        <Subtitle>{vehicle_name}</Subtitle>
                        <Text>{number}</Text>
                    </View>
                    <TouchableOpacity
                        onPress={this.props.onCancel}
                        style={{
                            marginTop: 8, 
                            alignSelf: 'flex-end',
                            
                        }}
                    >
                        <Text
                            style={{ color: 'red' }}
                        > Cancel </Text>
                    </TouchableOpacity>
                    
                </Card>
            </View>
        );
    }
}
export default PendingRequestOverView;

