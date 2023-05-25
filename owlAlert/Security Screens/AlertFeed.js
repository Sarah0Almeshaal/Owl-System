import "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import * as React from "react";
import { StyleSheet, View, SafeAreaView, Platform } from "react-native";
import { useState, useEffect, useRef } from "react";
import AlertBox from "../Security Components/AlertBox";
import TopHeader from "../Security Components/TopHeader";
import BottomHeader from "../Security Components/BottomHeader";
import NoAlertBox from "../Security Components/NoAlertBox";
import { FlatList } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

async function checkSession(navigation) {
  try {
    if (
      (await AsyncStorage.getItem("id")) === null ||
      (await AsyncStorage.getItem("userType")) === '"Admin"'
    ) {
      navigation.navigate("LoginPage");
    }
  } catch (error) {}
}

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

let userId;
getData = async () => {
  try {
    const value = await AsyncStorage.getItem("id");
    if (value !== null) {
      userId = JSON.parse(value);
    }
  } catch (e) {
    console.log(e);
  }
};
export default function Feed() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const [alertsObject, setAlertsObject] = useState();
  const [resolvedAlerts, setResolvedAlerts] = useState([]);
  const notificationListener = useRef();
  const responseListener = useRef();
  const navigation = useNavigation();
  checkSession(navigation);
  getData();
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token),
    );
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        setNotification(response.notification);
      });

    const interval = setInterval(() => {
      fetchAlerts();
    }, 5000);
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
      clearInterval(interval);
    };
  }, [alertsObject]);

  fetchAlerts = async () => {
    fetch(
      global.ipFlask +
        "/getAlerts",
      {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
        }),
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        var jsonObj = JSON.parse(data["alertList"]);
        let result = Object.values(jsonObj).filter(
          (item) => !resolvedAlerts.includes(item.alertId)
        );
        setAlertsObject(result);
      })
      .catch(function (error) {
        console.log(
          "There has been a problem with your fetch operation: " + error.message
        );
      });
  };

  function handleRemove(id) {
    setAlertsObject((prevState) => {
      // add alertId to list to be used later in filter for rendering
      // to not show specific alerts in Feed
      setResolvedAlerts((oldArray) => [...oldArray, id]);
      return prevState.filter((item) => item.alertId !== id);
    });
  }

  return (
    <View style={styles.main}>
      <TopHeader />
      <SafeAreaView style={styles.container}>
        <NoAlertBox />
        <FlatList
          style={styles.scrollView}
          data={alertsObject}
          extraData={alertsObject}
          renderItem={({ item }) => (
            <AlertBox
              removeAlert={(alertsObject) => handleRemove(alertsObject)}
              alertId={item.alertId}
              vImage={item.alertImage}
              floorNo={item.floor}
              CamNo={item.camId}
              ResNo={item.respondents}
              userId={userId}
            />
          )}
          keyExtractor={(item) => item.alertId}
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
