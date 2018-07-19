import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from '@shoutem/ui';
import OpenSansText from './OpenSansText';
import { DARK } from '../../config';

class ActivePoolOverView extends React.Component {
    render() {
        const { department_name, location, name, number, title, vehicle_name } = this.props.pool;
        const place = JSON.parse(location).place;
        const journey = title.replace('Location', place);
        return (
            <Card 
                style={{
                    width: '90%',
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

                    <OpenSansText style={styles.name}>{name}</OpenSansText>
                    <OpenSansText style={styles.vehicle}>{vehicle_name} | {number} </OpenSansText>
                    <OpenSansText style={styles.dept}>Dept | {department_name} </OpenSansText>

                    <View style={styles.footer}>
                        <OpenSansText style={styles.journey}>{journey} </OpenSansText>
                        {this.props.cost && <OpenSansText style={styles.cost}>{this.props.cost} Rs</OpenSansText>}
                    </View>
             </Card>   
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

    },
    journey: {
        padding: 4,
        color: 'white',
        fontWeight: 'bold',
        flex: 2
    },
    dept: {
        marginTop: 6,
        color: DARK,
        fontSize: 15,
        fontWeight: '400',
        padding: 4
    }
});
export { ActivePoolOverView };
