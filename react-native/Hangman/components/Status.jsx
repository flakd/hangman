import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import TextFixedWidth from './TextFixedWidth';
import Msgs from '../hangman_messages';

const Status = ({children}) => {
  return (
    <View style={styles.view}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    justifyContent: 'center',
    alignItems: 'center',
    //borderColor: 'black',
    //borderWidth: 2,
    height: 40,
    width: 382,
    border: 'solid black 1px',
    backgroundColor: 'beige',
  },
  text: {
    fontSize: 22,
  },
});

export default Status;
