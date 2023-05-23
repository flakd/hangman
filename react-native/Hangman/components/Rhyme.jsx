import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import {rhymeHandler} from '../hangman';

const Rhyme = (props) => {
  const [rhymeInput, setRhymeInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const hmm = props.hmm;
  const ap = props.ap;

  useEffect(() => {
    if (!rhymeInput && searchTerm === '') return;
    rhymeHandler(rhymeInput, hmm);
    console.log(hmm);
    console.log(hmm.mainResponse);
  }, [rhymeInput]);

  const onChangeText = (input) => {
    let temp = 0;
    setRhymeInput(input);
  };
  const onSubmitted = (event, text) => {
    console.log('submitted: input: ', rhymeInput);
    //rhymeHandler(rhymeInput, hmm);
    let response;
    async function test() {
      response = await ap.getResponse(rhymeInput);
      console.log('response: ', response);
      hmm.mainResponse = response;
    }
    test();
    //console.log(response);
    console.log(hmm.state);
    props.changeGameState('syllables');
  };
  return (
    <View style={props.style}>
      <Text style={styles.prompt}>Enter Rhyme: </Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitted}
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

export default Rhyme;
