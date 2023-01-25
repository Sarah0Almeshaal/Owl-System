import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";

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
    width: Platform.OS === "ios" ? 125 : 105,
    height: Platform.OS === "ios" ? 40 : 35,
    padding: Platform.OS === "ios" ? 5 : 3,
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#3FC658",
  },
  btn: {
    alignSelf: "center",
    fontWeight: "bold",
    color: "#fff",
    fontSize: Platform.OS === "ios" ? "20%" : 16,
  },
  icon: {
    alignSelf: "center",
  },
});
