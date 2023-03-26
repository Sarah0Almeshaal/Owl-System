import { React } from "react";
import {
  NativeBaseProvider, Box,
  Text, HStack, Button, Center, VStack, Icon, Container, View
} from "native-base";
import { AntDesign } from '@expo/vector-icons';
import { Dimensions } from "react-native";


export default function ConfirmationMsg(cameraNum) {
  return (
    <NativeBaseProvider>
    <HStack style={{position: 'absolute', left: 0, right: 0, justifyContent: 'center', alignItems: 'center'}}>
      <Center mx="auto">
        <Box my="auto" width="350px" height="160px" 
          borderRadius="md" bg="#FFFFFF" shadow="9" >
          <Center>
            <VStack space={5} justifyContent="center" bottom="10">
              <Icon mb="1" as={<AntDesign name="questioncircleo" />} color="black" size="50" top="16" right={"10"} />
              <Container paddingLeft={"15"} bottom="15">
                <Text textAlign={"center"}>
                  Are you sure you want to delete camera CameraNo?
                </Text>
              </Container>
            </VStack>
            <HStack space={20} justifyContent="center" bottom="10">
              <Button width={"60px"} _text={{ textAlign: "center", fontWeight: "bold" }} bgColor="#FA3939">No</Button>
              <Button width={"60px"} _text={{ textAlign: "center", fontWeight: "bold" }} bgColor="#399DFA">Yes</Button>
            </HStack>
          </Center>
        </Box>
      </Center>
      </HStack>
    </NativeBaseProvider>
  );
}

