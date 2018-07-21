import React from 'react';
import { View, KeyboardAvoidingView, Linking } from 'react-native';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

import { TextInput, Button, TouchableOpacity } from '@shoutem/ui';

import LottieLoading from '../../components/common/LottieLoading';
import * as actions from '../../actions';
import { DARK, WARNING, URL } from '../../config';
import OpenSansText from '../../components/common/OpenSansText';
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
  } else {
    this.setState({ error: 'Please enter credentials ' });
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
    <OpenSansText style={{ textAlign: 'center', fontSize: 27, color: DARK, fontWeight: '500', marginBottom: 20, alignSelf: 'center' }}>
      iCar Connect {'\n'}
      <OpenSansText style={{ textAlign: 'center', fontSize: 13, color: '#9e9de0', fontFamily: 'OpenSans-Italic' }}>
          carpooling service for {'\n'} islamic university
        </OpenSansText>
      </OpenSansText>

      <TextInput
        style={{ width: '100%', marginBottom: 10, borderRadius: 4, fontFamily: 'OpenSans-Light', backgroundColor: 'white' }}
        placeholder={'registered mobile number'}
        autoComplete={false}
        onChangeText={(username) => this.setState({ username, error: '' })}
      />
      <TextInput
        style={{ width: '100%', marginBottom: 10, borderRadius: 4, fontFamily: 'OpenSans-Light', backgroundColor: 'white' }}
        placeholder={'iconnect password'}
        secureTextEntry
        onChangeText={(password) => this.setState({ password, error: '' })}
      />
       <TouchableOpacity onPress={() => Linking.openURL(URL)} >
      <OpenSansText style={{ color: DARK, fontSize: 15, fontWeight: 'bold', marginBottom: 6, alignSelf: 'center' }}>
        Forgot password?
        </OpenSansText>
        </TouchableOpacity>
      {/* change width smoothly */}
      {this.state.error !== '' && <OpenSansText style={{ backgroundColor: WARNING, padding: 6, borderRadius: 6, margin: 10, fontWeight: 'bold', color: 'white', alignSelf: 'center' }}>{this.state.error}</OpenSansText>}
      <Button 
        onPress={this.onSignIn}
        styleName="dark"
        style={{ width: '80%',
        padding: 7,
        alignSelf: 'center',
        borderWidth: 0,
        backgroundColor: DARK
        }}
      > 
        <OpenSansText 
        style={{ color: 'white',
        fontWeight: 'bold',
        fontSize: 16, }}
        >Log In</OpenSansText>
      </Button>
      <TouchableOpacity onPress={() => Linking.openURL(URL)} >
      <OpenSansText style={{ color: DARK, fontSize: 13, textAlign: 'center', fontWeight: 'bold', alignSelf: 'center', marginTop: 20 }}>
        Don't have an account yet? {'\n'} Sign up now!
        </OpenSansText>
        </TouchableOpacity>
    </View>
  );
}
render() {
  return (
    <LinearGradient colors={['rgba(177,175,255,1)', 'rgba(158,157,235,1)']} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <KeyboardAvoidingView behavior='padding' width='100%' alignItems='center'>
      {this.renderLoading()}
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
}
const styles = {
formContainer: {
  backgroundColor: 'rgba(250,250,250,.6)',
  width: '80%',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 6,
  padding: 20
}, 
inputBox: {
  width: '100%', borderRadius: 4, fontFamily: 'OpenSans-Light', marginBottom: 12, backgroundColor: 'white' 
},
italic: {
  height: 10
}
};

export default connect(null, actions)(SignInScreen);
