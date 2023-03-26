// import React, { useState, useEffect } from "react";
// import { DataTable, IconButton, MD3Colors } from "react-native-paper";
// import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";

// // const tableData = [
// //   ["ID", "Floor", ""],
// //   ["1", "4", "trashIcon"],
// //   ["2", "5", "trashIcon"],
// //   ["3", "5", "trashIcon"],
// //   ["4", "6", "trashIcon"],
// //   ["5", "7", "trashIcon"],
// //   ["6", "7", "trashIcon"],
// //   ["7", "7", "trashIcon"],
// //   ["8", "7", "trashIcon"],
// // ];

// const CameraList = () => {
//   const [page, setPage] = useState(0);
//   const [numberOfItemsPerPage, onItemsPerPageChange] = useState(2);
//   const from = page * numberOfItemsPerPage;
//   const [items, setItems] = useState([]);
//   const to = Math.min((page + 1) * numberOfItemsPerPage, items.length);

//   const flaskAPI = "http://10.120.1.203:5000/getCamerasData";

//   useEffect(() => {
//     getCamerasData();
//   }, []);

//   const getCamerasData = () => {
//     fetch(flaskAPI, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     })
//       .then((res) => {
//         return res.json();
//       })
//       .then((res) => {
//         var data = res.cameraList;
//         setItems(data);
//       })
//       .catch((err) => {
//         console.error(err);
//       });
//   };

//   useEffect(() => {
//     setPage(0);
//   }, [numberOfItemsPerPage]);
//   return (
//     <View>
//       <DataTable>
//         <DataTable.Header>
//           <DataTable.Title>ID</DataTable.Title>
//           <DataTable.Title style={{ paddingRight: 60 }}>Floor</DataTable.Title>
//         </DataTable.Header>
//         {items.map((data) => (
//           <DataTable.Row key={data.id}>
//             <DataTable.Cell>{data.id}</DataTable.Cell>
//             <DataTable.Cell>{data.floor}</DataTable.Cell>
//             <DataTable.Cell style={{ flex: 0.5 }}>
//               {
//                 <TouchableOpacity>
//                   <IconButton
//                     icon="delete-forever"
//                     iconColor={MD3Colors.error50}
//                     size={30}
//                     onPress={() => console.log("Delete is Pressed")}
//                   />
//                 </TouchableOpacity>
//               }
//             </DataTable.Cell>
//           </DataTable.Row>
//         ))}
//         <DataTable.Pagination
//           page={page}
//           numberOfPages={Math.ceil(items.length / numberOfItemsPerPage)}
//           onPageChange={(page) => setPage(page)}
//           label={`${from + 1}-${to} of ${items.length}`}
//           numberOfItemsPerPage={numberOfItemsPerPage}
//           onItemsPerPageChange={onItemsPerPageChange}
//         />
//       </DataTable>
//     </View>
//   );
// };

// export default CameraList;


import { React, useState, useEffect } from 'react';
import {
  DataTable, PaperProvider
} from 'react-native-paper';
import { View } from 'react-native'
const numberOfItemsPerPageList = [2, 3, 4];

const items = [
  {
    key: 1,
    name: 'Page 1',
  },
  {
    key: 2,
    name: 'Page 2',
  },
  {
    key: 3,
    name: 'Page 3',
  },
];

const MyComponent = () => {
  const [page, setPage] = useState(0);
  const [numberOfItemsPerPage, onItemsPerPageChange] = useState(1);
  const from = page * numberOfItemsPerPage;
  const to = Math.min((page + 1) * numberOfItemsPerPage, items.length);

  useEffect(() => {
    setPage(0);
  }, [numberOfItemsPerPage]);




  return (
    <DataTable>
      <DataTable.Header>
        <DataTable.Title>Dessert</DataTable.Title>
        <DataTable.Title numeric>Calories</DataTable.Title>
      </DataTable.Header>

      {items.map((data) => (
        <DataTable.Row background={"#000000"} key={data.key}>
          <DataTable.Cell>{data.key}</DataTable.Cell>
          <DataTable.Cell>{data.name}</DataTable.Cell>
        </DataTable.Row>
      ))}
      {/* <DataTable.Row>
        <DataTable.Cell>Frozen yogurt</DataTable.Cell>
        <DataTable.Cell numeric>159</DataTable.Cell>
        <DataTable.Cell numeric>6.0</DataTable.Cell>
      </DataTable.Row>

      <DataTable.Row>
        <DataTable.Cell>Ice cream sandwich</DataTable.Cell>
        <DataTable.Cell numeric>237</DataTable.Cell>
        <DataTable.Cell numeric>8.0</DataTable.Cell>
      </DataTable.Row> */}


      {/* <DataTable.Row>
        <DataTable.Cell>Frozen yogurt</DataTable.Cell>
        <DataTable.Cell numeric>159</DataTable.Cell>
        <DataTable.Cell numeric>6.0</DataTable.Cell>
      </DataTable.Row>

      <DataTable.Row>
        <DataTable.Cell>Ice cream sandwich</DataTable.Cell>
        <DataTable.Cell numeric>237</DataTable.Cell>
        <DataTable.Cell numeric>8.0</DataTable.Cell>
      </DataTable.Row>  */}

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(items.length / numberOfItemsPerPage)}
        onPageChange={page => setPage(page)}
        label={`${from + 1}-${to} of ${items.length}`}
        showFastPaginationControls={false}
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={1}
        onItemsPerPageChange={onItemsPerPageChange}
        selectPageDropdownLabel={'Rows per page'}
      />
    </DataTable>
  );
}

export default MyComponent;

