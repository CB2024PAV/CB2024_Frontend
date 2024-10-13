// navigation/MainStackNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomTabNavigator from './BottomTabNavigator';
import ProfileQuestionnaireScreen from '../screens/ProfileQuestionnaire';
import LoginScreen from '../screens/LoginScreen';
import VideoScreen from '../screens/VideoScreen';

const Stack = createNativeStackNavigator();


const MainStackNavigator = () => {
	const navigation = useNavigation();

	const handleLogout = async () => {
		try {
			await AsyncStorage.removeItem('userToken');
			navigation.navigate('Login');
		} catch (error) {
			console.error('Error removing token:', error);
		}
	};

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('Questionnaire')}>
              <Ionicons name="person-circle-outline" size={30} color="black" />
            </TouchableOpacity>
          ),
          title: 'Patronus',
        }}
      />
      <Stack.Screen 
				name="Questionnaire" 
				component={ProfileQuestionnaireScreen} 
				options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => handleLogout()}>
              <Ionicons name="log-out-outline" size={30} color="black" />
            </TouchableOpacity>
          ),
          title: 'Questionnaire',
        }}
			/>
      <Stack.Screen 
				name="VideoScreen" 
				component={VideoScreen} 
				options={{
          
          title: 'Video Screen',
        }}
			/>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
