import React, { useState } from 'react';
import { Modal, StyleSheet, Text, Pressable, View } from 'react-native';
import { FormControl, Heading, WarningOutlineIcon, HStack, NativeBaseProvider } from "native-base";
import { Dropdown } from 'react-native-element-dropdown';
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddCamera = ({ handleCallback }) => {
    const [floorError, setFloorErrors] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [floor, setFloor] = useState("");
    const [cameraNum, setCameraNum] = useState('');

    const floors = [
        { label: 'Floor 1', value: '1' },
        { label: 'Floor 2', value: '2' },
        { label: 'Floor 3', value: '3' },
        { label: 'Floor 4', value: '4' },
        { label: 'Floor 5', value: '5' },
    ];

    async function getCameraId() {
        setModalVisible(true);
        fetch(
            global.ipFlask + "/getLastCamera",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then((res) => res.json())
            .then((data) => {
                if (data["cameraLastRow"] >= 0) {
                    setCameraNum(parseInt(data["cameraLastRow"]) + 1)
                } else {
                    console.log("ERROR")
                }
            })
    }

    let cameraInfo = { cameraNum: cameraNum, cameraFloor: floor["value"], camName: "cam " + cameraNum };

    async function addCamera(cameraInfo) {
        fetch(global.ipFlask + "/addCamera", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cameraNum: cameraInfo.cameraNum,
                cameraFloor: cameraInfo.cameraFloor,
                camName: cameraInfo.camName,
                adminId: JSON.parse(await AsyncStorage.getItem("id"))
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data["result"] === 1) {
                    let cam = {
                        "floor": cameraInfo.cameraFloor,
                        "id": cameraInfo.cameraNum
                    }
                    handleCallback(cam)
                } else {
                }
            })
            .catch((err) => console.log(err));
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
            });
        }
        if (isValid === true) {
            addCamera(cameraInfo);
            setModalVisible(false)
            setFloorErrors({});
        }
    };

    return (
        <View style={cameraStyles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={cameraStyles.centeredView}>
                    <View style={cameraStyles.modalView}>
                        <Heading size="sm" style={cameraStyles.modalText}>Add Camera #{cameraNum}</Heading>
                        <FormControl isRequired isInvalid={"floor" in floorError}>
                            <FormControl.Label _text={{ color: "black" }}>Floor</FormControl.Label>
                            <Dropdown style={cameraStyles.dropdown}
                                placeholderStyle={cameraStyles.placeholderStyle}
                                selectedTextStyle={cameraStyles.selectedTextStyle}
                                inputSearchStyle={cameraStyles.inputSearchStyle}
                                iconStyle={cameraStyles.iconStyle}
                                data={floors}
                                labelField="label"
                                valueField="value"
                                placeholder="Select Floor"
                                value={floor}
                                onChange={floor => setFloor(floor)} />
                            <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
                                {floorError.floor}
                            </FormControl.ErrorMessage>
                        </FormControl>
                        <HStack>
                            <Pressable
                                style={[cameraStyles.button, cameraStyles.cancle]}
                                onPress={() => { setModalVisible(!modalVisible), setFloorErrors({}), setFloor("") }}>
                                <Text style={cameraStyles.cancleStyle}>Cancle</Text>
                            </Pressable>
                            <Pressable
                                style={[cameraStyles.button]}
                                onPress={() => validateInputs()}>
                                <Text style={cameraStyles.textStyle}>Add Camera</Text>
                            </Pressable>
                        </HStack>
                    </View>
                </View>
            </Modal>
            <Pressable
                style={[cameraStyles.addButton]}
                onPress={() => getCameraId()}>
                <Text style={cameraStyles.textStyle} >+ Add</Text>
            </Pressable>
        </View>
    );
};

const cameraStyles = StyleSheet.create({
    addButton: {
        borderRadius: 20,
        padding: 10,
        width: 80,
        backgroundColor: '#0785F9',
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingTop: 35,
        paddingBottom: 35,
        paddingLeft: 15,
        paddingRight: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        marginTop: 16,
        borderRadius: 20,
        padding: 10,
        width: 130,
        backgroundColor: '#0785F9',
    },
    textStyle: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    dropdown: {
        marginTop: 3,
        height: 40,
        width: 180,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: 13,
    },
    placeholderStyle: {
        fontSize: 13,
        color: 'gray'
    },
    selectedTextStyle: {
        fontSize: 13,
    },
    input: {
        height: 40,
        margin: 12,
        marginBottom: 20,
        padding: 10,
        width: 180,
        borderRadius: 12,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
    },
    cancle: {
        backgroundColor: 'white',
        padding: 10,
        width: 140,
    },
    cancleStyle: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 12,
    },
});

export default AddCamera;