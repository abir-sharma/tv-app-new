import React from 'react'
import { Video } from 'expo-av'
import { View } from 'react-native'

const MP4Player = ({ route }: any) => {
  const uri = route?.params?.videoUrl;
  console.log('Video URI', uri);

  return (
    <View style={{ flex: 1 }}>
      <Video
        source={{ uri: uri }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        shouldPlay
        isLooping
        style={{ width: '100%', height: '100%' }}
        useNativeControls
      />
    </View>
  )
}

export default MP4Player
