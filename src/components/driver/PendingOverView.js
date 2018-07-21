import React from 'react';
import { Card } from '@shoutem/ui';
import { Linking, Platform, StyleSheet, View, TouchableOpacity } from 'react-native';
import { LIGHT, DARK } from '../../config';
import OpenSansText from '../common/OpenSansText';
import { Rating, Icon } from '../../../node_modules/react-native-elements';

class PendingOverView extends React.Component {
    render() {
        const { pool } = this.props;
        const { location } = pool;
        const locationObject = JSON.parse(location);
        const coords = locationObject.lat + locationObject.lng;
        return (
            <Card 
                 backgroundColor={LIGHT}
                 style={{ 
                        width: '80%',
                        alignSelf: 'center',
                        borderWidth: 1,
                        borderRadius: 2,
                        borderColor: '#ddd',
                        borderBottomWidth: 0,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.6,
                        shadowRadius: 2,
                        elevation: 6,
                        marginLeft: 0,
                        marginRight: 0,
                        marginTop: 10,
                        marginBottom: 10,

                     }} 
            >
                 <View style={{ padding: 8, width: '100%' }}> 
                    <OpenSansText style={styles.name}>{pool.name}</OpenSansText>
                    {pool.rider_rating && <Rating
                        type='custom'
                        ratingColor={DARK}
                        imageSize={20}
                        readonly
                        startingValue={Number(pool.rider_rating)}
                        style={{ alignSelf: 'center', marginTop: 6 }}
                    />}

                    <OpenSansText style={styles.location}>Location | {JSON.parse(pool.location).place}</OpenSansText>
                    <OpenSansText style={styles.dept}>{pool.department_name}</OpenSansText>
                    <OpenSansText style={styles.cost}>Rs {pool.cost}</OpenSansText>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}> 
                    <OpenSansText style={{ color: DARK }}>{pool.timestamp}</OpenSansText>
                    <TouchableOpacity

                        onPress={() => Linking.openURL(Platform.OS === 'ios' ? `maps://?daddr=${locationObject.lat},${locationObject.lng}` : `google.navigation:q=${locationObject.lat}+${locationObject.lng}`)}
                    >   
                        <OpenSansText style={{ color: 'grey', fontSize: 10, alignSelf: 'center' }}> Open in map </OpenSansText>
                        <Icon style={{ height: 50, width: 50, color: DARK, marginTop: 6 }} color={DARK} name="directions" />
                    </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.footer}>
                <TouchableOpacity onPress={this.props.onDecline}>
                <View style={styles.button}>
                    <OpenSansText style={styles.buttonText}>Reject</OpenSansText>
                    <Icon color='white' name='cancel' />
                </View> 
                </TouchableOpacity>

                <TouchableOpacity onPress={this.props.onAccept}>
                <View style={styles.button}>
                    <OpenSansText style={styles.buttonText}>Accept</OpenSansText>
                    <Icon color='white' name='done' />
                </View> 
                </TouchableOpacity>
                </View>
        </Card>
           
        );
    }
}
const styles = StyleSheet.create({
    name: {
        color: DARK,
        fontSize: 16,
        fontWeight: '700',
        alignSelf: 'center'
    },
    location: {
        color: DARK,
        fontSize: 14,
        fontWeight: '500',
        marginTop: 8,
    },
    dept: {
        color: DARK,
        marginTop: 6
    },
    cost: {
        color: DARK,
        fontWeight: 'bold'
    },
    footer: {
        backgroundColor: DARK,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 8
    },
    button: {
        flexDirection: 'row',
        backgroundColor: DARK,
        margin: 6
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold'
    }
});
export default PendingOverView;
