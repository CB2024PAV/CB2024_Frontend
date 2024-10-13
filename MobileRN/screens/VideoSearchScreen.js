// screens/VideoSearchScreen.js

import React, { useState, useCallback, useEffect } from "react";
import {
  GiftedChat,
  Bubble,
  Avatar,
  Actions,
  ActionsProps,
} from "react-native-gifted-chat";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { BORDER_GREY } from "../assets/styles/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { myConfig } from "../config";
import Video from "react-native-video";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
// import { useCameraPermissions } from "expo-image-picker";
import * as ImagePicker from "expo-image-picker";
import mime from "mime";

const VideoSearchScreen = () => {
  const [userToken, setUserToken] = useState("Bob");
  const [messages, setMessages] = useState([]);

  const navigation = useNavigation();

  const handleUrlClick = (msg) => {
    navigation.navigate("VideoScreen", {
      url: msg,
    });
  };

  const sendImageUrlToBackend = async (result) => {
    const imgUri = result.assets[0].uri;
    const newImageUri = "file:///" + imgUri.split("file:/").join("");

    if (!result.canceled) {
      try {
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [
            {
              _id: Math.round(Math.random() * 1000000),
              //   text: 'Hello developer',
              image: newImageUri,
              createdAt: new Date(),
              user: {
                _id: 1,
                // name: 'React Native',
                // avatar: 'https://placeimg.com/140/140/any',
              },
            },
          ])
        );
        const formData = new FormData();
        formData.append("image", {
          uri: newImageUri,
          type: mime.getType(newImageUri),
          name: newImageUri.split("/").pop(),
        });

        const response = await fetch(
          `${myConfig.backendApiUrl}/search_by_image`,
          {
            method: "POST",
            body: formData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const resultImg = await response.json();
        console.log("res new on send image data: ", resultImg);
        let formattedMessage = "";
        if (resultImg.data && resultImg.success) {
          formattedMessage = formatMessages(resultImg.data);
          // setMessages(formattedMessage);
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, formattedMessage)
          );
        }
      } catch (error) {
        Alert.alert("Video not found!", "Search again");
        console.error("Error sending or fetching messages:", error);
      }
    }
  };

  const handlePickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      //   allowsEditing: true,
      //   aspect: [4, 3],
      //   quality: 1,
    });

    console.log(result.assets[0].uri);
    sendImageUrlToBackend(result);
  };

//   useEffect(() => {
//     setMessages([
//       {
//         _id: 1,
//         text: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
//         // video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
//         createdAt: new Date(),
//         audio: "",
//         user: {
//           _id: 2,
//           name: 'React Native',
//           avatar: 'https://placeimg.com/140/140/any',
//         },
//       },
//     ])
//   }, []);

  const formatMessages = (fetchedMessages) => {
    return [
      {
        _id: new Date(),
        text: fetchedMessages,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: "Trusty",
          avatar: "https://ibb.co/yF7wL1x", // Optional
        },
      },
    ];
  };

  const fetchWelcomeMessage = async (token) => {
    try {
      const response = await fetch(
        `${myConfig.backendApiUrl}/get_good_morning_msg?user=${
          token || userToken
        }`,
        {
          method: "GET",
        }
      );
      const result = await response.json();
      let formattedMessage = "";
      if (result.data && result.success) {
        formattedMessage = formatMessages(result.data);
        setMessages(formattedMessage);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // const onSend = useCallback((messages = []) => {
  //   setMessages(previousMessages =>
  //     GiftedChat.append(previousMessages, messages),
  //   )
  // }, [])

  const handleTakePhoto = async () => {

    let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        //   allowsEditing: true,
        //   aspect: [4, 3],
        //   quality: 1,
      });
  
      console.log(result.assets[0].uri);
      sendImageUrlToBackend(result);
  };

  const onSend = useCallback(async (newMessages = []) => {
    const sentMessage = newMessages[0];
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
    console.log("sent message", sentMessage);
    try {
      console.log(
        `${myConfig.backendApiUrl}/search_by_text?user=${userToken}&query=${sentMessage.text}`
      );
      const response = await fetch(
        `${myConfig.backendApiUrl}/search_by_image?user=${userToken || "Bob"}`,
        {
          method: "GET",
        }
      );

      const result = await response.json();
      console.log("res new on send: ", result);
      let formattedMessage = "";
      if (result.data && result.success) {
        formattedMessage = formatMessages(result.data);
        // setMessages(formattedMessage);
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, formattedMessage)
        );
      }
    } catch (error) {
      Alert.alert("Video not found!", "Search again");
      console.error("Error sending or fetching messages:", error);
    }
  }, []);


  const requestPermissions = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      console.log('status camera', status);
      if(status === 'granted') {
        handleTakePhoto()
      } else {
        Alert.alert('Permissin not granted', 'Please grant permission to access camera')
      }
    //   setHasCameraPermission(status === 'granted');
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleAttachment = () => {
    Alert.alert("Attach Image", "Choose an option", [
      { text: "Cancel", style: "cancel" },
      { text: "Choose from Library", onPress: handlePickImage },
      { text: "Take Photo", onPress: requestPermissions },
    ]);
  };



  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      placeholder="Search Videos using Images or Text" 
      user={{
        _id: 1,
      }}
      listViewProps={{
        style: {
        //   backgroundColor: 'lightblue',
        },
      }}
      renderActions={(props) => {
        return (
          <Actions
            {...props}
            //   options={{
            //     ['Send Image']: handleChoosePhoto,
            //   }}
            icon={() => (
              <TouchableOpacity onPress={handleAttachment}>
                <Icon name={"image-outline"} size={28} color={"blue"} />
              </TouchableOpacity>
            )}
            onSend={(args) => console.log(args)}
          />
        );
      }}
      renderAvatar={(props) => {
        const { user } = props.currentMessage;
        if (user._id == 2) {
          // console.log( user )
          return (
            <Image
              source={require("../assets/images/robot.png")}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          );
        }
        return null;
      }}
      renderBubble={(props) => {
        // console.log(props)
        return (
          <Bubble
            {...props}
            renderMessageText={(props) => {
              // console.log(props.currentMessage.text)
              return (
                <>
                  {props.currentMessage.user._id === 2 ? (
                    // <TouchableOpacity style={{ padding: 10 }} onPress={() => handleUrlClick(props.currentMessage.text)}>
                    //     <Text style={ styles.urlText }>
                    //         {props.currentMessage.text}
                    //     </Text>
                    // </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => handleUrlClick(props.currentMessage.text)}
                    >
                      <Icon name={"play"} size={30} color="white" />
                      <Text style={{ color: "white" }}>Click to Play</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={{ padding: 10 }}>
                      <Text style={{ color: "white" }}>
                        {props.currentMessage.text}
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              );
            }}
            textStyle={{
              right: {
                // color: 'yellow',
              },
            }}
            wrapperStyle={{
              left: {
                // backgroundColor: BORDER_GREY,
              },
            }}
          />
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  videoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 160,
    width: 160,
    backgroundColor: "red",
  },
  urlText: {
    color: "blue",
    textDecorationLine: "underline",
    fontFamily: "Arial", // Or any other web-like font
  },
  button: {
    // width: width * 0.9, // 90% of screen width
    backgroundColor: "#d41c1c",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default VideoSearchScreen;
