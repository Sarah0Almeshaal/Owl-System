import "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as React from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Platform,
  Text,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import AlertBox from "../components/AlertBox";
import TopHeader from "../components/TopHeader";
import BottomHeader from "../components/BottomHeader";
import NoAlertBox from "../components/NoAlertBox";
import { FlatList } from "react-native-gesture-handler";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
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

// const handleRemoveItem = (e) => {
//   updateList(list.filter((item) => item.id !== id));
// };

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
          prevState.reverse();
          return [...prevState];
        });
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        let data = response.notification.request.content.data;
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

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
