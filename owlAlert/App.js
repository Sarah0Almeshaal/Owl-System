import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Feed from "./Screens/AlertFeed";
import HttpExample from "./backend-Page/HttpExample";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* <Stack.Screen name="Alerts" component={Feed} /> */}
        <Stack.Screen name="HttpExample" component={HttpExample} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
