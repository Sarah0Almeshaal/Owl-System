import io from "socket.io-client";

const socket = io("http://127.0.0.1:5000");
socket.on("connect", (data) => {
  console.log(data); // true
});

socket.on("disconnect", () => {
  console.log("disconnect client");
});

socket.io.on("error", (error) => {
  console.log(error);
});

socket.io.on("ping", () => {
  console.log("ping?");
});
