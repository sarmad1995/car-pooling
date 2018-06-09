import React from 'react';
import { View, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { TextInput, Button, Text, Icon, Caption, Subtitle } from '@shoutem/ui';

import LottieLoading from '../../components/common/LottieLoading';
import * as actions from '../../actions';
import { DARK } from '../../config';
// import * as actions from './../../actions';

class SignInScreen extends React.Component {

  state = {
    username: '',
    password: '',
    loading: false,
    error: ''
  }

  componentDidMount() {
    
  }
  onFinish = (done, loading, error) => {
    this.setState({ loading, error });
    if (done) { 
      this.props.navigation.navigate('App');
    }
  }
  onSignIn = () => {
    const { username, password } = this.state;
    if (username !== '' && password !== '') {
      this.setState({ loading: true });
      this.props.signIn(username, password, this.onFinish);
    }
  };
  renderLoading = () => {
    if (this.state.loading) {
      return (
        <View style={{ height: '100%', width: '100%' }}>
             <LottieLoading />
        </View>
   
      );
    }
    return (
      <View style={styles.formContainer}>
              {this.renderContent()}
      </View>
    );
  }
  renderContent = () => {
    return (
      <View style={{ width: '90%' }}>
        <TextInput
          style={{ width: '100%', marginBottom: 10, backgroundColor: 'white' }}
          placeholder={'Username'}
          onChangeText={(username) => this.setState({ username })}
        />
        <TextInput
          style={{ width: '100%', marginBottom: 12, backgroundColor: 'white' }}
          placeholder={'Password'}
          secureTextEntry
          onChangeText={(password) => this.setState({ password })}
        />
        <Subtitle style={{ color: 'red', alignSelf: 'center' }}>{this.state.error}</Subtitle>
        <Button 
          onPress={this.onSignIn}
          styleName="dark"
          style={{ width: '100%', 
          backgroundColor: DARK
          }}
        > 
          <Text style={{ color: 'white'}}>Sign In</Text>
        </Button>
      </View>
    );
  }
  render() {
    return (
      <LinearGradient colors={['rgba(39,107,130,1)', 'rgba(49,84,129,1)']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
       <KeyboardAvoidingView behavior='padding' width='100%' alignItems='center'>
       {this.renderLoading()}
        </KeyboardAvoidingView>
      </LinearGradient>
    );
  }
}
const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: 'rgba(250,250,250,.9)',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    padding: 20
  }
});

export default connect(null, actions)(SignInScreen);
