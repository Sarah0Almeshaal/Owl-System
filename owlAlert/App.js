import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Feed from "./Security Screens/AlertFeed";
import LoginPage from "./Security Screens/Login";
import AlertDetails from "./Admin Screens/AlertDetails";
import MainScreen from "./Admin Screens/MainScreen";
import CameraSC from "./Admin Screens/CameraSC";
import AlertHistorySC from "./Admin Screens/AlertHistorySC";
// import AdminConatiner from "./Admin Screens/AdminContainer";
import { LogBox } from "react-native";

// Ignore all log notifications in development setting:
LogBox.ignoreAllLogs();
console.disableYellowBox = true;

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      >
        <Stack.Screen name="LoginPage" component={LoginPage} />
        <Stack.Screen name="Alerts" component={Feed} />
        {/* <Stack.Screen name="AdminConatiner" component={AdminConatiner} /> */}
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name="AlertHistorySC" component={AlertHistorySC} />
        <Stack.Screen name="AlertDetails" component={AlertDetails} />
        <Stack.Screen name="CameraSC" component={CameraSC} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
