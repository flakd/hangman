import React, {useState} from 'react';
import {hmm, hm_view, mainGameLoop} from './hangman';

const App = () => {
  const [buttonsActive, setButtonsActive] = useState([]);
  const [inputState, setInputState] = useState(true);

  const setupAlphaArray = () => {
    let array = [];
    for (let i = 97; i <= 122; i++) {
      //lowercase ASCII codes
      let letter = String.fromCharCode(i);
      array.push([letter, 50, false]);
    }
    console.log(array); // outputs: {a: 0, b: 0... z: 0}
    return array;
  };
  const setupFullKeyboard = () => {
    const array = setupAlphaArray();
    array.push(['SPACE', 220, false]);
    array.push(['DEL', 120, false]);
    array.push(['ENTER', 180, false]);
    return array;
  };
  const keyboard = setupFullKeyboard();
  const clickHandler = (event) => {
    event.preventDefault();
    let t = event.target;
    let val = t.innerHTML;
    mainGameLoop(val);
    event.target.disabled = true;
  };

  return keyboard.map((element) =>
    element[2] ? (
      <button
        key={element[0]}
        style={{
          width: ' ' + element[1] + 'px',
          margin: '5px',
          paddingLeft: '0px',
          paddingRight: '5px',
          alignItems: 'center',
          alignContent: 'center',
          fontSize: '60px',
        }}
        disabled
      >
        {element[0]}
      </button>
    ) : (
      <button
        style={{
          width: ' ' + element[1] + 'px',
          margin: '5px',
          fontSize: '60px',
        }}
        onClick={clickHandler}
      >
        {element[0]}
      </button>
    )
  );
};

export default App;
