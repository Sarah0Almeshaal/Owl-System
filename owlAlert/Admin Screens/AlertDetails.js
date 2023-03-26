import { React, useState } from "react";
import {
    NativeBaseProvider, Heading, HStack, VStack, Image, Text
} from "native-base";
import { StyleSheet } from 'react-native';
import { Divider } from '@rneui/themed';
import BottomBar from "../Admin Components/BottomBar";

export default function TestScreen(alertNum) {
    alert = {
        alertNum: 5,
        image: 1,
        status: "Resolved",
        floor: 2,
        cam: 3,
        date: "12-8-2023",
        time: "20:13:03"
    }

    return (
        <NativeBaseProvider>
            <VStack safeAreaTop="16" safeAreaLeft="5" space={"1"}>
                <Heading size={"lg"}>
                    Alert #{alert.alertNum}
                </Heading>
                <Divider style={{ width: "15%" }} width={"2"} color="#0785F9" inset={true} insetType="right" />
            </VStack>
            <VStack safeAreaTop="5" safeAreaLeft="5" space={"6"}>
                <Heading size={"sm"} ml="15px" >
                    Alert Details
                </Heading>
             
                <Image source={require("../assets/owlsys-logo.png")} alt="Owl System Logo" width={170} height={170} />
                {/* color={variant === "solid" ? "lightText" : variant !== "outline" ? "darkText" : null}  */}
                <Text style={styles.info}>Status: <Text style={styles.status}>{alert.status}</Text> </Text>
                <HStack space={"35%"}>
                    <Text style={styles.info}>Floor: {alert.floor}</Text>
                    <Text style={styles.info}>Camera: {alert.cam}</Text>
                </HStack>
                <HStack space={"13%"}>
                    <Text style={styles.info}>Date: {alert.date}</Text>
                    <Text style={styles.info}>Time: {alert.time}</Text>
                </HStack>
            </VStack>
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
        color:  (alert.status === "Resolved") ? "#FFB302" : "#00A5DA" 
    }

});
