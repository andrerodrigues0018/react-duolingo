import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const QuestionGenerator = () => {
  const [theme, setTheme] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [points, setPoints] = useState(0);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('https://6fa0e1d3-cloudflare-works.andre-rodrigues0018.workers.dev/openai/duolingo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ theme })
      });
      const data = await response.json();
      const formattedData = data.map(question => ({
        ...question,
        question: question.question.replace('X', '___')
      }));
      setQuestions(formattedData);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const handleOptionSelect = (questionIndex, option) => {
    if (selectedOptions[questionIndex] !== undefined) {
      return; // Não permite trocar a resposta após errar
    }

    const correctOptionIndex = questions[questionIndex].correct;
    const correctOption = questions[questionIndex].options[correctOptionIndex];

    setSelectedOptions({
      ...selectedOptions,
      [questionIndex]: option
    });

    if (option === correctOption) {
      setPoints(points + 10);
    } else {
      const updatedQuestions = questions.map((question, index) => {
        if (index === questionIndex) {
          return {
            ...question,
            question: question.question.replace('___', correctOption)
          };
        }
        return question;
      });
      setQuestions(updatedQuestions);
    }
  };

  const getOptionColor = (questionIndex, option) => {
    const correctOptionIndex = questions[questionIndex].correct;
    const correctOption = questions[questionIndex].options[correctOptionIndex];
    return selectedOptions[questionIndex] === option
      ? option === correctOption
        ? 'green'
        : 'red'
      : 'black';
  };

  const getQuestionColor = (questionIndex) => {
    const correctOptionIndex = questions[questionIndex].correct;
    const correctOption = questions[questionIndex].options[correctOptionIndex];
    const selectedOption = selectedOptions[questionIndex];
    if (!selectedOption) return 'black';
    return selectedOption === correctOption ? 'green' : 'red';
  };

  const resetQuiz = () => {
    setQuestions([]);
    setSelectedOptions({});
    setPoints(0);
  };

  const maxPoints = questions.length * 10;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Digite o tema da sessão"
        value={theme}
        onChangeText={setTheme}
      />
      <Button title="Buscar Questões" onPress={() => { resetQuiz(); fetchQuestions(); }} />
      <Text style={styles.points}>Points: {points}/{maxPoints}</Text>
      <ScrollView style={styles.scrollView}>
        {questions.length > 0 && questions.map((q, index) => (
          <View key={index} style={styles.questionContainer}>
            <Text style={[styles.questionText, { color: getQuestionColor(index) }]}>
              {q.question.replace(`(${index})`, selectedOptions[index] || '____')}
            </Text>
            <View style={styles.optionsContainer}>
              {q.options.map((option, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.optionButton}
                  onPress={() => handleOptionSelect(index, option)}
                >
                  <Text style={[styles.optionText, { color: getOptionColor(index, option) }]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    marginTop: 25,
    paddingHorizontal: 10,
    width: '100%'
  },
  scrollView: {
    width: '100%'
  },
  questionContainer: {
    marginBottom: 20,
    width: '100%'
  },
  questionText: {
    fontSize: 16,
    marginBottom: 10
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  optionButton: {
    backgroundColor: 'transparent',
    borderWidth:1,
    borderColor: '#007BFF',
    borderStyle: 'solid',
    padding: 10,
    margin: 5,
    borderRadius: 5
  },
  optionText: {
    color: '#fff'
  },
  points: {
    position: 'absolute',
    top: 20,
    right: 10,
    fontSize: 18,
    fontWeight: 'bold'
  }
});

export default QuestionGenerator;