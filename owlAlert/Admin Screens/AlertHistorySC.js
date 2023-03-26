import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import AlertLog from "../Admin Screens/AlertLog";

function AlertHistorySC() {
  const [active, setActive] = useState("AlertLog");
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Alert History</Text>
        <View style={styles.line} />
        <View style={styles.box}>
          <Text style={styles.title}>Alert Log </Text>
          {active === "AlertLog" && <AlertLog />}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default AlertHistorySC;
const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  line: {
    width: 50,
    height: 5,
    borderRadius: "5px",
    backgroundColor: "steelblue",
  },

  pageTitle: {
    textAlign: "left",
    fontSize: 30,
    fontWeight: "bold",
  },
  box: {
    width: 390,
    height: "auto",
    rounding: "round",
    backgroundColor: "snow",
    alignSelf: "center",
    paddingTop: 10,
    marginTop: 50,
    paddingHorizontal: 30,
    borderRadius: "5px",
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 4 },
  },
  title: {
    textAlign: "left",
    fontSize: 20,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: "steelblue",
    marginLeft: 70,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
  },
});
