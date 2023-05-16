import { Text, View, } from "react-native";
import React, { useEffect } from "react";
import { HStack, Center, Box, Slide, CheckIcon } from "native-base";


const ConfirmMsgComponent = ({ action, open }) => {
    const [isOpen, setIsOpen] = React.useState(open);
    return <Center>
        {open === true ?
            useEffect(() => {
                setTimeout(() => {
                    setIsOpen(!isOpen)
                }, 10000)
            }, []) : <View></View>}

        {isOpen === true ?
            <Center>
                <Slide in={isOpen} placement="top">
                    <Box w="85%" bgColor={"emerald.100"} h={"55px"} alignItems="center" margin={"35px"} padding={"15px"} borderRadius="20px">
                        <HStack space={2}>
                            <CheckIcon size="4" color="emerald.600" mt="1" />
                            <Text color="emerald.600" textAlign="center" fontWeight="medium">{action}</Text>
                        </HStack>
                    </Box>
                </Slide>
            </Center> : <View></View>}
    </Center>
};
