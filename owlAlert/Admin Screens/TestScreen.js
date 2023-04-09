import { React, useState } from "react";
import { NativeBaseProvider, View, Button } from "native-base";
import BottomBar from "../Admin Components/BottomBar";
import AddCamera from "../Admin Components/AddCameraModal";
import ConfirmationMsg from "../Admin Components/DeleteCameraDialog";
import Toast from "../Admin Components/Toast";
import TestProp from "../Admin Components/TestProp";
import AlertDetails from "./AlertDetails";
export default function TestScreen() {
  return (
    <NativeBaseProvider>
      <View my="300">
        {/* <ConfirmationMsg cameraNum={12} />
     
        <AddCamera cameraNum={12}/> */}
        <AlertDetails />

        {/* <Toast action="add"/>
        <Toast action="delet"/> */}

        {/* <TestProp name="SOS"/> */}
      </View>

      {/* <BottomBar /> */}
    </NativeBaseProvider>
  );
}
