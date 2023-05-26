import React from 'react';
import {Alert, Platform} from 'react-native';

const MyAlert = (props) => {
  if (Platform.OS === 'ios') {
    Alert.alert(props.title, props.msg, [
      {text: props.buttonText, onPress: () => props.onAlertPressOK()},
    ]);
  }
  if (Platform.OS === 'android') {
    //TODO: Android Alert
  }
  if (Platform.OS === 'web') {
    alert(props.msg);
    props.onAlertPressOK();
  }
  return <></>;
};

export default MyAlert;
