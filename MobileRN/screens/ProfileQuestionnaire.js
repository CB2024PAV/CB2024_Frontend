// components/Questionnaire.js
import React, { useState, useEffect } from 'react';
import { View, Button, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import QuestionnaireList from '../components/QuestionnaireList';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { myConfig } from '../config';

const Questionnaire = () => {

  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [questionsArray, setQuestionsArray] = useState([
    { id: 1, question: "Full Name", answer: "" },
    { id: 2, question: "Date of Birth", answer: "" },
    { id: 3, question: "Gender and Pronouns", answer: "" },
    { id: 4, question: "Medical Diagnosis", answer: "" },
    { id: 5, question: "How does your typical day look like?", answer: "" },
    { id: 6, question: "Details of key Family and friends", answer: "" },
    { id: 7, question: "Activities that provide comfort", answer: "" },
    { id: 8, question: "Any known triggers for stress and anxiety?", answer: "" },
    { id: 9, question: "Any Major life events?", answer: ""},
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    if(isFocused){ 
      fetchAnswers();
    }
    const bootstrapAsync = async () => {
      let token;
      try {
        token = await AsyncStorage.getItem('userToken');
        console.log("userToken: ", userToken)
      } catch (e) {
        console.error('Failed to get user token:', e);
      }
      setUserToken(token);
      // setIsLoading(false);
    };
    bootstrapAsync();
  }, []);


  const fetchAnswers = async () => {
    try {
      const userId = userToken || 'Bob';
      const response = await fetch(`${myConfig.backendApiUrl}/read_qdrant_data?user=${userId}`);
      console.log('fetch answers')
      const result = await response.json();
      // console.log(result.data)
      if (result.success && result.data?.length > 0) {
        setQuestionsArray(prevQuestions => 
          prevQuestions.map(q => {
            const matchingAnswer = result.data.find(a => a[q.id.toString()]);
            return matchingAnswer 
              ? { ...q, answer: matchingAnswer[q.id.toString()].split(':')[1].trim() }
              : q;
          })
        );
      }
    } catch (error) {
      console.error('Error fetching answers:', error);
      Alert.alert('Error', 'Failed to fetch previous answers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }



  const handleInputChange = (text, id) => {
    setQuestionsArray(prevQuestions => 
      prevQuestions.map(q => 
        q.id === id ? { ...q, answer: text } : q
      )
    );
  };

  const handleSubmit = async () => {
    const questionsAnswers = questionsArray.map(q => `${q.question}: ${q.answer}`);
    // const answers = questionsArray.map(q => q.answer);
    const ids = questionsArray.map(q => q.id);

    const payload = {
      questions: questionsAnswers,
      ids: ids,
      user: userToken || 'Bob'
    };
    // console.log("Payload: ", payload)
    try {
      const response = await fetch(`${myConfig.backendApiUrl}/write_qdrant_data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      // console.log(result)
      if (result.success) {
        Alert.alert('Questionnaire Submitted');
        navigation.navigate('MainTabs');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      Alert.alert('Error', 'Failed to submit questionnaire. Please try again.');
    }
  };


  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {questionsArray.map((item) => (
        <QuestionnaireList
          key={item.id}
          question={item.question}
          answer={item.answer}
          setAnswer={(text) => handleInputChange(text, item.id)}
        />
      ))}

      <View style={styles.buttonContainer}>
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  buttonContainer: {
    marginTop: 30,
  },
});

export default Questionnaire;