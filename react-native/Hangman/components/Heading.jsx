import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import TextFixedWidth from './TextFixedWidth';
import Msgs from '../hangman_messages';

const Heading = ({children}) => {
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
    height: 50,
    width: 382,
    paddingLeft: 5,
    backgroundColor: 'beige',
  },
  text: {
    fontSize: 14,
  },
});

export default Heading;
