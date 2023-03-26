import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import CameraList from "../Admin Components/CameraList";
function CameraSC() {
  const [active, setActive] = useState("CameraList");
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Cameras</Text>
        <View style={styles.line} />
        <View style={styles.box}>
          <View style={styles.row}>
            <Text style={styles.title}>Cameras List </Text>
            <TouchableOpacity onPress={() => console.log("+Add is Pressed")}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>+ Add</Text>
              </View>
            </TouchableOpacity>
          </View>
          {active === "CameraList" && <CameraList />}
        </View>
      </View>
    </SafeAreaView>
  );
}
export default CameraSC;
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
    width: 320,
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
