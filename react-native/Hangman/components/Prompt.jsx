import React from 'react';
import {StyleSheet, View} from 'react-native';
import TextFixedWidth from './TextFixedWidth';
import Msgs from '../hangman_messages';
import Rhyme from './Rhyme';
import Syllables from './Syllables';

const Prompt = (props) => {
  return (
    <View style={styles.output}>
      {props.gameState === 'rhyme' && (
        <Rhyme
          style={styles.input_label}
          hmm={props.hmm}
          changeGameState={props.changeGameState}
        />
      )}
      {props.gameState === 'syllables' && (
        <Syllables style={styles.input_label} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  output: {
    borderColor: 'black',
    borderWidth: 2,
    height: 345,
    width: 382,
    border: 'solid black 1px',
    backgroundColor: 'beige',
    paddingLeft: 5,
  },
});

export default Prompt;
