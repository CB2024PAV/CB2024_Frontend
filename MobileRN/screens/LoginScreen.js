import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { myConfig } from '../config'

const LoginScreen = () => {
  const navigation = useNavigation();
  const [user, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (user.trim() && password.trim()) {
      try {
        // console.log(`${myConfig.backendApiUrl}/login`)
        const response = await fetch(`${myConfig.backendApiUrl}/login`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({usr: user, pass: password}).toString(),
        });
        const data = await response.json();

        if (data.success) {
            Alert.alert('Success', data.message);
            await AsyncStorage.setItem('userToken', user);
            navigation.replace('MainTabs');
        } else {
            Alert.alert('Failure', 'Wrong Username or Password');
        }
        
      } catch (error) {
        console.error('Error saving token:', error);
      }
    } else {
      console.error('Error:');
      Alert.alert('Error', 'Please enter username and password');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/robot.png')}
          style={styles.logo}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="User Name"
        value={user}
        onChangeText={setUserName}
        keyboardType="user"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    height: 50,
    borderColor: '#4287f5',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#4287f5',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default LoginScreen;