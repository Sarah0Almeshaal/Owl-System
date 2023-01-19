import * as React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";

export default function ResolvedButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.btn}>Resolved</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: "black",
    borderWidth: "2%",
    borderRadius: 3,
    borderWidth: 1.5,
    width: 125,
    height: 40,
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#0785F9",
  },
  btn: {
    alignSelf: "center",
    fontWeight: "bold",
    color: "#fff",
    fontSize: "20%",
  },
  icon: {
    alignSelf: "center",
  },
});
