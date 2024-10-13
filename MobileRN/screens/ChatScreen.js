// screens/ChatScreen.js

import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, Bubble, Avatar } from 'react-native-gifted-chat'
import { View, Text, StyleSheet, Image } from 'react-native';
import { BORDER_GREY } from '../assets/styles/colors'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { myConfig } from '../config'
import Icon from "react-native-vector-icons/Ionicons";
import * as Speech from 'expo-speech';
import { TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const ChatScreen = () => {
  const [userToken, setUserToken] = useState('Bob');
  const [messages, setMessages] = useState([])
  const [onSpeak, setOnSpeak] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        Speech.stop()
      };
    }, [])
  )

  useEffect(() => {
    
    const bootstrapAsync = async () => {
      let token;
      try {
        token = await AsyncStorage.getItem('userToken');
        fetchWelcomeMessage(token || 'Bob')
        console.log("userToken: ", userToken)
      } catch (e) {
        console.error('Failed to get user token:', e);
      }
      setUserToken(token);
      // setIsLoading(false);
    };
    bootstrapAsync();
    
  }, [])

  const formatMessages = (fetchedMessages) => {
    return ([
      {
        _id: new Date(),
        text: fetchedMessages,
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Trusty',
          avatar: 'https://ibb.co/yF7wL1x', // Optional
        },
      }
    ])
  };

  const fetchWelcomeMessage = async (token) => {
    try {

      const response = await fetch(`${myConfig.backendApiUrl}/get_good_morning_msg?user=${token || userToken}`, {
        method: 'GET',
      });
      const result = await response.json();
      let formattedMessage = ''
      // console.log(result)
      if (result.data && result.success) {
        formattedMessage = formatMessages(result.data);
        setMessages(formattedMessage);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // const onSend = useCallback((messages = []) => {
  //   setMessages(previousMessages =>
  //     GiftedChat.append(previousMessages, messages),
  //   )
  // }, [])


  const onSend = useCallback(async (newMessages = []) => {
    const sentMessage = newMessages[0];
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages),
    )
    console.log('sent message', sentMessage)
    try {
      console.log(`${myConfig.backendApiUrl}/get_reply?user=${userToken}&query=${sentMessage.text}`)
      const response = await fetch(`${myConfig.backendApiUrl}/get_reply?user=${userToken || 'Bob'}&query=${sentMessage.text}`, {
        method: 'GET',
      });

      const result = await response.json();
      console.log('res new on send: ', result)
      let formattedMessage = ''
      if (result.data && result.success) {
        formattedMessage = formatMessages(result.data);
        // setMessages(formattedMessage);
        setMessages(previousMessages => GiftedChat.append(previousMessages, formattedMessage))
      }
    } catch (error) {
      console.error('Error sending or fetching messages:', error);
    }
  }, []);

  const onSpeakPress = async(bubbleData) => {
    console.log("bubble: ", bubbleData|| 'not there')
    setOnSpeak(true)
    if (onSpeak) {
      setOnSpeak(false)
      Speech.stop()
    } else {
      Speech.speak(bubbleData?.currentMessage?.text || '.');
    }
  }


  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: 1,
      }}
      renderAvatar={(props) => {
        const { user } = props.currentMessage;
        if (user._id == 2) {
          // console.log( user )
          return(
            <Image
              source={require('../assets/images/robot.png')}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          );
        }
        return(null);
      }}
      renderBubble={props => {
        const speechTextData =  props
        return (

          <View
            style={{ flex: 1, flexDirection: 'row'}}>
              <Bubble
                {...props}
                textStyle={{
                  right: {
                    // color: 'yellow',
                  },
                }}
                wrapperStyle={{
                  left: {
                    backgroundColor: BORDER_GREY,
                  },
                }}
              />
              { (props.currentMessage.user._id === 2)
              ? (
                <TouchableOpacity style={{backgroundColor: 'red', zIndex: 999}} onPress={() => {
                  console.log('pressing')
                  // onSpeakPress(props)
                }}>
                  <Icon name={"volume-high"} size={32} color={"blue"} style={{ marginLeft: -60 }} onPress={() => onSpeakPress(speechTextData)} />
                </TouchableOpacity>
              ): <></>
              }
            {/* <Image
              style={{
                width: 30,
                height: 30,
                marginTop: 'auto',
                bottom: 0,
              }}
              source={{
                uri:
                  'https://icons-for-free.com/iconfiles/png/512/next+reply+icon-1320165657413388724.png',
              }}
            /> */}
          </View>
        );
      }}
    />
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;
