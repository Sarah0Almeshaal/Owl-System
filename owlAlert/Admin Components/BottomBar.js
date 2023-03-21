import { React, useState } from "react";
import {
  NativeBaseProvider, Center, HStack, Pressable, Icon
} from "native-base";
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function BottomBar() {
  const [selected, setSelected] = useState(1);
  const navigation = useNavigation();

  function navigate(pageName){
    navigation.navigate(pageName)
    setSelected(1)
  }

  return (
    <NativeBaseProvider>
      <HStack bg="#284389" alignItems="center" safeAreaBottom shadow={6} style={{ position: 'absolute', bottom: 10, left: Dimensions.get('window').width / 22 }} rounded="50" width={"345px"} height={"76px"}>
        <Pressable cursor="pointer" opacity={selected === 1 ? 1 : 0.5} py="2" flex={1} onPress={() => navigate("LoginPage")}>
          <Center>
            {/* <Image source={require("../assets/Camera.png")} alt="camera" size="xs" top="3" /> */}
            <Icon mb="1" as={<MaterialCommunityIcons name="cctv" />} color="white" size="45" top="3" />

          </Center>
        </Pressable>
        <Pressable cursor="pointer" opacity={selected === 2 ? 1 : 0.6} py="2" flex={1} onPress={() => setSelected(2)}>
          <Center style={{
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* <Image source={require("../assets/Home.png")} alt="camera" size="xs" top="3" /> */}
            <Icon mb="1" as={<Entypo name="home" />} color="white" size="45" top="3" />

          </Center>
        </Pressable>
        <Pressable cursor="pointer" opacity={selected === 3 ? 1 : 0.5} py="2" flex={1} onPress={() => setSelected(3)}>
          <Center>
            {/* <Image source={require("../assets/Alert-History.png")} alt="camera" size="xs" top="3" /> */}
            <Icon mb="1" as={<MaterialCommunityIcons name="history" />} color="white" size="50" top="4" />
          </Center>
        </Pressable>
      </HStack>
    </NativeBaseProvider>
  );
}

