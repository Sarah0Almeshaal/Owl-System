import { React, useState, useRef } from "react";
import { Text, Button, Center, AlertDialog, Collapse, Alert, VStack, HStack } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";


const DeleteCameraDialog = props => {
    const [isOpen, setIsOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const onClose = () => setIsOpen(false);
    const cancelRef = useRef(null);
    let cameraNum = props.cameraNum

    async function deleteCamera(cameraNum) {
        fetch(String(await AsyncStorage.getItem("ip")).replace(/["]/g, "") + "/deleteCamera", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cameraNum: cameraNum
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data["result"] === 1) {
                    onClose
                    setIsOpen(!isOpen)
                } else {
                    console.log("ERROR")
                    setShowAlert(true)
                }
            })
            .catch((err) => console.log(err));
    }

    function show() {
        setIsOpen(!isOpen)
        setShowAlert(false)
    }

    return (
        <Center>
            <Button colorScheme="danger" onPress={() => show()}>
                Delete Camera
            </Button>
            <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
                <AlertDialog.Content>
                    <AlertDialog.CloseButton />
                    <AlertDialog.Header _text={{ fontSize: 13 }}>Delete Camera</AlertDialog.Header>
                    <AlertDialog.Body>
                        <Collapse isOpen={showAlert}>
                            <Alert mx="auto" mt="20px" width="250px" status="error" colorScheme="error">
                                <VStack space={2} flexShrink={1} w="100%">
                                    <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                                        <HStack flexShrink={1} space={2} alignItems="center">
                                            <Alert.Icon />
                                            <Text fontSize="xs" fontWeight="medium" color="coolGray.800">
                                                There was an error.{"\n"}Please try again.
                                            </Text>
                                        </HStack>
                                    </HStack>
                                </VStack>
                            </Alert>
                        </Collapse>
                        <Text textAlign="center" fontSize="12">
                            This will remove all data relating to camera {props.cameraNum}.
                        </Text>
                        <Text textAlign="center" fontSize="12">
                            This action cannot be reversed.
                        </Text>
                    </AlertDialog.Body>
                    <AlertDialog.Footer>
                        <Button.Group space={2} size="sm">
                            <Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
                                Cancel
                            </Button>
                            <Button colorScheme="danger" onPress={() => deleteCamera(props.cameraNum)}>
                                Delete
                            </Button>
                        </Button.Group>
                    </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>
        </Center>
    );
}

export default DeleteCameraDialog;