import React from 'react';
import {Text, View, StyleSheet, Pressable} from 'react-native';

const MyButton = (props) => {
  const {onPress, disabled, test, title = 'Save'} = props;
  const myBtnStyle = disabled ? styles.button_disabled : styles.button;
  const myTxtStyle = disabled ? styles.text_disabled : styles.text;
  return (
    <View>
      <Pressable
        id={props.id}
        style={[myBtnStyle, {width: props.width}]}
        onPress={onPress}
        test={test}
        disabled={props.disabled}
      >
        <Text style={disabled ? styles.text_disabled : styles.text}>
          {title}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
    elevation: 3,
    backgroundColor: 'black',
    margin: 3,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  button_disabled: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
    elevation: 3,
    backgroundColor: 'grey',
    margin: 3,
  },
  text_disabled: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
});

export default MyButton;
