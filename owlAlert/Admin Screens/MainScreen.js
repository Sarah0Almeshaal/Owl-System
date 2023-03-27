import { React } from "react";
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
import BottomBar from "../Admin Components/BottomBar";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ContributionGraph } from "react-native-chart-kit";
import { Dimensions } from "react-native";

async function logout(navigation) {
  navigation.navigate("LoginPage");
  await AsyncStorage.removeItem("id");
}

async function checkSession(navigation) {
  try {
    if ((await AsyncStorage.getItem("id")) === null) {
      navigation.navigate("LoginPage");
    }
  } catch (error) {}
}

// ------------------------------------------ ideas: Use hooks (useEffect then useState) ------------------------------------------

// async function checkUserHosting() {
//     return fetch(String(await AsyncStorage.getItem("ip")).replace(/["]/g, "") + "/getAlertCount")
//         .then((response) => {
//             return response.json().then((data) => {
//                 // console.log("data");
//                 // console.log(data);
//                 return data;
//             }).catch((err) => {
//                 console.log(err);
//             })
//         });
// }

// checkUserHosting().then((data) => {
//     // console.log(data)
//     printF(data)
// });

// let x
// function printF(data) {
//     return new Promise((resolve, reject) =>
//       setTimeout(() => resolve(x = data), 1000)
//     );
//   }
//   printF(x).then(res => console.log(x));

async function getCameraList() {
  return fetch(
    String(await AsyncStorage.getItem("ip")).replace(/["]/g, "") + "/getData",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      if (data["cameraList"] != 0) {
        // console.log(data["alerts"])
        // for (let i = 0; i < data["alerts"].length; i++) {
        //     for (let alert in data) {
        //         alertDetails = {
        //             "date": data[alert][i]["Date"],
        //             "count": data[alert][i]["Counter"],
        //         }
        //     } alertList[i] = alertDetails
        // }
        // return alertList;
      } else if (data["alerts"] === 0) {
        //view now staticts
        console.log("0");
      } else if (data["result"] === -1) {
        console.log("ERROR");
      }
    })
    .catch((error) => console.warn(error));
}

getAlertCount();
// getAlertCount().then(response => console.log(response));

// getAlertCount().then(response => console.log(response));
// console.log("after call")

// var listt = getAlertCount()

// print the contents of the fruits list

export default function MainScreen(resolved, unresolved) {
  const navigation = useNavigation();
  checkSession(navigation);
  const screenWidth = Dimensions.get("window").width;

  const commitsData = [
    { date: "2023-03-15", count: 1 },
    { date: "2023-03-17", count: 2 },
  ];

  // console.log("commitsData")
  // for (let i = 0; i < commitsData.length; i++) {
  //     for (let alert in commitsData) {
  //         console.log(commitsData[alert]["date"] + " " + commitsData[alert]["count"])
  //     }
  // }
  // console.log("----------------------------------------")

  // console.log("alertList")
  // for (let i = 0; i < alertList.length; i++) {
  //     for (let alert in alertList) {
  //         console.log("list " +  list[1]["count"])
  //     }
  // }
  // console.log("----------------------------------------")

  const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#FFFFFF",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(8, 120, 255, ${opacity})`,
    barPercentage: 0.5,
  };
  let todayDate = new Date();
  todayDate = todayDate.toISOString().split("T")[0];

  resolved = 12;
  unresolved = 5;

  return (
    <NativeBaseProvider>
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
          <Button bg="#97B2D7" rounded={"3xl"} size="xs" ml="20">
            View More
          </Button>
        </HStack>
        <Center>
          <ContributionGraph
            values={commitsData}
            endDate={new Date(todayDate)}
            numDays={105}
            width={screenWidth}
            height={220}
            chartConfig={chartConfig}
            backgroundColor={"transparent"}
          />
        </Center>
      </VStack>
      <BottomBar />
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  caseNum: {
    marginTop: "7%",
    size: "lg",
    color: "#FFFFFF",
  },
  status: {
    marginLeft: "30%",
    size: "md",
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
