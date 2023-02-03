import { React, useState } from "react";
import {
  NativeBaseProvider,
  Box,
  Center,
  Image,
  Stack,
  Input,
  InputGroup,
  InputLeftAddon,
  Heading,
  Button,
  Checkbox,
  FormControl,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
async function setId(id) {
  await AsyncStorage.setItem("id", JSON.stringify(id));
}

async function login(id, password, navigation) {
  let token = (await Notifications.getExpoPushTokenAsync()).data;

  fetch("http://192.168.1.25:5000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      password: password,
      token: token,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data["result"] === 1) {
        setId(id);
        console.log("\n HELOOOO IM HERE");
        navigation.navigate("Alerts");
      } else {
      }
    })
    .catch((err) => console.log(err));
}

function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const breakpoints = {
    base: 0,
    sm: 480,
    md: 768,
    lg: 992,
    xl: 1280,
  };
  const fontSize = {
    base: "md",
    md: "lg",
    lg: "xl",
  };

  const [errors, setErrors] = useState({});

  const validate = () => {
    validateId;
    if (validateId === true && validatePassword === true) {
      login(id, password, navigation);
    }
  };

  const validateId = () => {
    let isValid = true;
    if (id === "") {
      setErrors({
        ...errors,
        error: "ID is required",
      });
      isValid = false;
    }
    return isValid;
  };

  const validatePassword = () => {
    if (password === undefined) {
      setErrors({
        ...errors,
        password: "Password is required",
      });
      return false;
    }
  };

  return (
    <NativeBaseProvider>
      <Box bg="#FBFBFB" height="100%">
        <Center>
          <Image
            source={require("../assets/owlsys-logo.png")}
            alt="Owl System Logo"
            width={170}
            height={170}
            my="50px"
          />

          <Heading fontSize="3xl" bold>
            Login
          </Heading>
        </Center>

        <FormControl isRequired isInvalid={"name" in errors}>
          <Center>
            <Stack alignItems="center">
              <InputGroup w="100%" mt="60px">
                <InputLeftAddon
                  borderLeftRadius="20"
                  borderWidth="1"
                  borderColor="black"
                  children={"ID"}
                  w="20%"
                />

                <Input
                  w="60%"
                  placeholder="Enter your ID"
                  borderWidth="1"
                  fontSize="md"
                  variant="rounded"
                  borderColor="black"
                  borderRightColor="#FFFFFF"
                  borderLeftWidth="0.5"
                  maxLength={4}
                  onChangeText={(id) => setId(id)}
                />
              </InputGroup>
              <FormControl.ErrorMessage>{errors.name}</FormControl.ErrorMessage>
            </Stack>
          </Center>
        </FormControl>

        <FormControl isRequired isInvalid={"password" in errors}>
          <Center>
            <Stack alignItems="center">
              <InputGroup w="100%" mt="30px">
                <InputLeftAddon
                  borderLeftRadius="20"
                  borderWidth="1"
                  borderColor="black"
                  children={"Password"}
                  w="20%"
                />

                <Input
                  w="60%"
                  placeholder="********"
                  borderWidth="1"
                  fontSize="md"
                  variant="rounded"
                  borderColor="black"
                  placeholderTextColor="blue"
                  secureTextEntry={true}
                  borderLeftWidth="0.5"
                  onChangeText={(password) => setPassword(password)}
                />
              </InputGroup>
              <FormControl.ErrorMessage>
                {errors.password}
              </FormControl.ErrorMessage>
            </Stack>
          </Center>
        </FormControl>

        <Checkbox
          value="one"
          ml="60px"
          my="60px"
          borderColor={"#808080"}
          borderWidth="1"
        >
          Remember me
        </Checkbox>
        <Center>
          <Button
            size="md"
            w="230px"
            rounded="10"
            bg={"#28428C"}
            onPress={() => login(id, password, navigation)}
          >
            Login
          </Button>
          {/* 
          <Button size="md" w="230px" rounded="10"
            bg={"#28428C"} onPress={validateId}>Login</Button> */}
        </Center>
      </Box>
    </NativeBaseProvider>
  );
}

export default LoginPage;
