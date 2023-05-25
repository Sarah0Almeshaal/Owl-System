import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Feed from "./Security Screens/AlertFeed";
import LoginPage from "./Security Screens/Login";
import AdminConatiner from "./Admin Screens/AdminContainer";
import { LogBox } from "react-native";

// Ignore all log notifications in development environment:
LogBox.ignoreAllLogs();
console.disableYellowBox = true;

const Stack = createStackNavigator();

const App = () => {
  return <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="LoginPage" component={LoginPage} />
      <Stack.Screen name="Alerts" component={Feed} />
      <Stack.Screen name="AdminConatiner" component={AdminConatiner} />
    </Stack.Navigator>
  </NavigationContainer>
};

export default App;