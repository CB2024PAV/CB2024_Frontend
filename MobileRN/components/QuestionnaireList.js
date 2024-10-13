// components/QuestionnaireList.js
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const QuestionnaireList = ({ question, answer, setAnswer }) => {
  return (
    <View style={styles.questionContainer}>
      <Text style={styles.question}>{question}</Text>
      <TextInput
        style={styles.input}
        value={answer}
        onChangeText={setAnswer}
        placeholder="Enter your answer"
        multiline={true}
        numberOfLines={2} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  questionContainer: {
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
});

export default QuestionnaireList;
