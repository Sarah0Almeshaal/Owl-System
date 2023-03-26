import React, { useState, useEffect } from "react";
import { DataTable, IconButton, MD3Colors } from "react-native-paper";
import { View, TouchableOpacity } from "react-native";

const CameraList = () => {
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = useState(6);
  const from = page * numberOfItemsPerPage;
  const [items, setItems] = useState([]);
  const to = Math.min((page + 1) * numberOfItemsPerPage, items.length);

  const flaskAPI = "http://192.168.0.111:5000/getCamerasData";

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

  const tableRoww = (item) => (
    <DataTable.Row>
      <DataTable.Cell>{item.id}</DataTable.Cell>
      <DataTable.Cell>{item.floor}</DataTable.Cell>
      <DataTable.Cell style={{ flex: 0.5 }}>
        {
          <TouchableOpacity>
            <IconButton
              icon="delete-forever"
              iconColor={MD3Colors.error50}
              size={30}
              onPress={() => console.log("Delete is Pressed")}
            />
          </TouchableOpacity>
        }
      </DataTable.Cell>
    </DataTable.Row>
  );

  return (
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
  );
};

export default CameraList;
