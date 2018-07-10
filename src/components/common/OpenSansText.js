import React from 'react';
import { Text, StyleSheet } from 'react-native';

 class OpenSansText extends React.Component {

  render() {
    return (
      <Text style={[styles.text, this.props.style]}>{this.props.children}</Text>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'OpenSans-Light'
  }
});
export default OpenSansText;
