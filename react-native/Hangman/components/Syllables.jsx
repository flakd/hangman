import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import {syllablesHandler} from '../hangman';

const Syllables = (props) => {
  const [syllablesInput, setSyllablesInput] = useState('');
  const hmm = props.hmm;
  const ap = props.ap;

  const onChangeNumber = (input) => {
    setSyllablesInput(input);
  };

  const onSubmitted = (event, text) => {
    console.log('submitted: input: ', syllablesInput);
    syllablesHandler(syllablesInput, hmm);
    console.log(hmm.state);
    props.changeGameState('guess');
  };
  return (
    <View style={props.style}>
      <Text style={styles.prompt}>Num Syllables? </Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeNumber}
        onSubmitEditing={onSubmitted}
        value={syllablesInput}
        placeholder='Enter Number of Syllables'
        keyboardType='numeric'
        returnKeyType={'done'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 34,
    width: 200,
    margin: 0,
    borderWidth: 1,
    padding: 2,
    textAlign: 'left',
    alignSelf: 'flex-start',
    backgroundColor: 'white',
  },
  prompt: {
    alignSelf: 'center',
    justifyContent: 'flex-start',
    textAlign: 'left',
  },
});

export default Syllables;
