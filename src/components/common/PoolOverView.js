import React from 'react';
import { Card } from 'react-native-elements';
import { Subtitle, Text, Icon } from '@shoutem/ui';
import { TouchableOpacity, View } from 'react-native';
import { DARK } from '../../config';

class PoolOverView extends React.Component {

    renderIcon = () => {
         this.flag = this.props.item.title.split(' ')[0];
        if (this.flag === 'University') {
            return (
             <Icon style={{ color: 'white' }} name='left-arrow' />
            );  
        } else if (this.flag === 'Location') {
            return (
                <Icon style={{ color: 'white' }} name="right-arrow" />
               ); 
        }
    }
    render() {
        const { name, number, vehicle_name, location: { place } } = this.props.item;
        return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={this.props.onPress}
            >
                 <Card containerStyle={{ backgroundColor: DARK, borderRadius: 5 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                    <View style={{ flexDirection: 'column' }}>
                    <Text style={{ color: 'white', margin: 6, fontFamily: 'OpenSans-Bold', fontWeight: 'bold' }}>{name}</Text>
                    <Text style={{ color: 'white', margin: 6, fontFamily: 'OpenSans-Bold', fontWeight: 'bold' }}>{vehicle_name}</Text>
                        <Text style={{ color: 'white', margin: 6, fontFamily: 'OpenSans-Light' }}>{number}</Text>
                     </View>
                       
                        {this.renderIcon()}
                    </View>
                    <Subtitle style={{ color: 'white', margin: 6, fontFamily: 'OpenSans-Light' }}>{this.flag === 'University' ? `University to ${place}` : `${place} to University`}</Subtitle>
                 </Card>
            </TouchableOpacity>
        );
    }
}

export default PoolOverView;
