import React from 'react';
import {Text, View} from 'react-native';


const Greeting = props => {
  return (
    <View style={{alignItems: 'center'}}>
      <Text>Hello {props.name}!</Text>
    </View>
  );
};

export default Greeting;