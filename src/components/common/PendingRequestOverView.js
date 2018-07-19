import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Heading, Card, Subtitle, Text } from '@shoutem/ui';
import OpenSansText from './OpenSansText';
import { DARK } from '../../config';

class PendingRequestOverView extends React.Component {
    render() {
        const { name, vehicle_name, number } = this.props.pool.pool;
        return (
            <View>
                <Card 
                    style={{ 
                        width: '90%',
                        alignSelf: 'center',
                        borderWidth: 1,
                        borderRadius: 2,
                        borderColor: '#ddd',
                        borderBottomWidth: 0,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.8,
                        shadowRadius: 2,
                        elevation: 10,
                        marginLeft: 0,
                        marginRight: 0,
                        marginTop: 10,
                        marginBottom: 10
                     }}
                >
                    <OpenSansText style={styles.header}>Pending Request</OpenSansText>
                    <OpenSansText style={styles.name}>{name}</OpenSansText>
                    <OpenSansText style={styles.vehicle}>{vehicle_name} | {number} </OpenSansText>
                    <View style={styles.footer}> 
                    <OpenSansText style={styles.cost}>{this.props.cost} Rs </OpenSansText>
                        <TouchableOpacity
                            onPress={this.props.onCancel}
                            style={{
                                alignSelf: 'flex-end',
                            }}
                        >
                            <OpenSansText
                                style={{ color: 'red', alignSelf: 'center' }}
                            > Cancel Ride? </OpenSansText>
                        </TouchableOpacity>
                    </View>
                    
                </Card>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    header: {
        color: DARK,
        alignSelf: 'center',
        fontSize: 26,
        fontWeight: '500'
    },
    name: {
        marginTop: 10,
        color: DARK,
        alignSelf: 'center',
        fontSize: 20,
        fontWeight: '500'
    },
    vehicle: {
        color: DARK,
        alignSelf: 'center',
        fontSize: 18,
    },
    footer: {
        marginTop: 8,
        flexDirection: 'row',
        width: '100%',
        backgroundColor: DARK,
        padding: 8,
        justifyContent: 'space-between'
    },
    cost: {
        color: 'white',
        fontSize: 20,
        fontWeight: '700',

    }
});
export default PendingRequestOverView;

