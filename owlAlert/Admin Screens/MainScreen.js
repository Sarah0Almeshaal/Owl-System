import { React, useState, useEffect } from "react";
import {
  NativeBaseProvider,
  Heading,
  HStack,
  VStack,
  Box,
  Image,
  Text,
  Button,
  Center,
} from "native-base";
import { TouchableOpacity, StyleSheet } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ContributionGraph } from "react-native-chart-kit";
import { Dimensions, SafeAreaView, View } from "react-native";

async function logout(navigation) {
  navigation.navigate("LoginPage");
  await AsyncStorage.removeItem("id");
}

async function checkSession(navigation) {
  try {
    if ((await AsyncStorage.getItem("id")) === null) {
      navigation.navigate("LoginPage");
    }
  } catch (error) { }
}

export default function MainScreen() {
  const navigation = useNavigation();
  checkSession(navigation);
  const screenWidth = Dimensions.get("window").width;
  const [alerts, setAlerts] = useState([]);
  const [resolved, setResolved] = useState(0);
  const [unresolved, setUnresolved] = useState(0);

  let alertList = [];
  let alertDetails;
  useEffect(() => {
    fetch(global.ipFlask + "/getAlertRecord")
      .then((res) => res.json())
      .then((data) => {
        if (data["alerts"] != 0) {
          for (let i = 0; i < data[0]["alerts"].length; i++) {
            alertDetails = {
              date: data[0]["alerts"][i]["date"],
              count: data[0]["alerts"][i]["count"],
            };
            alertList[i] = alertDetails;
          }
          setAlerts(alertList);
        } else if (data["result"] === -1) {
          console.log("ERROR");
        }

        if (data["counter"] != -1) {
          setResolved(data[1]["counter"]["resolved"]);
          setUnresolved(data[1]["counter"]["unresolved"]);
        } else if (data["result"] === -1) {
          console.log("ERROR");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const chartConfig = {
    backgroundGradientFrom: "#F2F2F2",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#F2F2F2",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(8, 120, 255, ${opacity})`,
    barPercentage: 0.5,
  };
  let todayDate = new Date();
  todayDate = todayDate.toISOString().split("T")[0];

  return (
    <NativeBaseProvider>
      <SafeAreaView>
        <VStack safeAreaTop="10" safeAreaLeft="5" space={"5"}>
          <TouchableOpacity onPress={() => logout(navigation)}>
            <SimpleLineIcons name="logout" size={35} color="black" />
          </TouchableOpacity>
          <Heading>Welcome Admin!</Heading>
          <Heading size={"sm"} mb="5">
            Today’s Alert Status
          </Heading>
          <HStack space={4}>
            <Box style={styles.box} bg="#F06698" shadow="5">
              <HStack space={2}>
                <Image
                  source={require("../assets/Wrong.png")}
                  alt="unresolved-icon"
                  style={styles.icon}
                />
                <Heading style={styles.caseNum}>{unresolved}</Heading>
              </HStack>
              <Text style={styles.status}>Unresolved</Text>
            </Box>

            <Box style={styles.box} bg="#88D497" shadow="5">
              <HStack space={2}>
                <Image
                  source={require("../assets/check.png")}
                  alt="resolved-icon"
                  style={styles.icon}
                />
                <Heading style={styles.caseNum}>{resolved}</Heading>
              </HStack>
              <Text style={styles.status}>Resolved</Text>
            </Box>
          </HStack>
          <HStack space={38} mt="20px">
            <Heading size={"sm"} mb="5" top="3">
              Brief History
            </Heading>
            <Button
              bg="#97B2D7"
              rounded={"3xl"}
              size="xs"
              ml="20"
              onPress={() => navigation.navigate("Alerts")}
            >
              View More
            </Button>
          </HStack>
        </VStack>
        <Center my={"5"}>
          <ContributionGraph
            values={alerts}
            endDate={new Date(todayDate)}
            numDays={105}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            backgroundColor={"transparent"}
          />
        </Center>
      </SafeAreaView>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  caseNum: {
    marginTop: "7%",
    color: "#FFFFFF",
  },
  status: {
    marginLeft: "30%",
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  icon: {
    marginLeft: 9,
    marginTop: 10,
    width: 40,
    aspectRatio: "1",
  },
  box: {
    my: "auto",
    width: 158,
    height: 100,
    borderRadius: 10,
  },
});
