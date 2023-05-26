import React from 'react';
import {Platform, Text, StyleSheet} from 'react-native';

const TextFixedWidth = ({children}) => {
  //const fontFamily =
  return <Text style={styles.myFont}>{children}</Text>;
};

const styles = StyleSheet.create({
  myFont: {
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 15,
  },
});

export default TextFixedWidth;
