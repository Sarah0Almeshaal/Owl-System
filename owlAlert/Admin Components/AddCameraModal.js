import { React, useState, useEffect } from "react";
import { Button, Center, Modal, FormControl, Input, Heading, Box, Select, Collapse, 
Alert, VStack, HStack, Text, WarningOutlineIcon } from "native-base";
import { Divider } from '@rneui/themed';
import AsyncStorage from "@react-native-async-storage/async-storage";


const AddCamera = props => {
    const [showModal, setShowModal] = useState(false);
    const [floor, setFloor] = useState("");
    const [ip, setIP] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [floorError, setFloorErrors] = useState({});
    const [ipError, setIpErrors] = useState({});

    let cameraInfo = { cameraNum: props.cameraNum, cameraFloor: floor, cameraIp: ip };

    async function addCamera(cameraInfo) {
        fetch(String(await AsyncStorage.getItem("ip")).replace(/["]/g, "") + "/addCamera", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cameraNum: cameraInfo.cameraNum,
                cameraFloor: cameraInfo.cameraFloor,
                cameraIp: cameraInfo.cameraIp,
                adminId: JSON.parse(await AsyncStorage.getItem("id"))
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data["result"] === 1) {
                    setShowModal(false)
                    setShowAlert(false)                    
                } else {
                    console.log("ERROR")
                    setShowAlert(true)
                }
            })
            .catch((err) => console.log(err));
    }

    function show() {
        setShowModal(true)
        setShowAlert(false)
        setFloorErrors({
            floor: "",
        });
        setIpErrors({
            ip: "",
        });
    }

    function validateInputs() {
        let isValid = true;
        if (floor === "") {
            setFloorErrors({
                floor: "Please choose a floor",
            });
            isValid = false;
        } else {
            setFloorErrors({
                floor: "",
            });
        }
        if (ip === "") {
            setIpErrors({
                ip: "IP address is required ",
            });
            isValid = false;
        } else {
            setIpErrors({
                ip: "",
            });
        }
        if (isValid === true) {
            addCamera(cameraInfo);
        }
    };

    return (
        <Center>
            <Button onPress={() => show()}>Add Camera</Button>
            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <Modal.Content maxWidth="400px">
                    <Modal.CloseButton />
                    <Modal.Header borderBottomWidth={"0"}>
                        Add Camera
                        <Divider style={{ width: "15%", marginTop: 5 }} width={"2"} color="#0785F9" inset={true} insetType="right" />
                        <Heading size="xs" top="5" fontWeight={"normal"}>Camera #{props.cameraNum}</Heading>
                        <Collapse isOpen={showAlert}>
                            <Alert mx="auto" mt="20px" width="250px" status="error" colorScheme="error">
                                <VStack space={5} flexShrink={1} w="100%">
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
                    </Modal.Header>
                    <Modal.Body>
                        <Box bg={"#E0E0E0"} top="2" mb="3" rounded={"5"} >
                            <FormControl mt="3" left={"2"} isRequired isInvalid={"floor" in floorError}>
                                <FormControl.Label _text={{ color: "black" }}>Floor</FormControl.Label>
                                <Select selectedValue={"1"} minWidth={200} placeholder="Choose Floor"
                                    borderRadius="10" textAlign={"center"} borderColor="black" w="200" 
                                    mx="auto" bg={"#FFFFFF"} onValueChange={(floor) => setFloor(floor)}>
                                    <Select.Item label="Floor 1" value="1" />
                                    <Select.Item label="Floor 2" value="2" />
                                    <Select.Item label="Floor 3" value="3" />
                                    <Select.Item label="Floor 4" value="4" />
                                    <Select.Item label="Floor 5" value="5" />
                                </Select>
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    {floorError.floor}
                                </FormControl.ErrorMessage>
                            </FormControl>
                            <FormControl mt="3" mb="3" left={"2"} isRequired isInvalid={"ip" in ipError} >
                                <FormControl.Label _text={{ color: "black" }}>IP Address</FormControl.Label>
                                <Input borderRadius="10" placeholder="0.0.0.0" textAlign={"center"}
                                    borderColor="black" w="200" mx="auto" bg={"#FFFFFF"} onChangeText={(ip) => setIP(ip)} />
                                <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                    {ipError.ip}
                                </FormControl.ErrorMessage>
                            </FormControl>
                        </Box>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray" onPress={() => { setShowModal(false); }}>Cancel</Button>
                            <Button bg={"#399DFA"} onPress={() => validateInputs()}>Add</Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
        </Center>
    );
}
  export default AddCamera;
