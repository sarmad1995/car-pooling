import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { DARK } from '../../config';
import OpenSansText from './OpenSansText';

const { width } = Dimensions.get('window');

class Header extends React.Component {
    render() {
        return (
            <View 
            style={{
                width: '100%',
                height: '12%',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <View style={styles.oval} />
              <OpenSansText 
                  style={{
                    position: 'absolute',
                    fontSize: 20,
                    color: 'white',
                    fontWeight: 'bold',
                    elevation: 10
                 }}
              >
                  {this.props.children}
                </OpenSansText>
              </View>
        );
    }
}
const styles = StyleSheet.create({
    oval: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      width: '12%',
      height: '100%',
      borderBottomLeftRadius: width / 2,
      borderBottomRightRadius: width / 2,
      backgroundColor: DARK,
      transform: [
        { scaleX: 8.333 }
      ],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      elevation: 6,
    },
  });

export default Header;
