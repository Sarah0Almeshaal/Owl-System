import { React, useState } from "react";
import { NativeBaseProvider, Center, Button, useToast, VStack, HStack, Alert, Text } from "native-base";

export default function Toast(action) {
 
  const toast = useToast();
  action = "delete"
  function specifyAction(action) {
    let ToastDetails
    if (action === "delete") {
      ToastDetails = [{
        status: "success",
        variant: "left-accent",
        description: "Camera deleted successfully",
      }]
    } else if (action === "add") {
      ToastDetails = [{
        status: "success",
        variant: "left-accent",
        description: "Camera added successfully",
      }]
    }
    return ToastDetails
  }


  

  const ToastDialog = ({
    status,
    variant,
    description,
  }) => <Alert maxWidth="90%" alignSelf="center" flexDirection="row" status={status} variant={variant}>
      <VStack space={1} flexShrink={1} w="100%">
        <HStack flexShrink={1} alignItems="center" justifyContent="space-between">
          <HStack space={2} flexShrink={1} alignItems="center">
            <Alert.Icon />
          </HStack>
          <Text px="6" color={variant === "solid" ? "lightText" : variant !== "outline" ? "darkText" : null} 
            fontWeight="thin" fontSize={"13"}> {description} </Text>
        </HStack>
      </VStack>
    </Alert>;

    let details = specifyAction(action)

  return (
    <NativeBaseProvider>
      <Center>
        <VStack space={2}>
          {details.map((item, index) => <Button key={index} onPress={() => toast.show({
            render: ({
            }) => {
              return <ToastDialog  {...item} />;
            }
          })}>
          </Button>)}
        </VStack>
      </Center>

    </NativeBaseProvider>
  );
}

