import React from 'react';
import { View } from 'react-native';
import { Card } from '@shoutem/ui';
import OpenSansText from './OpenSansText';

class ActivePoolOverView extends React.Component {
    render() {
        const { department_name, gender, location, name, number, title, vehicle_name } = this.props.pool;
        const place = JSON.parse(location).place;
        const journey = title.replace('Location', place);
        return (
            <Card style={{ width: '100%', padding: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}> 
                    <OpenSansText>{name}</OpenSansText>
                    <OpenSansText>{gender}</OpenSansText>
                </View>
               
                <View style={{ flexDirection: 'row', marginTop: 6 }}> 
                    <OpenSansText>{vehicle_name}</OpenSansText>
                    <OpenSansText>{number} </OpenSansText>
                </View>

                {this.props.cost && <OpenSansText>Cost: {this.props.cost}</OpenSansText>}
                <View style={{ marginTop: 6 }}> 
                    <OpenSansText>{department_name}</OpenSansText>
                    <OpenSansText style={{ marginTop: 6 }}>
                        <OpenSansText style={{ fontSize: 17 }}>
                            Journey: 
                        </OpenSansText> {journey} </OpenSansText>
                </View>

             </Card>   
        );
    }
}
export { ActivePoolOverView };
