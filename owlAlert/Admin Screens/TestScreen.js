import { React, useState } from "react";
import {
  NativeBaseProvider, View
} from "native-base";
import BottomBar from "../Admin Components/BottomBar";
import AddCamera from "../Admin Components/AddCameraModal";
import ConfirmationMsg from "../Admin Components/DeleteCameraDialog"
import Toast from "../Admin Components/Toast"

export default function TestScreen() {
  return (
    <NativeBaseProvider >
      <View my="300">
        <ConfirmationMsg />
        <AddCamera />
    
        <Toast/>
      </View>
      <BottomBar />

    </NativeBaseProvider>
  );
}

