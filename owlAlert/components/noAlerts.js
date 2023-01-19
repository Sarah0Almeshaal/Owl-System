import * as React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

export default function NoAlerts() {
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
    // display: "none",
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
