import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import MainScreen from "./MainScreen";
import CameraSC from "./CameraSC";
import AlertHistorySC from "./AlertHistorySC";
import AlertDetails from "./AlertDetails";

const mainPage = "Home";
const camera = "Cameras";
const alertHistory = "Alerts";

const Tab = createBottomTabNavigator();

function MainContainer() {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        initialRouteName={mainPage}
        screenOptions={({ route }) => ({
          headerShown: false,
          gestureEnabled: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === mainPage) {
              iconName = focused ? "home" : "home-outline";
            } else if (rn === camera) {
              iconName = focused ? "cctv" : "cctv";
              return (
                <MaterialCommunityIcons
                  name={iconName}
                  size={size}
                  color={color}
                />
              );
            } else if (rn === alertHistory) {
              iconName = focused ? "history" : "history";
              return (
                <MaterialCommunityIcons
                  name={iconName}
                  size={size}
                  color={color}
                />
              );
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarLabel: ({ focused, color, size }) => {
            return (
              <Text style={{ color: focused ? "white" : color }}>
                {route.name}
              </Text>
            );
          },
          tabBarStyle: {
            backgroundColor: "#284389",
            paddingBottom: 10,
            width: 350,
            borderRadius: 15,
            left: 14,
            bottom: 10,
          },
        })}
      >
        <Tab.Screen name={mainPage} component={MainScreen} />
        <Tab.Screen name={camera} component={CameraSC} />
        <Tab.Screen name={alertHistory} component={AlertHistorySC} />
        <Tab.Screen
          name={"alertDetails"}
          component={AlertDetails}
          options={{
            tabBarButton: () => null,
            tabBarVisible: false,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MainContainer;
