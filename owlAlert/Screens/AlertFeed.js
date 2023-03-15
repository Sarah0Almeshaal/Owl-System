import "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as React from "react";
import { StyleSheet, View, SafeAreaView, Platform, Text } from "react-native";
import { useState, useEffect, useRef } from "react";
import AlertBox from "../components/AlertBox";
import TopHeader from "../components/TopHeader";
import BottomHeader from "../components/BottomHeader";
import NoAlertBox from "../components/NoAlertBox";
import { FlatList } from "react-native-gesture-handler";
import * as TaskManager from "expo-task-manager";
import { addNotificationReceivedListener } from "expo-notifications";

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  ({ data, error, executionInfo }) => {
    console.log("Received a notification in the background!");
    console.log(data);
    // Do something with the notification data
    setAlertList((prevState) => {
      prevState.push(data);
      return [...prevState];
    });
  }
);

const registerBackgroundTaskAsync = async () => {
  try {
    await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
    const registeredTasks = await TaskManager.getRegisteredTasksAsync();
    console.log("Registered tasks:", registeredTasks);
  } catch (e) {
    console.warn(e);
  }
};

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// prevent displaying notofication when app is on foreground
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const { origin } = notification;
    if (origin === "selected") {
      this.setState({ notification: notification });
    }
  },
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export default function Feed() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [alertList, setAlertList] = useState([]);

  const myListEmpty = () => {
    return <NoAlertBox />;
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        let data = notification.request.content.data;
        setAlertList((prevState) => {
          prevState.push(data);
          return [...prevState];
        });
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        setNotification(response.notification);
        let data = response.notification.request.content.data;
        setAlertList((prevState) => {
          prevState.push(data);
          return [...prevState];
        });
      });

    registerBackgroundTaskAsync();

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
      Notifications.unregisterTaskAsync(BACKGROUND_NOTIFICATION_TASK);
    };
  }, []);

  function handleRemove(id) {
    setAlertList((prevState) => {
      return prevState.filter((item) => item.id !== id);
    });
  }
  return (
    <View style={styles.main}>
      <TopHeader />
      <SafeAreaView style={styles.container}>
        <FlatList
          style={styles.scrollView}
          data={Object.values(alertList)}
          ListEmptyComponent={myListEmpty}
          extraData={Object.values(alertList)}
          renderItem={({ item }) => (
            <AlertBox
              removeAlert={(alertList) => handleRemove(alertList)}
              alertId={item.id}
              vImage={require("../assets/image2.png")}
              floorNo={item.floor}
              CamNo={item.cam}
            />
          )}
          keyExtractor={(item) => item.id}
        ></FlatList>
      </SafeAreaView>
      <BottomHeader />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 30,
  },
});
