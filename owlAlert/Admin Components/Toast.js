import { React, useState } from "react";
import { NativeBaseProvider, Center, Button, useToast, VStack, HStack, Alert, Text } from "native-base";


export default function Toast({ action }) {


  function message() {
    if (action === "add") {
      return "Camera added successfully"
    } else {
      return "Camera deleted successfully"
    }
  }

  const toast = useToast();

  const ToastDialog = () => <Alert maxWidth="90%" alignSelf="center" flexDirection="row" status={"success"} variant={"left-accent"}>
    <VStack space={1} flexShrink={1} w="100%">
      <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
        <HStack space={2} flexShrink={1} alignItems="center">
          <Alert.Icon />
        </HStack>
        <Text px="6" color={"left-accent" === "solid" ? "lightText" : "left-accent" !== "outline" ? "darkText" : null}
          fontWeight="thin" fontSize={"13"}> {message()} </Text>
      </HStack>
    </VStack>
  </Alert>;

  function show() {
    toast.show({
      render: ({
      }) => {
        return <Alert maxWidth="90%" alignSelf="center" flexDirection="row" status={"success"} variant={"left-accent"}>
        <VStack space={1} flexShrink={1} w="100%">
          <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
            <HStack space={2} flexShrink={1} alignItems="center">
              <Alert.Icon />
            </HStack>
            <Text px="6" color={"left-accent" === "solid" ? "lightText" : "left-accent" !== "outline" ? "darkText" : null}
              fontWeight="thin" fontSize={"13"}> {message()} </Text>
          </HStack>
        </VStack>
      </Alert>;
      }
    })
  }

  return (
    <NativeBaseProvider>
      <Center>
        <VStack space={2}>

          <Button onPress={() => show()}>Toast</Button>

          {/* {show()} */}
          {/* {ToastDetails.map((item, index) => <ToastDialog key={index} {...item} />)} */}
        </VStack>
      </Center>

    </NativeBaseProvider>
  );
}



// export default Toast;