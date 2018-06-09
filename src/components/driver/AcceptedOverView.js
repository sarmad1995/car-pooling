import React from 'react';
import { Card, Heading, Text, Divider, View,  Subtitle, Caption, Button, Icon, TouchableOpacity } from '@shoutem/ui';
import { Linking, Platform } from 'react-native';
import { LIGHT } from '../../config';

class AcceptedOverView extends React.Component {
    render() {
        const { pool } = this.props;
        const { location } = pool;
        const locationObject = JSON.parse(location);
        const coords = locationObject.lat + locationObject.lng;
        return (
                 <Card 
                 backgroundColor={LIGHT}
                 style={{ backgroundColor: LIGHT, width: '90%', margin: 6, alignSelf: 'center', borderRadius: 5 }} >
                    <View style={{ backgroundColor: LIGHT, borderRadius: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Subtitle style={{ color: 'white' }}>{pool.name}</Subtitle>
                            <Subtitle style={{ color: 'white' }}>{pool.gender}</Subtitle>
                        </View>   
                        <TouchableOpacity
                            style={{ backgroundColor: 'transparent' }}
                        >
                            <Text style={{ color: 'red' }}>Cancel Journey?</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <Text style={{ color: 'white' }}>Location: {JSON.parse(pool.location).place}</Text>
                    <Caption style={{ color: 'white' }}>{pool.department_name}</Caption>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                        <Caption style={{ color: 'white' }}>{pool.timestamp}</Caption>
                        <Button 
                            onPress={() => Linking.openURL(Platform.OS === 'ios' ? `maps://?daddr=${locationObject.lat},${locationObject.lng}` : `google.navigation:q=${locationObject.lat}+${locationObject.lng}`)}
                            styleName="tight clear"
                        >
                        <Icon style={{ height: 50, width: 50, color: 'white' }} name="directions" />
                        </Button>
                    </View>
                    </View>
                 </Card>
           
        );
    }
}
export default AcceptedOverView;
