import { React, useState, useEffect } from "react";
import {
    NativeBaseProvider, Heading, HStack, VStack, Text
} from "native-base";
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { Divider } from '@rneui/themed';
import BottomBar from "../Admin Components/BottomBar";
import { Table, TableWrapper, Row } from 'react-native-table-component-2';


export default function AlertDetails({ route }) {
    const [alert, setAlert] = useState({})
    const [respondents, setRespondents] = useState([])

    alertNum = route.params.alertNum
    let respondentsList = []

    useEffect(() => {
        fetch("http://10.10.1.203:5000/alertDetails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                alertId: alertNum
            }),
        }).then((res) => res.json())
            .then((data) => {
                if (data["alertDetails"] != -1) {
                    setAlert(alert => ({
                        alertNum: alertNum,
                        image: data[0]["alertDetails"]["image"],
                        status: data[0]["alertDetails"]["status"],
                        floor: data[0]["alertDetails"]["floor"],
                        cam: data[0]["alertDetails"]["camId"],
                        date: data[0]["alertDetails"]["date"],
                        time: data[0]["alertDetails"]["time"]
                    }));
                }
                else if (data["result"] === -1) {
                    console.log("ERROR")
                }

                if (data["respondents"] != 0) {
                    for (let i = 0; i < data[1]["respondents"].length; i++) {
                        let respondent = {
                            "id": data[1]["respondents"][i]["id"],
                            "name": data[1]["respondents"][i]["fname"] + " " + data[1]["respondents"][i]["lname"]
                        }
                        respondentsList[i] = respondent
                    }
                    setRespondents(respondentsList.map(obj => Object.values(obj)))
                }
            }).catch((error) => {
                console.error(error);
            });
    }, [])

    function statusColorId() {
        if (alert.status === "resolved") {
            return statusColor = "#0099DA"
        } else if (alert.status === "pending") {
            return statusColor = "#FFB302"
        } else if (alert.status === "unresolved") {
            return statusColor = "#FF4545"
        }
    }

    return (
        <NativeBaseProvider>
            <VStack safeAreaTop="16" safeAreaLeft="5" space={"1"}>
                <Heading size={"lg"}>
                    Alert #{alert.alertNum}
                </Heading>
                <Divider style={{ width: "15%" }} width={"2"} color="#0785F9" inset={true} insetType="right" />
            </VStack>
            <VStack safeAreaTop="5" safeAreaLeft="2" space={"2"}>
                <Heading size={"sm"} ml="15px" >
                    Alert Details
                </Heading>
                <Image source={{uri: `data:image/jpg;base64,${alert.image}`}} alt="Alert Image" width={170} height={170} />
                <Text style={styles.info}>Status: <Text style={{ fontWeight: "bold", color: statusColorId() }}>{alert.status}</Text> </Text>
                <HStack space={"39%"}>
                    <Text style={styles.info}>Floor: {alert.floor}</Text>
                    <Text style={styles.info}>Camera: {alert.cam}</Text>
                </HStack>
                <HStack space={"10"}>
                    <Text style={styles.info}>Date: {alert.date}</Text>
                    <Text style={styles.info}>Time: {alert.time}</Text>
                </HStack>
            </VStack>
            <View style={styles.container}>
                <Heading size={"xs"} margin={"2"}>Respondents</Heading>
                {respondents.length > 0 ?
                    <View style={styles.container}>
                        <Table borderStyle={{ borderWidth: 1, borderColor: "gray" }}>
                            <Row data={['ID', 'Name']} flexArr={[1, 2]} style={styles.header} textStyle={styles.tableHeader} />
                        </Table>
                        <ScrollView style={styles.dataWrapper}>
                            <Table borderStyle={{ borderWidth: 1, borderColor: "gray" }}>
                                <TableWrapper style={styles.wrapper}>
                                    {respondents.map((rowData, index) => (
                                        <Row
                                            key={index}
                                            data={rowData}
                                            flexArr={[1, 2]}
                                            style={[styles.row, index % 2 && { backgroundColor: '#F4F7FC' }]}
                                            textStyle={styles.text}
                                        />
                                    ))
                                    }
                                </TableWrapper>
                            </Table>
                        </ScrollView>
                    </View> :
                    <View style={{ alignSelf: "center", margin: 30 }}>
                        <Heading size={"sm"} style={{ color: 'gray', fontWeight: "bold" }}>No respondents</Heading>
                    </View>
                }
            </View>
            <BottomBar />
        </NativeBaseProvider>
    );
}

const styles = StyleSheet.create({
    box: {
        width: 350,
        height: "auto",
        rounding: "round",
        backgroundColor: "snow",
        alignSelf: "center",
        paddingTop: 10,
        marginTop: 20,
        paddingHorizontal: 30,
        borderRadius: "10px",
        shadowOpacity: 0.2,
        shadowOffset: { width: 1, height: 4 },
    },
    text: {
        textAlign: 'center',
    },
    info: {
        fontWeight: "bold"
    },
    container: {
        flex: 2,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: "10px",
        width: 350,
        alignSelf: "center",
        marginTop: 10,
    },
    header: {
        height: 30,
        backgroundColor: '#F4F7FC'
    },
    text: {
        textAlign: 'center',
        fontWeight: '100'
    },
    tableHeader: {
        textAlign: 'center',
        fontWeight: 'bold'
    },
    dataWrapper: {
        marginTop: 0
    },
    row: {
        height: 40,
        backgroundColor: '#FFFFFF'
    }
});
