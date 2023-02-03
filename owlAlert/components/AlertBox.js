import * as React from "react";
import { StyleSheet, Text, View, Image, Platform } from "react-native";
import AcceptButton from "./AcceptButton";
import ResolvedButton from "./ResolvedButton";

export default function AlertBox({
  removeAlert,
  alertId,
  floorNo,
  CamNo,
  ResNo,
  vImage,
}) {
  postResponse = async (type, user_id, alert_id) => {
    fetch(`http://192.168.1.35:5000/${type}`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        userId: user_id,
        alertId: alert_id,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
        removeAlert(alert_id);
      })
      .catch(function (error) {
        console.log(
          "There has been a problem with your fetch operation: " + error.message
        );
      });
  };

  return (
    <View style={styles.alert}>
      <View style={styles.row1}>
        <View style={styles.data}>
          <Image
            style={styles.alertLogo}
            source={require("../assets/alert-small-icon.png")}
          />
          <Text style={styles.dataStyle}>ID: {alertId}</Text>
          <Text style={styles.dataStyle}>Floor No: {floorNo}</Text>
          <Text style={styles.dataStyle}>Camera No: {CamNo}</Text>
          <Text style={styles.dataStyle}>Responds No:{1}</Text>
        </View>
        <Image style={styles.AlertImage} source={vImage} />
      </View>
      <View style={styles.row2}>
        <ResolvedButton
          onPress={() => {
            removeAlert(alertId);
          }}
        />
        <AcceptButton
          onPress={() => {
            postResponse("accept", 1, alertId);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  alert: {
    backgroundColor: "rgba(249, 182, 82, 0.75)",
    width: Platform.OS === "ios" ? 330 : 300,
    height: Platform.OS === "ios" ? 200 : 150,
    alignSelf: "center",
    marginBottom: 40,
    borderRadius: 10,
    shadowColor: "#171717",
    shadowOffset: { width: -1, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
    justifyContent: "space-evenly",
  },
  row1: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingLeft: 10,
    paddingRight: 10,
  },
  data: {
    alignSelf: "flex-start",
  },
  dataStyle: {
    fontSize: Platform.OS === "ios" ? 16 : 12,
    marginBottom: 3,
    marginTop: 3,
  },
  alertLogo: {},
  AlertImage: {
    alignSelf: "center",
  },
  row2: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
