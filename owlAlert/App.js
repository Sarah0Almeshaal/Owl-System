import "react-native-gesture-handler";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useState, useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import Feed from "./Screens/AlertFeed";
import { useNotifications } from "./Hooks/useNotifications";

const Stack = createStackNavigator();

export default function App() {
  const { registerForPushNotificationsAsync, handleNotificationResponse } =
    useNotifications();

  useEffect(() => {
    registerForPushNotificationsAsync();
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: true,
      }),
    });

    const responseListener =
      Notifications.addNotificationResponseReceivedListener(
        handleNotificationResponse
      );

    return () => {
      if (responseListener)
        Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Alerts" component={Feed} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
