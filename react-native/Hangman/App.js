import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, SafeAreaView} from 'react-native';
import MyButton from './components/MyButton';
import Rhyme from './components/Rhyme';
import Syllables from './components/Syllables';
import Output from './components/Output';
import {ap, hmm} from './hangman.js';
//import {hm_view} from './hangman.js';
import Msgs from './hangman_messages';
import Keyboard from './components/Keyboard';

export default function App() {
  const [gameState, setGameState] = useState('rhyme');

  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style='auto' />
      <View style={styles.parentContainer}>
        <Output>
          {'\n'}
          {Msgs.getHangmanDrawing(
            'pWord',
            'msg',
            ['w', 'r', 'ong'],
            'gChoice',
            6,
            3
          )}
        </Output>
        {gameState === 'rhyme' && <Rhyme style={styles.input_label} />}
        {gameState === 'syllables' && <Syllables style={styles.input_label} />}
        <Keyboard />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  parentContainer: {
    width: 386,
    height: 730,
    alignSelf: 'center',
    borderColor: 'black',
    borderWidth: 2,
    justifyContent: 'center',
    //there was something here ??
    backgroundColor: 'red',
    top: 0,
  },
  output: {
    borderColor: 'black',
    borderWidth: 2,
    height: 410,
    width: 382,
    border: 'solid black 1px',
    backgroundColor: 'beige',
  },
  input_label: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'center',
    borderColor: 'black',
    borderWidth: 1,
    paddingLeft: 5,
    height: 35,
    width: 360,
    border: 'solid black 1px',
    backgroundColor: 'orange',
  },
});
