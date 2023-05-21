import React, {useState} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';

const Rhyme = (props) => {
  const [rhymeInput, setRhymeInput] = useState('');

  const onChangeText = (input) => {
    let temp = 0;
    setRhymeInput(input);
    //alert(input);
    if (input.includes('\n')) alert('we hit enter');
  };
  const onSubmitted = (event, text) => {
    console.log('submitted: input: ', rhymeInput);
    //setRhymeInput('');
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
  },
  prompt: {
    alignSelf: 'center',
    justifyContent: 'flex-start',
    textAlign: 'left',
  },
});

export default Rhyme;
