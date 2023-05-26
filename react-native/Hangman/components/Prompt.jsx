import React, {useState, useRef, useEffect} from 'react';
import {StyleSheet, Text, View, TextInput, Modal} from 'react-native';
import {handlers} from '../hangman';
import TextFixedWidth from './TextFixedWidth';
import Msgs from '../hangman_messages';

const Prompt = (props) => {
  const [modalVisible, setModalVisible] = useState(true);

  const [rhymeInput, setRhymeInput] = useState('');
  const [syllablesInput, setSyllablesInput] = useState('');

  const [isSyllables, setIsSyllables] = useState(false);

  const [isRhymeValid, setIsRhymeValid] = useState(true);
  const [isSyllablesValid, setIsSyllablesValid] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const hmm = props.hmm;
  const ap = props.ap;

  const inputRhymeRef = useRef(null);
  const inputSyllablesRef = useRef(null);

  useEffect(() => {
    if (inputRhymeRef && inputRhymeRef.current && inputRhymeRef.current.focus) {
      inputRhymeRef.current.focus();
    } else {
      if (
        inputSyllablesRef &&
        inputSyllablesRef.current &&
        inputSyllablesRef.current.focus
      ) {
        inputSyllablesRef.current.focus();
      } else {
        return;
      }
    }
  }, []);

  const onChangeTextRhyme = (input) => {
    setRhymeInput(input);
    if (handlers.isRhymeValid(input)) {
      setRhymeInput(input.toLowerCase());
    }
  };
  const onChangeTextSyllables = (input) => {
    setSyllablesInput(input);
  };
  const onSubmittedRhyme = (value) => {
    console.log(
      'onSubmittedRhyme: value.nativeEvent.text: ',
      value.nativeEvent.text
    );
    console.log('onSubmittedRhyme: value.nativeEvent: ', value.nativeEvent);

    console.log('submitted: input: ', rhymeInput);
    if (handlers.isRhymeValid(rhymeInput)) {
      let response;
      async function getInitialRhymeResponse() {
        response = await ap.getResponse(rhymeInput);
        //console.log('response: ', response);
        hmm.mainResponse = response;
      }
      getInitialRhymeResponse();
      setIsRhymeValid(true);
      props.changeGameState('syllables');
      setIsSyllables(true);
      //inputSyllablesRef.current.focus();
    } else {
      setIsRhymeValid(false);
      setRhymeInput('');
    }
    //console.log('hmm.mainResponse: ', hmm.mainResponse);
    console.log('hmm.state: ', hmm.state);
    return;
  };
  const onSubmittedSyllables = (value) => {
    console.log(
      'onSubmittedSyllables: value.nativeEvent.text: ',
      value.nativeEvent.text
    );
    console.log('onSubmittedSyllables: value.nativeEvent: ', value.nativeEvent);
    console.log('submitted: input: ', syllablesInput);
    if (handlers.isSyllablesValid(syllablesInput)) {
      let response;
      setIsSyllablesValid(true);
      props.changeGameState('guess');
      setIsSyllables(true);
      //inputSyllablesRef.current.focus();
    } else {
      setIsSyllablesValid(false);
      setSyllablesInput('');
    }
    //console.log('hmm.mainResponse: ', hmm.mainResponse);
    console.log('hmm.state: ', hmm.state);
    return;
  };
  return (
    <View style={styles.output}>
      {props.gameState === 'rhyme' && (
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Enter Rhyme:</Text>
            <TextInput
              style={styles.input}
              onChangeText={onChangeTextRhyme}
              onSubmitEditing={onSubmittedRhyme}
              value={rhymeInput.toLowerCase()}
              blurOnSubmit={false}
              ref={inputRhymeRef}
              keyboardType='default'
              returnKeyType='done'
            />
            {!isRhymeValid && (
              <Text style={{color: 'red'}}>
                Can NOT include numbers or special characters
              </Text>
            )}
          </View>
        </View>
      )}
      {props.gameState === 'syllables' && (
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Num Syllables? </Text>
            <TextInput
              placeholder='Enter Number of Syllables'
              style={styles.input}
              onChangeText={onChangeTextSyllables}
              onSubmitEditing={onSubmittedSyllables}
              value={syllablesInput}
              blurOnSubmit={false}
              ref={inputSyllablesRef}
              keyboardType='numeric'
              returnKeyType='done'
            />
            {!isSyllablesValid ? (
              <Text style={{color: 'red'}}>
                INVALID: Can ONLY include numbers
              </Text>
            ) : null}
          </View>
        </View>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 150,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default Prompt;
