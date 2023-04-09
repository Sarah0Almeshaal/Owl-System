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

  return (
    <NativeBaseProvider>
      <HStack bg="#284389" alignItems="center" safeAreaBottom shadow={6} style={{ position: 'absolute', bottom: 10, left: Dimensions.get('window').width / 22 }} rounded="50" width={"345px"} height={"76px"}>
        <Pressable onPress={() => { setSelected(1), navigation.navigate("CameraSC") }} opacity={selected === 1 ? 1 : 0.5} py="2" flex={1}>
          <Center>
            <Icon mb="1" as={<MaterialCommunityIcons name="cctv" />} color="white" size="45" top="3" />

          </Center>
        </Pressable>
        <Pressable onPress={() => { setSelected(2), navigation.navigate("MainScreen") }} opacity={selected === 2 ? 1 : 0.6} py="2" flex={1}>
          <Center style={{
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Icon mb="1" as={<Entypo name="home" />} color="white" size="45" top="3" />

          </Center>
        </Pressable>
        <Pressable onPress={() => { setSelected(3), navigation.navigate("AlertHistorySC") }} opacity={selected === 3 ? 1 : 0.5} py="2" flex={1} >
          <Center>
            <Icon mb="1" as={<MaterialCommunityIcons name="history" />} color="white" size="50" top="4" />
          </Center>
        </Pressable>
      </HStack>
    </NativeBaseProvider>
  );
}

