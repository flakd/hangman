import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, SafeAreaView} from 'react-native';
import MyButton from './components/MyButton';
import Rhyme from './components/Rhyme';
import Syllables from './components/Syllables';
import Output from './components/Output';
import {AnswerListProvider, HangmanModel, Cat} from './hangman.js';
//import {hm_view} from './hangman.js';
import Msgs from './hangman_messages';
import Keyboard from './components/Keyboard';
import Banner from './components/Banner';
import Heading from './components/Heading';
import Status from './components/Status';
import Prompt from './components/Prompt';

//const ap = new AnswerListProvider();
const feline = new Cat();
let hmm;
function initGame() {
  hmm = new HangmanModel();
  hmm.fullGuess = [];
  hmm.choice = 'thisisatest';
  hmm.guessesRemaining = 6;
  hmm.wrongGuesses = [];
  hmm.mainResponse = null;
  hmm.numSyllables = 3;
  hmm.state = 'rhyme';
  hmm.numAnswerWords = 1;
  hmm.numUniqueLetters = 6;
}
initGame();

export default function App() {
  const [gameState, setGameState] = useState('rhyme');

  const changeGameState = (gameState) => {
    setGameState(gameState);
  };
  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style='auto' />
      <View style={styles.parentContainer}>
        <Banner> {Msgs.getGameGreeting()}</Banner>
        <Heading>
          {Msgs.getHeading(
            hmm.choice.length,
            hmm.numUniqueLetters,
            hmm.numAnswerWords,
            hmm.numSyllables
          )}
        </Heading>
        <Status>Status Messages Appear Here</Status>
        {gameState === 'rhyme' && (
          <Prompt
            gameState={gameState}
            hmm={hmm}
          />
        )}
        {gameState === 'syllables' && (
          <Prompt
            changeGameState={changeGameState}
            hmm={hmm}
          />
        )}
        {gameState !== 'rhyme' && gameState !== 'syllables' && (
          <Output
            message={Msgs.getHangmanDrawing(
              'pWord',
              'msg',
              ['w', 'r', 'ong'],
              'gChoice',
              6,
              3
            )}
          />
        )}
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
    height: 760,
    alignSelf: 'center',
    borderColor: 'black',
    borderWidth: 2,
    justifyContent: 'center',
    //there was something here ??
    backgroundColor: 'red',
    top: 0,
  },
  input_label: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'center',
    borderColor: 'black',
    borderWidth: 1,
    paddingLeft: 5,
    height: 36,
    width: 374,
    border: 'solid black 1px',
    backgroundColor: 'orange',
  },
});
