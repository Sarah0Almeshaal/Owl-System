import "react-native-gesture-handler";
import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Platform,
  Dimensions,
  ScrollView,
} from "react-native";
import AlertBox from "../components/AlertBox";
export default function Feed() {
  return (
    <View style={styles.main}>
      <View style={headersPending.headerTop}>
        <Text
          style={{
            marginTop: "5%",
            fontSize: 25,
            color: "#fff",
            fontWeight: "bold",
          }}
        >
          Alerts
        </Text>
      </View>
      <SafeAreaView style={styles.container}>
        <View style={noAlertsBox.container}>
          <Image
            style={noAlertsBox.logo}
            source={require("../assets/owlsys-logo.png")}
          />
          <Text style={noAlertsBox.textStart}>No Alerts</Text>
        </View>
        <ScrollView style={styles.scrollView}>
          <AlertBox alertId={1} vImage={require("../assets/image2.png")} />
          <AlertBox alertId={2} vImage={require("../assets/image1.png")} />
        </ScrollView>
      </SafeAreaView>
      <View style={headersPending.headerBottom}>
        <Image
          style={headersPending.logo}
          source={require("../assets/logout.png")}
        />
      </View>
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

const headersPending = StyleSheet.create({
  headerTop: {
    zIndex: 1,
    backgroundColor: "#284389",
    height: "10%",
    alignItems: "center",
    justifyContent: "center",
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

const noAlertsBox = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
    height: "40%",
    display: "none",
  },
  logo: {
    width: 180,
    height: 180,
    opacity: 0.5,
  },
  textStart: {
    opacity: 0.6,
    fontWeight: "bold",
    fontSize: 35,
    color: "#205295",
    marginTop: 30,
  },
});
