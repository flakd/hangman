import {StatusBar} from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {StyleSheet, View, SafeAreaView} from 'react-native';
import Modal from 'react-native-modal';

import Output from './components/Output';
import {ap, hmm, initGame} from './hangman.ts';
import Utils from './utils.js';
import Msgs from './hangman_messages';
import Keyboard from './components/Keyboard';
import Banner from './components/Banner';
import Heading from './components/Heading';
import Status from './components/Status';
import Prompt from './components/Prompt';
import MyAlert from './components/MyAlert';

export default function App() {
  const [gameState, setGameState] = useState('rhyme');
  const [outputText, setOutputText] = useState('');
  const [statusText, setStatusText] = useState();
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [name, setName] = useState('');

  useEffect(() => {
    setOutputText(Msgs.getOutput(hmm));
  }, [gameState]);
  const changeGameState = (gameState) => {
    setGameState(gameState);
  };
  const onAlertPressOK = () => {
    console.log('OK PRESSED');
    initGame();
    setGameState('rhyme');
    setOutputText(Msgs.getOutput(hmm));
    setGameState('rhyme');
  };
  //wonOrLost = gameState === 'won' ? 'WON' : 'LOST';
  const wonOrLost = gameState === 'won' || gameState === 'lost';
  const guessOrWonOrLost = gameState === 'guess' || wonOrLost;
  const notRhymeNorSyllables =
    gameState !== 'rhyme' && gameState !== 'syllables';
  hmm.numUniqueLetters = Utils.getNumUniqueLetters(hmm.choice);
  hmm.numAnswerWords = Utils.getNumAnswerWords(hmm.choice);
  return (
    <SafeAreaView style={styles.safeContainer}>
      <StatusBar style='auto' />
      <View style={styles.parentContainer}>
        <Banner> {Msgs.getGameGreeting()}</Banner>
        {gameState === 'guess' && (
          <Heading>
            {Msgs.getHeading(
              hmm.choice.length,
              hmm.numUniqueLetters,
              hmm.numAnswerWords,
              hmm.numSyllables
            )}
          </Heading>
        )}
        {guessOrWonOrLost && <Status>{statusText}</Status>}
        {gameState === 'rhyme' && (
          <Prompt
            changeGameState={changeGameState}
            hmm={hmm}
            ap={ap}
            gameState='rhyme'
          />
        )}
        {gameState === 'syllables' && (
          <Prompt
            changeGameState={changeGameState}
            hmm={hmm}
            ap={ap}
            gameState='syllables'
          />
        )}
        {notRhymeNorSyllables && (
          <Output style={styles.output}>{outputText}</Output>
        )}
        {notRhymeNorSyllables && (
          <Keyboard
            onStatusChange={setStatusText}
            onOutputChange={setOutputText}
            onGameStateChange={setGameState}
          />
        )}
        {wonOrLost && (
          <MyAlert
            title={'YOU ' + gameState.toUpperCase() + '!!!'}
            msg={
              "\nThe Answer was '" +
              Utils.toTitleCase(hmm.choice) +
              "'\n\nBut, let's Play Again!!!"
            }
            buttonText='OK'
            onAlertPressOK={() => {
              console.log('OK pressed');
              onAlertPressOK();
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  modalContent: {
    height: 120,
    width: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.7,
    shadowRadius: 5,
    shadowOffset: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    top: 200,
    margin: 0,
  },
  buttonYes: {
    borderRadius: 10,
    padding: 10,
    shadowColor: 'black',
    shadowOpacity: 0.7,
    shadowRadius: 1,
    shadowOffset: 2,
    elevation: 2,
    backgroundColor: 'green',
    margin: 5,
    width: 60,
  },
  buttonNo: {
    borderRadius: 10,
    padding: 10,
    shadowColor: 'black',
    shadowOpacity: 0.7,
    shadowRadius: 1,
    shadowOffset: 2,
    elevation: 2,
    backgroundColor: 'red',
    margin: 5,
    width: 60,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
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
