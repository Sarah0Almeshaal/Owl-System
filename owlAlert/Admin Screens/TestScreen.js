import { React, useState } from "react";


import { NativeBaseProvider, Button, useToast, VStack, HStack, Alert, Text, Center } from "native-base";
import Toast from "../Admin Components/Toast"




export default function TestScreen() {

  const toast = useToast();

  const ToastDialog = () => <Alert maxWidth="90%" alignSelf="center" flexDirection="row" status={"success"} variant={"left-accent"}>
    <VStack space={1} flexShrink={1} w="100%">
      <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
        <HStack space={2} flexShrink={1} alignItems="center">
          <Alert.Icon />
        </HStack>
        <Text px="6" color={"left-accent" === "solid" ? "lightText" : "left-accent" !== "outline" ? "darkText" : null}
          fontWeight="thin" fontSize={"13"}> {"Camera added successfully"} </Text>
      </HStack>
    </VStack>
  </Alert>;

  return (
    <NativeBaseProvider>
      <Center>
        <VStack space={2}>
          <Text>MEOW</Text>
          <Button onPress={() => toast.show({
            render: ({
            }) => {
              return <Alert maxWidth="90%" alignSelf="center" flexDirection="row" status={"success"} variant={"left-accent"}>
                <VStack space={1} flexShrink={1} w="100%">
                  <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
                    <HStack space={2} flexShrink={1} alignItems="center">
                      <Alert.Icon />
                    </HStack>
                    <Text px="6" color={"left-accent" === "solid" ? "lightText" : "left-accent" !== "outline" ? "darkText" : null}
                      fontWeight="thin" fontSize={"13"}> {"Camera added successfully"} </Text>
                  </HStack>
                </VStack>
              </Alert>;
            }
          })}>Toast</Button>
          <Toast />
        </VStack>
      </Center>

    </NativeBaseProvider>
  );
}
