import React from 'react';
import {Platform, Text} from 'react-native';

const TextFixedWidth = ({children}) => {
  const fontFamily = Platform.OS === 'ios' ? 'Courier New' : 'monospace';
  return <Text style={{fontFamily}}>{children}</Text>;
};

export default TextFixedWidth;
