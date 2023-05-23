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
  const [isSyllablesValid, setIsSyllablesValid] = useState(false);
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

  const onChangeText = (input) => {
    if (handlers.isRhymeValid(rhymeInput)) {
      setRhymeInput(input.toLowerCase());
    } else {
      setRhymeInput(input);
    }
  };
  const onSubmitted = (value) => {
    console.log('value.nativeEvent.text: ', value.nativeEvent.text);
    console.log(value.nativeEvent);

    console.log('submitted: input: ', rhymeInput);
    if (handlers.isRhymeValid(rhymeInput)) {
      let response;
      async function getInitialRhymeResponse() {
        response = await ap.getResponse(rhymeInput);
        console.log('response: ', response);
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
    console.log('hmm.mainResponse: ', hmm.mainResponse);
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
              onChangeText={onChangeText}
              onSubmitEditing={(value) => onSubmitted(value)}
              value={rhymeInput.toLowerCase()}
              blurOnSubmit={false}
              ref={inputRhymeRef}
              keyboardType={isSyllables ? 'numeric' : 'default'}
              returnKeyType={isSyllables ? 'done' : 'done'}
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
              onChangeText={onChangeText}
              onSubmitEditing={(value) => onSubmitted(value)}
              value={syllablesInput}
              blurOnSubmit={false}
              ref={inputSyllablesRef}
              keyboardType={isSyllables ? 'numeric' : 'default'}
              returnKeyType={isSyllables ? 'done' : 'done'}
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
