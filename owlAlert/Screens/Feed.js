import "react-native-gesture-handler";
import * as React from "react";
import { Component, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  Platform,
  Dimensions,
  ScrollView,
  FlatList,
  useEffect,
} from "react-native";
import AlertBox from "../components/AlertBox";

function Feed() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // fetch and set data
  }, []);

  // const data =[
  //     {alertId:1, floorNo:2, CamNo:2, ResNo:0},
  //     {alertId:2, floorNo:3, CamNo:2, ResNo:0},
  //     {alertId:3, floorNo:4, CamNo:2, ResNo:0}
  // ]

  const renderdata = (item) => {
    return (
      <AlertBox
        alertId={item.alertId}
        floorNo={item.floorNo}
        CamNo={item.CamNo}
      />
    );
  };
  return (
    <View>
      <FlatList
        data={data}
        renderItem={({ item }) => {
          return renderdata(item);
        }}
        keyExtractor={(item) => `${item.alertId}`}
      />
    </View>
  );
}
