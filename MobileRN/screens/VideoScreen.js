import React from 'react';
import { View, StyleSheet } from 'react-native';
import Video from 'react-native-video';

const App = () => {
  return (
    <View style={styles.container}>
      <Video
        source={{ uri: 'https://deuqpmn4rs7j5.cloudfront.net/670b05947c228a5c40d6b2f8/670b065365cb82908edf5cf5/stream/f3cdeb3b-e3e7-4963-91f2-5fc4560c2a2a.m3u8' }}
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

export default App;