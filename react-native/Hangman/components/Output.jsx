import React from 'react';
import {StyleSheet, View} from 'react-native';
import TextFixedWidth from './TextFixedWidth';
import Msgs from '../hangman_messages';

const Output = ({children}) => {
  return (
    <View style={styles.output}>
      <TextFixedWidth>{children}</TextFixedWidth>
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

export default Output;
