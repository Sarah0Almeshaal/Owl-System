import * as React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";

export default function AcceptButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Image style={styles.icon} source={require("../assets/accept.png")} />
        <Text style={styles.btn}>Accept</Text>
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
    justifyContent: "space-evenly",
    backgroundColor: "#3FC658",
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
