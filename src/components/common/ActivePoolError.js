import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Heading, Card, Subtitle, Text } from '@shoutem/ui';
import { Icon } from 'react-native-elements';
import OpenSansText from './OpenSansText';
import { DARK } from '../../config';

class ActivePoolError extends React.Component {
    render() {
        const { error, onRefresh } = this.props;
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
                        elevation: 6,
                        marginLeft: 0,
                        marginRight: 0,
                        marginTop: 10,
                        marginBottom: 10,
                     }}
                >
                    <OpenSansText style={styles.header}>{error}</OpenSansText>
                    <View style={styles.footer}> 
                        <TouchableOpacity
                            onPress={onRefresh}
                        >
                            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <OpenSansText
                                style={{ color: 'white', alignSelf: 'center', fontWeight: 'bold' }}
                            > Try again? </OpenSansText>
                            <Icon name='refresh' color='white'/> 
                            </View>
                            
                            
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
        fontSize: 18,
        fontWeight: '500',
        padding: 8
    },
    footer: {
        alignItems: 'center',
        marginTop: 8,
        width: '100%',
        backgroundColor: DARK,
        padding: 8,
    },
});
export default ActivePoolError;

