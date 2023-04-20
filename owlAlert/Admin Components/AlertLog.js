import React, { useState, useEffect } from "react";
import { DataTable, IconButton, MD3Colors } from "react-native-paper";
import { View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const AlertLog = () => {
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = useState(6);
  const from = page * numberOfItemsPerPage;
  const [items, setItems] = useState([]);
  const to = Math.min((page + 1) * numberOfItemsPerPage, items.length);
  const navigation = useNavigation();

  const flaskAPI = "http://10.10.1.203:5000/getAlertLog";

  useEffect(() => {
    getAlertLogData();
  }, []);

  const getAlertLogData = () => {
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
        var data = res.AlertLog;
        setItems(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);

  const tableRow = (item) => (
    <DataTable.Row key={item.id}>
      <DataTable.Cell>{item.id}</DataTable.Cell>
      <DataTable.Cell>{item.date}</DataTable.Cell>
      <DataTable.Cell style={{ justifyContent: "center" }}>
        {item.status}
      </DataTable.Cell>
      <DataTable.Cell style={{ flex: 0.5 }}>
        {
          <TouchableOpacity>
            <IconButton
              icon="eye"
              iconColor={MD3Colors.error0}
              size={20}
              onPress={() => navigation.navigate("alertDetails", {alertNum: item.id})}/>
          </TouchableOpacity>
        }
      </DataTable.Cell>
    </DataTable.Row>
  );

  return (
    <View>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Alert ID</DataTable.Title>
          <DataTable.Title style={{ paddingRight: 10 }}>
            Time Stamp
          </DataTable.Title>
          <DataTable.Title style={{ paddingRight: 9 }}>Status</DataTable.Title>
        </DataTable.Header>
        {items
          .slice(
            page * numberOfItemsPerPage,
            page * numberOfItemsPerPage + numberOfItemsPerPage
          )
          .map((row) => tableRow(row))}

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

export default AlertLog;
