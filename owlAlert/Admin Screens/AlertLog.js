import React, { useState, useEffect } from "react";
import { DataTable, IconButton, MD3Colors } from "react-native-paper";
import { View, TouchableOpacity, Text } from "react-native";

const AlertLog = () => {
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = useState(1);
  const from = page * numberOfItemsPerPage;
  const [items, setItems] = useState([]);
  const to = Math.min((page + 1) * numberOfItemsPerPage, items.length);

  const flaskAPI = "http://10.120.1.203:5000/getAlertLog";

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

  const tableRoww = (item) => (
    <DataTable.Row style={{margin: 10}}>
      {/* <DataTable.Cell>{item.id}</DataTable.Cell> */}
      <DataTable.Cell><Text>{item.date}{"\n"}{item.time}</Text>
      </DataTable.Cell>
      {/* <DataTable.Cell>{item.status}</DataTable.Cell> */}
      <DataTable.Cell style={{ flex: 0.5 }}>
        {/* {
          <TouchableOpacity>
            <IconButton
              icon="eye"
              iconColor={MD3Colors.error0}
              size={20}
              onPress={() => console.log("Eye is Pressed")}
            />
          </TouchableOpacity>
        } */}
      </DataTable.Cell>
    </DataTable.Row>
  );

  return (
    <View>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Alert ID</DataTable.Title>
          <DataTable.Title>Time Stamp</DataTable.Title>
          {/* <DataTable.Title>Status</DataTable.Title> */}
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

export default AlertLog;
