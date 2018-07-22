import React from 'react';
import { Button, Text, Icon, } from '@shoutem/ui';
import { View, StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { Card } from 'react-native-elements';
import { DARK } from '../../config';
import OpenSansText from '../common/OpenSansText';


const vacanciesData = [{ value: '1' }, { value: '2' }, { value: '3' }, { value: '4' }];
const poolDetail = {};
class CreateRideForm extends React.Component {

    onPress = () => {
        if (poolDetail.vehicle && poolDetail.vacancies && poolDetail.journeyType) {
            poolDetail.journeyFlag = poolDetail.journeyTypeName.value.split(' ')[0];
            
            console.log(this.props);
            this.props.navigation.navigate('pickLocation', { poolDetail });
            // this.props.onNext(PoolDetail);
        } else {
            this.bounce();
        }
    }
    // On Drop Down Select for creating an object PoolDetails with vechicle, journeyTypeName, JourneyType etc etc....
    onSelect = (flag, index) => {
        if (flag === 'vehicle') {
            poolDetail.vehicle = this.props.driverPoolDetails.vehicles[index].id;
        } else if (flag === 'journeyType') {
            poolDetail.journeyTypeName = this.props.driverPoolDetails.journeys[index];
            poolDetail.journeyType = this.props.driverPoolDetails.journeys[index].id;
        } 
    }
    bounce = () => this.view.swing(800).then(endState => console.log(endState.finished ? 'bounce finished' : 'bounce cancelled'));
    handleViewRef = ref => this.view = ref;
    render() {
        return (
            <View>
                <Card 
                 backgroundColor={'white'}
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
                <OpenSansText style={styles.cardHeading}> Create Ride </OpenSansText>
                <OpenSansText style={styles.cardDetail}> Save upto 70% of your fuel expense </OpenSansText>
            </Card>
            <Animatable.View ref={this.handleViewRef}>
            <Card containerStyle={{ borderRadius: 6 }}> 
            <View style={{ width: '100%' }}> 
                <Dropdown
                    label='Select Vehicle'
                    data={this.props.driverPoolDetails.vehicles}
                    onChangeText={(vehicle, index) => { this.onSelect('vehicle', index); }}
                />
                <Dropdown
                    label='Vacancies'
                    data={vacanciesData}
                    onChangeText={vacancies => poolDetail.vacancies = vacancies}
                />
                <Dropdown
                    label='Journey Type'
                    data={this.props.driverPoolDetails.journeys}
                    onChangeText={(journeyType, index) => { this.onSelect('journeyType', index); }}                 
                />
                <Button    
                     style={{ alignSelf: 'center', borderRadius: 6, width: 150, marginTop: 8 }}
                     onPress={this.onPress}
                >
                
                <Text> Next </Text>
                <Icon name='right-arrow' />
                </Button>
            </View>
                

            </Card>
            </Animatable.View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    cardHeading: {
        color: DARK,
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center'
    },
    cardDetail: {
        alignSelf: 'center',
        color: 'grey'
    }
});
const mapStateToProps = state => {
    return {
        driverPoolDetails: state.driver.driverPoolDetails
    };
};
export default connect(mapStateToProps, null)(CreateRideForm);
