import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import AlertBox from "../components/AlertBox";
// fetch('http://10.120.1.203:8000/api/data', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         data : "some data"
//       })
//     }).then(res => res.json()).then(data => console.log(data)).catch(err => console.log(err));

// -----------------------------------------------

class RecieveAlert extends Component {
  state = {
    data: "",
  };

  componentDidMount = () => {
    fetch("http://127.0.0.1/alertNative", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          data: responseJson,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  render() {
    return <AlertBox alertId="1" floorNo="2" CamNo="1" />;
  }
}

export default RecieveAlert;
const styles = StyleSheet.create({
  bigBlue: {
    color: "blue",
    fontWeight: "bold",
    fontSize: 50,
    backgroundColor: "#FF6666",
    alignItems: "center",
    justifyContent: "center",
  },
  red: {
    color: "red",
  },
});

// class HttpExample extends Component {
//   state = {
//     data: "",
//   };
//   componentDidMount = () => {
//     fetch("http://127.0.0.1/time", {
//       method: "GET",
//     })
//       .then((response) => response.json())
//       .then((responseJson) => {
//         console.log(responseJson);
//         this.setState({
//           data: responseJson,
//         });
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   };
//   render() {
//     return (
//       <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
//         <Text style={styles.bigBlue}>{this.state.data.time}</Text>
//       </View>
//     );
//   }
// }

// export default HttpExample;
