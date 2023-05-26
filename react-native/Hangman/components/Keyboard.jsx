import React, {useState, useEffect} from 'react';
import {StyleSheet, View, SafeAreaView} from 'react-native';
import MyButton from './MyButton';
import {mainGameLoop} from '../hangman';

const Keyboard = (props) => {
  const [buttonsActive, setButtonsActive] = useState({});

  useEffect(() => {
    const setupAlphaMap = () => {
      let alphaMap = {};
      for (let i = 97; i <= 122; i++) {
        //lowercase ASCII codes
        let letter = String.fromCharCode(i);
        alphaMap[letter] = {
          ascii: i,
          width: 45,
          disabled: false,
        };
      }
      console.log('log1: ' + alphaMap); // outputs: {a: 0, b: 0... z: 0}
      return alphaMap;
    };
    setButtonsActive(setupAlphaMap());
  }, []);

  const clickHandler = (keyChar, event) => {
    event.preventDefault();
    let kbMap = buttonsActive;
    kbMap[keyChar] = {
      ascii: buttonsActive[keyChar].ascii,
      width: buttonsActive[keyChar].width,
      disabled: true,
    };
    setButtonsActive((prevButtonsActive) => kbMap);
    console.log(buttonsActive);
    const result = mainGameLoop(keyChar);
    props.onStatusChange(result.msg);
    props.onOutputChange(result.output);
    props.onGameStateChange(result.gameState);
  };

  const keysArray = Object.keys(buttonsActive);
  console.log(keysArray);
  const keysAsJSX = keysArray.map((element) => (
    <MyButton
      key={element}
      id={element}
      title={element}
      width={buttonsActive[element].width}
      onPress={(event) => clickHandler('' + element + '', event)}
      disabled={buttonsActive[element].disabled}
    />
  ));

  return <View style={styles.keyboard}>{keysAsJSX}</View>;
};

const styles = StyleSheet.create({
  keyboard: {
    borderColor: 'black',
    borderWidth: 1,
    height: 305,
    border: 'solid black 1px',
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    alignContent: 'center',
    justifyContent: 'center',
    margin: 3,
  },
});

export default Keyboard;
