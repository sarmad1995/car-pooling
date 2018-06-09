import React from 'react';
import { View } from 'react-native';
import { Heading, Card, Subtitle, Text } from '@shoutem/ui';

class ActivePoolOverView extends React.Component {
    render() {
        const { department_name, gender, location, name, number, title, vehicle_name } = this.props.pool;
        const place = JSON.parse(location).place;
        const journey = title.replace('Location', place);
        return (
            <Card style={{ width: '100%', padding: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}> 
                    <Heading>{name}</Heading>
                    <Subtitle>{gender}</Subtitle>
                </View>
               
                <View style={{ flexDirection: 'row', marginTop: 6 }}> 
                    <Heading>{vehicle_name}</Heading>
                    <Heading>{number} </Heading>
                </View>


                <View style={{ marginTop: 6 }}> 
                    <Subtitle>{department_name}</Subtitle>
                    <Text style={{ marginTop: 6}}>
                        <Subtitle style={{ fontSize: 17 }}>
                            Journey: 
                        </Subtitle> {journey} </Text>
                </View>

             </Card>   
        );
    }
}
export { ActivePoolOverView };
