// screens/ChatScreen.js

import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, Bubble, Avatar } from 'react-native-gifted-chat'
import { View, Text, StyleSheet, Image } from 'react-native';
import { BORDER_GREY } from '../assets/styles/colors'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { myConfig } from '../config'

const ChatScreen = () => {
  const [userToken, setUserToken] = useState('Bob');
  const [messages, setMessages] = useState([])

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
      // Send message to backend
      // const response = await fetch('https://your-api-endpoint.com/chat/send', {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     text: sentMessage.text,
      //     userId: 1,  // Adjust with your user ID
      //   }),
      // });
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
        return (
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
