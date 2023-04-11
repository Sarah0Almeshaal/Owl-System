import { React, useState, useEffect } from "react";
import {
    NativeBaseProvider, Heading, HStack, VStack, Text, Button
} from "native-base";
import { StyleSheet, View, ScrollView, Image} from 'react-native';
import { Divider } from '@rneui/themed';
import BottomBar from "../Admin Components/BottomBar";
import { Table, TableWrapper, Row } from 'react-native-table-component-2';


export default function Img() {
    const [alert, setAlert] = useState()
    const [respondents, setRespondents] = useState([])

    // function getImage() {
    //     fetch("http://10.10.1.203:5000/image", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //     })
    //         .then((res) => {
    //             return res.json();
    //         })
    //         .then((res) => {
    //             if (res["image"] != null) {
    //                 // console.log(res["image"])
    //                 setAlert(res["image"])
    //             }
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //         });
    // }

    useEffect(() => {
        fetch("http://10.10.1.203:5000/image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },

        }).then((res) => res.json())
            .then((data) => {
                if (data["image"] != null) {
                    setAlert(data["image"])
                    
                    // console.log(alert)
                }

            }).catch((error) => {
                console.error(error);
            });
    }, [])

    // console.log(alert.image)
    // getImage()
    // getImage()
    let img = alert
    // console.log(img)
    return (
        <NativeBaseProvider>
            <Text size={"sm"}>{img}</Text>
            <Image source={{ uri: `data:image/jpg;base64,${alert}` }} alt="Alert Image" width={170} height={170} />
            {/* <Image source={{ uri: "data:image/jpg;base64," + alert }} alt="Alert Image" style={{ height: 150, width: 150 }} /> */}
            <Button onPress={() => getImage()}></Button>
        </NativeBaseProvider>
    );
}
