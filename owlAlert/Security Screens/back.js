// import { React, View } from "react";
// import { useNavigation } from "@react-navigation/native";
// import * as Notifications from "expo-notifications";
// import {
//     NativeBaseProvider,
//     Box,
//     Center,
//     Image,
//     Stack,
//     Input,
//     InputGroup,
//     InputLeftAddon,
//     Heading,
//     Button,
//     Checkbox,
//     FormControl,
//     VStack, HStack, Text, Alert, Collapse
// } from "native-base";
// function LoginPage() {
//     return (
//         <NativeBaseProvider>
//             <Center my="auto">
//                 <Text>Moew</Text>
//             </Center>
//         </NativeBaseProvider>
//     );
// }

// export default LoginPage;





// Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//         shouldShowAlert: true,
//         shouldPlaySound: false,
//         shouldSetBadge: false,
//     }),
// });

// export default function App() {
//     const [expoPushToken, setExpoPushToken] = useState('');
//     const [notification, setNotification] = useState(false);
//     const notificationListener = useRef();
//     const responseListener = useRef();

//     useEffect(() => {
//         registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

//         notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
//             setNotification(notification);
//         });
//     }, []);

//     return (
//         <View
//             style={{
//                 flex: 1,
//                 alignItems: 'center',
//                 justifyContent: 'space-around',
//             }}>
//             <Text>Your expo push token: {expoPushToken}</Text>
//             <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//                 <Text>Title: {notification && notification.request.content.title} </Text>
//                 <Text>Body: {notification && notification.request.content.body}</Text>
//                 <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
//             </View>
//             <Button
//                 title="Press to schedule a notification"
//                 onPress={async () => {
//                     await schedulePushNotification();
//                 }}
//             />
//         </View>
//     );
// }

// async function schedulePushNotification() {
//     await Notifications.scheduleNotificationAsync({
//         content: {
//             title: "You've got mail! 📬",
//             body: 'Here is the notification body',
//             data: { data: 'goes here' },
//         },
//         trigger: { seconds: 2 },
//     });
// }

// async function registerForPushNotificationsAsync() {
//     let token;
//     token = (await Notifications.getExpoPushTokenAsync()).data;
//     console.log(token);
//     return token;
// }


import { AppState, Text, View, Button, style } from 'react-native';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Notifications from "expo-notifications";
import React, { useState, useEffect, useRef } from 'react';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

async function registerForPushNotificationsAsync() {
    let token;
    token = (await Notifications.getExpoPushTokenAsync()).data;
    return token;
}

export default function BackgroundFetchScreen() {
    const [isRegistered, setIsRegistered] = React.useState(false);
    const [status, setStatus] = React.useState(null);
    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    const notificationListener = useRef();
    const [test, setTest] = useState("1")
    const [title, setTitle] = useState(false)

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                //     setNotification(notification);
                // console.log( notification.request)
                // console.log( notification)
                console.log('App has come to the foreground!');
            }

            appState.current = nextAppState;
            setAppStateVisible(appState.current);
            console.log('AppState', appState.current);
            setTest("2")
            // setNotification(notification);
            console.log(notification && notification.request.content.title)
            
        });
        return () => {
            subscription.remove();
        };
    }, []);


    const BACKGROUND_FETCH_TASK = 'background-fetch';

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
             setNotification(notification);
        //     console.log(notification.request)
         setTitle(notification)

         });


    }, []);

    TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
        const now = Date.now();

        console.log(`Got background fetch call at date: ${new Date(now).toISOString()}`);
        // // const [data, setData] = useState(null);
        // // useEffect(() => {
        // //     fetch('http://10.120.1.203:5000/test')
        // //         .then(response => response.json())
        // //         .then(data => setData(data));
        // // }, []);
        // //     console.log(data["test"])

        setNotification(notification);
        console.log(notification.request)
        setTest("2")
        console.log("after set notification")
        return BackgroundFetch.BackgroundFetchResult.NewData;
    });

    async function registerBackgroundFetchAsync() {
        console.log("register a task")
        // loop 
        return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
            minimumInterval: 1,
            stopOnTerminate: false, // android only,
            startOnBoot: true, // android only
        });
    }

    async function unregisterBackgroundFetchAsync() {
        return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    }

    React.useEffect(() => {
        checkStatusAsync();
    }, []);

    const checkStatusAsync = async () => {
        const status = await BackgroundFetch.getStatusAsync();
        const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK);
        setStatus(status);
        setIsRegistered(isRegistered);
    };

    const toggleFetchTask = async () => {
        if (isRegistered) {
            await unregisterBackgroundFetchAsync();
        } else {
            await registerBackgroundFetchAsync();
        }

        checkStatusAsync();
    };

    async function schedulePushNotification() {
        console.log("schedule notification")
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "yes?",
                body: 'Here is the notification body',
                data: { data: 'goes here' },
            },
            trigger: { seconds: 3 },
        });
    }

    return (
        <View >
            <View  >
                <Text></Text>
                <Text></Text>
                <Text>
                    Background fetch status:{' '}
                    <Text >
                        {status && BackgroundFetch.BackgroundFetchStatus[status]}
                    </Text>
                </Text>
                <Text>
                </Text>
                <Text>
                    Background fetch task name:{' '}
                    <Text >
                        {isRegistered ? BACKGROUND_FETCH_TASK : 'Not registered yet!'}
                    </Text>
                </Text>
            </View>
            <View ></View>
            <Button
                title={isRegistered ? 'Unregister BackgroundFetch task' : 'Register BackgroundFetch task'}
                onPress={toggleFetchTask}
            />
            <Text>Your expo push token: {expoPushToken}</Text>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text>Title: {notification && notification.request.content.title} </Text>
                <Text>Body: {notification && notification.request.content.body}</Text>
                <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
                <Text>Current state is: {appStateVisible}</Text>
                <Text>test is : {test}</Text>
                <Text>title is : {title && title.request.content.title}</Text>


            </View>
            <Button
                title="Press to schedule a notification"
                onPress={async () => {
                    await schedulePushNotification();
                }}
            />

        </View>

    );
}
