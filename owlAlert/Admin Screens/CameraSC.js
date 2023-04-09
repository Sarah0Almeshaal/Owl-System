import { NativeBaseProvider } from "native-base";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity, Alert
} from "react-native";
import BottomBar from "../Admin Components/BottomBar";
import AddCamera from "../Admin Components/AddCamera";
import React, { useState, useEffect } from "react";
import { DataTable, IconButton, MD3Colors } from "react-native-paper";

// items[items.length - 1].id  

function CameraSC() {

  const [page, setPage] = useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = useState(6);
  const from = page * numberOfItemsPerPage;
  const [items, setItems] = useState([]);
    const [newItems, setNewItems] = useState([]);
  const [itemId, setItemId] = useState("");

  const to = Math.min((page + 1) * numberOfItemsPerPage, items.length);

  async function deleteCamera(cameraNum) {
    fetch("http://10.10.1.203:5000" + "/deleteCamera", {
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
        } else {
          console.log("ERROR")
        }
      })
      .catch((err) => console.log(err));
  }

  function createAlert() {
    Alert.alert('Delete Camera', "This will remove all data relating to camera " + itemId + "." + " This action cannot be reversed.", [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'OK', onPress: () => { handleDeleteClick(itemId); deleteCamera(itemId); }},
      ]);
  }

  const flaskAPI = "http://10.10.1.203:5000//getCamerasData";
  useEffect(() => {
    getCamerasData();
  }, []);

  const getCamerasData = () => {
    fetch(flaskAPI, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        var data = res.cameraList;
        setItems(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

  const handleDeleteClick = (itemId) => {
    const newItems = [...items];
    const index = items.findIndex((item) => item.id === itemId);
    newItems.splice(index, 1);
    setItems(newItems);
  };

  function deleteFunc(itemId) {
    setItemId(itemId)
    createAlert()
  }

  let tableRoww = (item) => (
    <DataTable.Row key={item.id} >
      <DataTable.Cell>{item.id}</DataTable.Cell>
      <DataTable.Cell>{item.floor}</DataTable.Cell>
      <DataTable.Cell style={{ flex: 0.5 }} >
        <View style={styles.container}>
          <TouchableOpacity >
            <IconButton
              icon="delete-forever"
              iconColor={MD3Colors.error50}
              size={30}
              onPress={() => deleteFunc(itemId)}
            />
          </TouchableOpacity>
        </View>
      </DataTable.Cell>
    </DataTable.Row>
  );

  return (
    <NativeBaseProvider>
      <SafeAreaView>
        <View style={styles.container}>
          <Text style={styles.pageTitle}>Cameras</Text>
          <View style={styles.line} />
          <View style={styles.box}>
            <View style={styles.row}>
              <Text style={styles.title}>Cameras List </Text>
              <AddCamera />
            </View>
            <View>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>ID</DataTable.Title>
                  <DataTable.Title style={{ paddingRight: 60 }}>Floor</DataTable.Title>
                </DataTable.Header>
                {items
                  .slice(
                    page * numberOfItemsPerPage,
                    page * numberOfItemsPerPage + numberOfItemsPerPage
                  )
                  .map((row) => tableRoww(row))}

                <DataTable.Pagination
                  page={page}
                  numberOfPages={Math.ceil(items.length / numberOfItemsPerPage)}
                  onPageChange={(page) => setPage(page)}
                  label={`${from + 1}-${to} of ${items.length}`}
                  numberOfItemsPerPage={numberOfItemsPerPage}
                  onItemsPerPageChange={onItemsPerPageChange}
                />
              </DataTable>
            </View>
          </View>
        </View>
      </SafeAreaView>
      <BottomBar />
    </NativeBaseProvider>
  );
}
export default CameraSC;
const styles = StyleSheet.create({
  container: {
    margin: 20,
  },
  line: {
    width: 50,
    height: 5,
    borderRadius: "5px",
    backgroundColor: "steelblue",
  },

  pageTitle: {
    textAlign: "left",
    fontSize: 30,
    fontWeight: "bold",
  },
  box: {
    width: 320,
    height: "auto",
    rounding: "round",
    backgroundColor: "snow",
    alignSelf: "center",
    paddingTop: 10,
    marginTop: 50,
    paddingHorizontal: 30,
    borderRadius: "5px",
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 4 },
  },
  title: {
    textAlign: "left",
    fontSize: 20,
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  button: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: "steelblue",
    marginLeft: 70,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
  },
});
