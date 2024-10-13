// components/Questionnaire.js
import React, { useState } from 'react';
import { View, Button, ScrollView, StyleSheet, Alert } from 'react-native';
import QuestionnaireList from '../components/QuestionnaireList';

const questionsArray = [
  { id: 1, question: "What is your name?" },
  { id: 2, question: "How old are you?" },
  { id: 3, question: "What is your favorite color?" },
  { id: 4, question: "Where do you live?" },
  { id: 5, question: "What are your hobbies?" },
  { id: 6, question: "What is your profession?" },
];

const Questionnaire = () => {
  const [answers, setAnswers] = useState({
    question1: '',
    question2: '',
    question3: '',
    question4: '',
    question5: '',
    question6: ''
  });

  const handleInputChange = (text, key) => {
    setAnswers({ ...answers, [key]: text });
  };

  const handleSubmit = () => {
    console.log(answers)
    Alert.alert('Question Submitted');
    // Send the answers to an API or save them here
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {questionsArray.map((item, index) => (
        <QuestionnaireList
          key={item.id}
          question={item.question}
          answer={answers[`question${item.id}`]}
          setAnswer={(text) => handleInputChange(text, `question${item.id}`)}
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
