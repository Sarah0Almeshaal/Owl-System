import "react-native-gesture-handler";
import * as React from "react";
import { StyleSheet, Text, View, Platform } from "react-native";

export default function TopHeader() {
  return (
    <View style={feed.headerTop}>
      <Text style={feed.textHeader}>Alerts</Text>
    </View>
  );
}

const feed = StyleSheet.create({
  headerTop: {
    zIndex: 1,
    backgroundColor: "#284389",
    height: "10%",
    alignItems: "center",
    justifyContent: "center",
  },
  textHeader: {
    marginTop: "5%",
    fontSize: 25,
    color: "#fff",
    fontWeight: "bold",
  },
  headerBottom: {
    zIndex: 1,
    height: "8%",
    backgroundColor: "#284389",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: "10%",
  },
});
