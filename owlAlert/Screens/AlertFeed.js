// Page Header and Footer
// ScrollView of AlertBox
// No Alert Logo
import "react-native-gesture-handler";
import * as React from "react";
import { StyleSheet, View, SafeAreaView, ScrollView } from "react-native";
import AlertBox from "../components/AlertBox";
import TopHeader from "../components/TopHeader";
import BottomHeader from "../components/BottomHeader";
import NoAlertBox from "../components/NoAlertBox";
export default function Feed() {
  return (
    <View style={styles.main}>
      <TopHeader />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* ALL ALERTS ARE DISPLAYED HERE */}
          <AlertBox alertId={1} vImage={require("../assets/image2.png")} />
          <AlertBox alertId={2} vImage={require("../assets/image1.png")} />
          {/* ALL ALERTS ARE DISPLAYED HERE  */}
        </ScrollView>
      </SafeAreaView>
      <BottomHeader />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "#fff",
  },

  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    backgroundColor: "#fff",
    width: "100%",
    paddingVertical: 30,
    // display: "none",
  },
});
