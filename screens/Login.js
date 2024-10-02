import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // For Icons
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firestore.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../assets/images/logo.png';

export default function Login({setUser}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  const storeUser = async (user) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Failed to save the user', error);
    }
  };
  async function handleLogin(){
    try{
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const authenticated = userCredential.user;
      setUser(authenticated);
      storeUser(authenticated);
      console.log("logged in with ", authenticated);
    }catch (error) {
      console.error('Error logging in:', error.message);
      Alert.alert('Login failed', error.message);
    }
}

  return (
    <View style={[styles.container, { flex: 1 , height: '100%'}]}>
     <View style={{alignSelf: 'center', width:"300px"}}>
        <Image source={logo} style={{height: '100px', width: '100%'}} />
      </View>
      
      {/* Title */}
      <Text style={styles.title}>Sign in to your Account!</Text>
      
      {/* Email Input */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={24} color="white" />
        <TextInput
          style={styles.input}
          placeholder="user@um6p.ma"
          placeholderTextColor="#fff"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
      </View>
      
      {/* Password Input */}
      <View style={styles.inputContainer}>
        <MaterialIcons name="lock" size={24} color="white" />
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor="#fff"
          secureTextEntry={hidePassword}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
          <MaterialIcons
            name={hidePassword ? 'visibility-off' : 'visibility'}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </View>
      
      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot Your Password ?</Text>
      </TouchableOpacity>
      
      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText} onPress={handleLogin}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B2F77',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: '100vh',
    width: '100%',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    color: 'white',
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4D5398',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    width: '100%',
  },
  input: {
    flex: 1,
    color: 'white',
    paddingLeft: 10,
  },
  forgotPassword: {
    color: '#A5B1FB',
    textDecorationLine: 'underline',
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: '#3B6BB2',
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 30,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
  },
});
