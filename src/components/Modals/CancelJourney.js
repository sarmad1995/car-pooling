import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { Heading, Button, Text } from '@shoutem/ui';
import { DARK } from '../../config';
import ProgressBar from './../common/ProgressBar';

class CancelJourney extends React.Component {
    onDone = () => {
         this.props.onDone(this.props.journey);
    }
    renderFetching = () => {
        const { onCancel } = this.props;
        if (this.props.fetching) {
            return (
                <View style={{ width: 100, height: 50 }}>
                    <ProgressBar
                        style={{
                            flex: 1
                        }}
                    />
                </View>
            );
        } return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button
                    onPress={onCancel}
                >
                    <Text> Back </Text>
                </Button>  
                <Button
                    onPress={this.onDone}
                    style={{ marginLeft: 20 }}
                >
                    <Text> Yes </Text>
                </Button>  
                </View>
        ); 
    }
    render() {
        const { visible } = this.props;
        return (
            <Modal
                animationType="fade"
                transparent
                visible={visible}
                onRequestClose={() => { }}
            >
                <View style={styles.container}>
                <View style={styles.subContainer}>
                <View style={styles.header}> 
                    <Heading style={{ color: 'white' }}>Cancel Journey?</Heading>
                </View>

                {this.renderFetching()}
                
                 
                </View> 
                </View>
            </Modal>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        position: 'relative',
        flex: 1,
        justifyContent: 'center',
      },
      subContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        alignItems: 'center',
        alignSelf: 'center',
        position: 'relative'
      },
      header: {
        backgroundColor: DARK,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        padding: 10  
      }
      
});
export default CancelJourney;
