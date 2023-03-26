import { React, useState, useEffect } from "react";
import {
    NativeBaseProvider, Heading, HStack, VStack, Image, Text
} from "native-base";
import { StyleSheet } from 'react-native';
import { Divider } from '@rneui/themed';
import BottomBar from "../Admin Components/BottomBar";

export default function AlertDetails(alertNum) {
    const [alert, setAlert] = useState({})
    const [respondents, setRespondents] = useState([])
    alertNum = 33
    let respondentsList = []
    useEffect(() => {
        fetch("http://10.120.1.203:5000/alertDetails")
            .then(res => res.json())
            .then((data) => {
                if (data["alertDetails"] != -1) {
                    setAlert(alert => ({
                        alertNum: alertNum,
                        // image: 1,
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
                            "fname": data[1]["respondents"][i]["fname"],
                            "lname": data[1]["respondents"][i]["lname"]
                        }
                        respondentsList[i] = respondent
                    }
                    setRespondents(respondentsList);
                }
            }).catch((error) => {
                console.error(error);
            });
    }, [])


    return (
        <NativeBaseProvider>
            <VStack safeAreaTop="16" safeAreaLeft="5" space={"1"}>
                <Heading size={"lg"}>
                    Alert #{alert.alertNum}
                </Heading>
                <Divider style={{ width: "15%" }} width={"2"} color="#0785F9" inset={true} insetType="right" />
            </VStack>
            <VStack safeAreaTop="5" safeAreaLeft="2" space={"6"}>
                <Heading size={"sm"} ml="15px" >
                    Alert Details
                </Heading>
                <Image source={require("../assets/owlsys-logo.png")} alt="Owl System Logo" width={170} height={170} />
                {/* color={variant === "solid" ? "lightText" : variant !== "outline" ? "darkText" : null}  */}
                <Text style={styles.info}>Status: <Text style={styles.status}>{alert.status}</Text> </Text>
                <HStack space={"39%"}>
                    <Text style={styles.info}>Floor: {alert.floor}</Text>
                    <Text style={styles.info}>Camera: {alert.cam}</Text>
                </HStack>
                <HStack space={"10"}>
                    <Text style={styles.info}>Date: {alert.date}</Text>
                    <Text style={styles.info}>Time: {alert.time}</Text>
                </HStack>
            </VStack>
            {/* {respondents.map((data) => (
                <Text key={data.id}>{data.fname}{data.id}{data.lname}</Text>
            ))} */}
            <BottomBar />
        </NativeBaseProvider>
    );
}

function color(status) {
    if (status === "Resolved") {
        return "#00A5DA"
    }
    else if (status === "Unresolved") {
        return "#FF3838"
    }
    else if (status === "Pending") {
        return "#FFB302"
    }
}

const styles = StyleSheet.create({
    info: {
        fontWeight: "bold"
    },
    status: {
        fontWeight: "bold",
        color: (alert.status === "Resolved") ? "#FFB302" : "#00A5DA"
    }

});

