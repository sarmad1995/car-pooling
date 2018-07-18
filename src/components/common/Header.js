import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DARK } from '../../config';
import OpenSansText from './OpenSansText';

class Header extends React.Component {
    render() {
        return (
            <View 
            style={{
                width: '100%',
                height: '16%',
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
                    elevation: 5
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
      width: '16%',
      height: '100%',
      borderBottomLeftRadius: 50,
      borderBottomRightRadius: 50,
      backgroundColor: DARK,
      transform: [
        { scaleX: 6.25 }
      ],
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      elevation: 2,
    },
  });

export default Header;
