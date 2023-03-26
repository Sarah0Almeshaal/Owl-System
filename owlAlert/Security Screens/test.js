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
  VStack,
  HStack,
  Text,
  Alert,
  Collapse,
  WarningOutlineIcon,
} from "native-base";
import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

async function idSession(id) {
  await AsyncStorage.setItem("id", JSON.stringify(id));
}

function LoginPage() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [idErrors, setIdErrors] = useState({});
  const [passwordError, setPasswordError] = useState({});
  const [show, setShow] = useState(false);

  async function login(id, password, navigation) {
    let token = (await Notifications.getExpoPushTokenAsync()).data;
    await AsyncStorage.setItem(
      "ip",
      JSON.stringify("http://10.120.1.203:5000")
    );

    fetch(
      String(await AsyncStorage.getItem("ip")).replace(/["]/g, "") + "/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          password: password,
          token: token,
        }),
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data["result"] === "Security Guard") {
          idSession(id);
          navigation.navigate("Alerts");
        } else if (data["result"] === "Admin") {
          idSession(id);
          navigation.navigate("MainScreen");
        } else {
          setShow(true);
        }
      })
      .catch((err) => console.log(err));
  }

  function validate() {
    if (validateId() === true) {
      setShow(false);
      login(id, password, navigation);
    }
  }

  function validateId() {
    let isValid = true;
    if (id === "") {
      setIdErrors({
        id: "ID is required",
      });
      isValid = false;
    } else {
      setIdErrors({
        id: "",
      });
    }
    if (password === "") {
      setPasswordError({
        password: "Password is required",
      });
      isValid = false;
    } else {
      setPasswordError({
        password: "",
      });
    }
    return isValid;
  }

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
            mb={"0"}
          />
          <Heading fontSize="3xl" bold>
            Login
          </Heading>
        </Center>
        <Collapse isOpen={show}>
          <Alert
            mx="auto"
            mt="20px"
            width="290px"
            status="error"
            colorScheme="error"
          >
            <VStack space={2} flexShrink={1} w="100%">
              <HStack
                flexShrink={1}
                space={2}
                alignItems="center"
                justifyContent="space-between"
              >
                <HStack flexShrink={1} space={2} alignItems="center">
                  <Alert.Icon />
                  <Text fontSize="md" fontWeight="medium" color="coolGray.800">
                    Incorrect ID or password!
                  </Text>
                </HStack>
              </HStack>
            </VStack>
          </Alert>
        </Collapse>

        <FormControl isRequired isInvalid={"id" in idErrors}>
          <Stack alignItems="center">
            <InputGroup mt="30px">
              <InputLeftAddon
                borderLeftRadius="20"
                borderWidth="1"
                borderColor="black"
                children={"ID"}
                w="100px"
                fontSize="12"
              />

              <Input
                w="200px"
                placeholder="Enter your ID"
                borderWidth="1"
                fontSize="12"
                variant="rounded"
                borderColor="black"
                borderLeftWidth="0.5"
                maxLength={4}
                keyboardType="number-pad"
                onChangeText={(id) => setId(id)}
              />
            </InputGroup>
            <FormControl.ErrorMessage
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              {idErrors.id}
            </FormControl.ErrorMessage>
          </Stack>
        </FormControl>

        <FormControl isRequired isInvalid={"password" in passwordError}>
          <Center>
            <Stack alignItems="center">
              <InputGroup w="80%" mt="30px">
                <InputLeftAddon
                  borderLeftRadius="20"
                  borderWidth="1"
                  borderColor="black"
                  children={"Password"}
                  w="100px"
                  fontSize="12"
                />

                <Input
                  w="200px"
                  placeholder="********"
                  borderWidth="1"
                  fontSize="12"
                  variant="rounded"
                  borderColor="black"
                  placeholderTextColor="blue"
                  secureTextEntry={true}
                  borderLeftWidth="0.5"
                  onChangeText={(password) => setPassword(password)}
                />
              </InputGroup>
              <FormControl.ErrorMessage
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                {passwordError.password}
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
            onPress={() => validate()}
          >
            Login
          </Button>
        </Center>
      </Box>
    </NativeBaseProvider>
  );
}

export default LoginPage;