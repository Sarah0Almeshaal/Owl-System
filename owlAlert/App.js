import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Feed from "./Screens/AlertFeed";
import LoginPage from "./Screens/Login";
import back from "./Screens/back";
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Alerts" component={Feed} />
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="back" component={back} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
