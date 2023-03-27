import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";

export default function ResolvedButton({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.btn}>Resolve</Text>
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
    justifyContent: "space-around",
    backgroundColor: "#0785F9",
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
