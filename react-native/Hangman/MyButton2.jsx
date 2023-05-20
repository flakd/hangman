import React from 'react';
import {TouchableHighlight, View, Text, StyleSheet} from 'react-native';

export default function MyButton2() {
  var [isPress, setIsPress] = React.useState(false);

  var touchProps = {
    activeOpacity: 1,
    underlayColor: 'blue', // <-- "backgroundColor" will be always overwritten by "underlayColor"
    style: isPress ? styles.btnPress : styles.btnNormal, // <-- but you can still apply other style changes
    onHideUnderlay: () => setIsPress(false),
    onShowUnderlay: () => setIsPress(true),
    onPress: () => console.log('HELLO'), // <-- "onPress" is apparently required
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight {...touchProps}>
        <Text>Click here</Text>
      </TouchableHighlight>
    </View>
  );
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 18,
  },
  btnNormal: {
    borderColor: 'blue',
    borderWidth: 1,
    borderRadius: 10,
    color: 'blue',
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    margin: 5,
  },
  btnPress: {
    borderColor: 'blue',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 100,
  },
});
