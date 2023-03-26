import "react-native-gesture-handler";
import * as React from "react";
import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

async function logout(navigation) {
  navigation.navigate("LoginPage")
  await AsyncStorage.removeItem("id")
}

export default function BottomHeader() {
  const navigation = useNavigation();

  return (
    <View style={feed.headerBottom}>
      <TouchableOpacity onPress={() => logout(navigation)}>
        <Image source={require("../assets/logout.png")}/>
      </TouchableOpacity>
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
    width: "11%",
  },
});
