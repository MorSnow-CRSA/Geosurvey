import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // For Icons
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firestore.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../assets/images/logo.png';

export default function Login({setUser, online}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);

  const storeUser = async (user) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      // Store credentials securely for offline login
      await AsyncStorage.setItem('lastLoginEmail', email);
      await AsyncStorage.setItem('lastLoginPassword', password);
    } catch (error) {
      console.error('Failed to save the user', error);
    }
  };

  const offlineLogin = async () => {
    try {
      const lastEmail = await AsyncStorage.getItem('lastLoginEmail');
      const lastPassword = await AsyncStorage.getItem('lastLoginPassword');
      const lastUser = await AsyncStorage.getItem('user');

      if (email === lastEmail && password === lastPassword && lastUser) {
        setUser(JSON.parse(lastUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Offline login failed:', error);
      return false;
    }
  };

  async function handleLogin() {
    if (!online) {
      // Try offline login
      const success = await offlineLogin();
      if (success) {
        console.log("Logged in offline successfully");
      } else {
        Alert.alert('Login failed', 'No matching offline credentials found');
      }
      return;
    }

    // Online login
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const authenticated = userCredential.user;
      setUser(authenticated);
      storeUser(authenticated);
      console.log("logged in with ", authenticated);
    } catch (error) {
      console.error('Error logging in:', error.message);
      // Try offline login as fallback
      const success = await offlineLogin();
      if (!success) {
        Alert.alert('Login failed', error.message);
      }
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
          inputMode="email"
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
        <Pressable onPress={() => setHidePassword(!hidePassword)}>
          <MaterialIcons
            name={hidePassword ? 'visibility-off' : 'visibility'}
            size={24}
            color="white"
          />
        </Pressable>
      </View>
      
      {/* Forgot Password */}
      <Pressable>
        <Text style={styles.forgotPassword}>Forgot Your Password ?</Text>
      </Pressable>
      
      {/* Login Button */}
      <Pressable style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a3875',
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
    backgroundColor: '#1a3875',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: 'white',
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
