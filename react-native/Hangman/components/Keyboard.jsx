import React, {useState, useEffect} from 'react';
import {StyleSheet, View, SafeAreaView} from 'react-native';
import MyButton from './MyButton';

const Keyboard = () => {
  const [buttonsActive, setButtonsActive] = useState({});
  const [is_a_Disabled, setIs_a_Disabled] = useState(false);
  const [is_b_Disabled, setIs_b_Disabled] = useState(false);
  const [is_c_Disabled, setIs_c_Disabled] = useState(false);
  const [is_d_Disabled, setIs_d_Disabled] = useState(false);
  const [is_e_Disabled, setIs_e_Disabled] = useState(false);
  const [is_f_Disabled, setIs_f_Disabled] = useState(false);
  const [is_g_Disabled, setIs_g_Disabled] = useState(false);
  const [is_h_Disabled, setIs_h_Disabled] = useState(false);
  const [is_i_Disabled, setIs_i_Disabled] = useState(false);
  const [is_j_Disabled, setIs_j_Disabled] = useState(false);
  const [is_k_Disabled, setIs_k_Disabled] = useState(false);
  const [is_l_Disabled, setIs_l_Disabled] = useState(false);
  const [is_m_Disabled, setIs_m_Disabled] = useState(false);
  const [is_n_Disabled, setIs_n_Disabled] = useState(false);
  const [is_o_Disabled, setIs_o_Disabled] = useState(false);
  const [is_p_Disabled, setIs_p_Disabled] = useState(false);
  const [is_q_Disabled, setIs_q_Disabled] = useState(false);
  const [is_r_Disabled, setIs_r_Disabled] = useState(false);
  const [is_s_Disabled, setIs_s_Disabled] = useState(false);
  const [is_t_Disabled, setIs_t_Disabled] = useState(false);
  const [is_u_Disabled, setIs_u_Disabled] = useState(false);
  const [is_v_Disabled, setIs_v_Disabled] = useState(false);
  const [is_w_Disabled, setIs_w_Disabled] = useState(false);
  const [is_x_Disabled, setIs_x_Disabled] = useState(false);
  const [is_y_Disabled, setIs_y_Disabled] = useState(false);
  const [is_z_Disabled, setIs_z_Disabled] = useState(false);

  let keyboardMap = {};

  useEffect(() => {
    const setupAlphaArray = () => {
      let array = {};
      for (let i = 97; i <= 122; i++) {
        //lowercase ASCII codes
        let letter = String.fromCharCode(i);
        //array.push([letter, 50, false]);
        array[letter] = [i, 45, false];
      }
      console.log('log1: ' + array); // outputs: {a: 0, b: 0... z: 0}
      return array;
    };
    const setupFullKeyboard = () => {
      const array = setupAlphaArray();
      array['DEL'] = [null, 96, false];
      array['SPACE'] = [null, 205, false];
      array['ENTER'] = [null, 140, false];
      return array;
    };
    keyboardMap = setupFullKeyboard();
    setButtonsActive(keyboardMap);
  }, []);

  const clickHandler = (keyChar, event) => {
    event.preventDefault();
    if (keyChar === 'a') setIs_a_Disabled(true);
    if (keyChar === 'b') setIs_b_Disabled(true);
    if (keyChar === 'c') setIs_c_Disabled(true);
    if (keyChar === 'd') setIs_d_Disabled(true);
    if (keyChar === 'e') setIs_e_Disabled(true);
    if (keyChar === 'f') setIs_f_Disabled(true);
    if (keyChar === 'g') setIs_g_Disabled(true);
    if (keyChar === 'h') setIs_h_Disabled(true);
    if (keyChar === 'i') setIs_i_Disabled(true);
    if (keyChar === 'j') setIs_j_Disabled(true);
    if (keyChar === 'k') setIs_k_Disabled(true);
    if (keyChar === 'l') setIs_l_Disabled(true);
    if (keyChar === 'm') setIs_m_Disabled(true);
    if (keyChar === 'n') setIs_n_Disabled(true);
    if (keyChar === 'o') setIs_o_Disabled(true);
    if (keyChar === 'p') setIs_p_Disabled(true);
    if (keyChar === 'q') setIs_q_Disabled(true);
    if (keyChar === 'r') setIs_r_Disabled(true);
    if (keyChar === 's') setIs_s_Disabled(true);
    if (keyChar === 't') setIs_t_Disabled(true);
    if (keyChar === 'u') setIs_u_Disabled(true);
    if (keyChar === 'v') setIs_v_Disabled(true);
    if (keyChar === 'w') setIs_w_Disabled(true);
    if (keyChar === 'x') setIs_x_Disabled(true);
    if (keyChar === 'y') setIs_y_Disabled(true);
    if (keyChar === 'z') setIs_z_Disabled(true);

    let kbMap = buttonsActive;
    if (!['SPACE', 'DEL', 'ENTER'].includes(keyChar)) {
      kbMap[keyChar] = [
        buttonsActive[keyChar][0],
        buttonsActive[keyChar][1],
        true,
      ];
    }
    setButtonsActive(kbMap);
    /*     setButtonsActive((buttonsActive) => {
      return {
        ...buttonsActive,
        kbMap,
      };
    }, []); */
    console.log(buttonsActive);
  };

  const keysArray = Object.keys(buttonsActive);
  console.log(keysArray);
  const keysAsJSX = keysArray.map((element) => (
    <MyButton
      key={element}
      id={element}
      title={element}
      width={buttonsActive[element][1]}
      onPress={(event) => clickHandler('' + element + '', event)}
      disabled={buttonsActive[element][2]}
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
