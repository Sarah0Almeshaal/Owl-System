import "react-native-gesture-handler";
import * as React from "react";
import { StyleSheet, View, Image, Text } from "react-native";
// isVisibale not Working!!!!!!!!!!!!!!!!!!!!!1
export default function NoAlertBox() {
  return (
    <View style={noAlertsBox.container}>
      <Image
        style={noAlertsBox.logo}
        source={require("../assets/owlsys-logo.png")}
      />
      <Text style={noAlertsBox.textStart}>No Alerts</Text>
    </View>
  );
}

const noAlertsBox = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    height: "40%",
    marginTop: "50%",
  },
  logo: {
    width: 180,
    height: 180,
    opacity: 0.5,
  },
  textStart: {
    opacity: 0.6,
    fontWeight: "bold",
    fontSize: 35,
    color: "#205295",
    marginTop: 30,
  },
});
