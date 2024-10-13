import React from 'react';
import { View, StyleSheet } from 'react-native';
import Video from 'react-native-video';

const VideoScreen = ({ route }) => {
  const { url } = route.params;
  return (
    <View style={styles.container}>
      <Video
        source={{ uri: url }}
        style={styles.video}
        controls={true}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: 250,
  },
});

export default VideoScreen;