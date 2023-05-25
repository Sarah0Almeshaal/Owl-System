import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import AlertLog from "../Admin Components/AlertLog";
import { NativeBaseProvider } from "native-base";

function AlertHistorySC() {
  const [active, setActive] = useState("AlertLog");
  return (
    <NativeBaseProvider>
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Alert History</Text>
        <View style={styles.line} />
        <View style={styles.box}>
          {active === "AlertLog" && <AlertLog />}
        </View>
      </View>
    </SafeAreaView>
    </NativeBaseProvider>
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
});
