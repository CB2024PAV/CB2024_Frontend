// screens/ChatScreen.js

import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat, Bubble, Avatar } from 'react-native-gifted-chat'
import { View, Text, StyleSheet, Image } from 'react-native';
import { BORDER_GREY } from '../assets/styles/colors'

const ChatScreen = () => {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://ibb.co/yF7wL1x',
        },
        video: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      },
    ])
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    )
  }, [])

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
