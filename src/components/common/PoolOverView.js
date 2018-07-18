import React from 'react';
import { Subtitle, Text, Icon, Card } from '@shoutem/ui';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { DARK } from '../../config';
import OpenSans from './OpenSansText';
import { Rating } from '../../../node_modules/react-native-elements';

class PoolOverView extends React.Component {

    renderIcon = () => {
         this.flag = this.props.item.title.split(' ')[0];
        if (this.flag === 'University') {
            return (
             <Icon style={{ color: 'white', margin: 4 }} name='home' />
            );  
        } else if (this.flag === 'Location') {
            return (
                <Icon style={{ color: 'white' }} name="right-arrow" />
               ); 
        }
    }
    render() {
        console.log(this.props.item);
        const { name, number, vehicle_name, location: { place }, driver_rating: rating } = this.props.item;
        return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={this.props.onPress}
            >
                <Card 
                 style={{
                    width: '80%',
                    alignSelf: 'center',
                    borderWidth: 1,
                    borderRadius: 2,
                    borderColor: '#ddd',
                    borderBottomWidth: 0,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.8,
                    shadowRadius: 2,
                    elevation: 1,
                    marginLeft: 5,
                    marginRight: 5,
                    marginTop: 10,
                    marginBottom: 10
                  }}
                >
                <View style={{ alignSelf: 'center', width: '100%' }}>
                    <OpenSans style={styles.nameStyle}> {name} </OpenSans>
                    <OpenSans style={[styles.nameStyle, { fontWeight: 'normal', marginBottom: 10 } ]}> {vehicle_name} | {number} </OpenSans>
                    {rating && <Rating
                        type='custom'
                        ratingColor={DARK}
                        imageSize={20}
                        readonly
                        startingValue={Number(rating)}
                        style={{ alignSelf: 'center' }}
                    />}
                    <View style={{ flexDirection: 'row', width: '100%', backgroundColor: DARK, marginTop: 8 }}> 
                    <OpenSans style={{ color: 'white', margin: 6, flex: 2 }}>{this.flag === 'University' ? `University to ${place}` : `${place} to University`}</OpenSans>
                    {this.renderIcon()}
                    </View>
                </View>

                </Card>
                 {/* <Card containerStyle={{ backgroundColor: 'white', borderRadius: 5 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                    <View style={{ flexDirection: 'column' }}>
                    <Text style={{ color: DARK, margin: 6, fontFamily: 'OpenSans-Bold', fontWeight: 'bold' }}>{name}</Text>
                    <Text style={{ color: DARK, margin: 6, fontFamily: 'OpenSans-Bold', fontWeight: 'bold' }}>{vehicle_name}</Text>
                        <Text style={{ color: DARK, margin: 6, fontFamily: 'OpenSans-Light' }}>{number}</Text>
                     </View>
                       
                        {this.renderIcon()}
                    </View>
                 </Card> */}
            </TouchableOpacity>
        );
    }
}
const styles = StyleSheet.create({
    nameStyle: {
        fontSize: 20,
        alignSelf: 'center',
        color: DARK,
        fontWeight: 'bold'
    }
});

export default PoolOverView;
