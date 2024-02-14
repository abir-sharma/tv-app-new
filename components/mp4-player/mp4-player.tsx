import React, { useState } from 'react'
import { Video } from 'expo-av'
import { Text, View, ActivityIndicator } from 'react-native'

const MP4Player = ({ route }: any) => {
  const uri = route?.params?.videoUrl;
  console.log('Video URI', uri);

  const [showLoader, setShowLoader] = useState<boolean>(true);

  return (
    <View style={{ flex: 1 }}>
      {showLoader && <View style={{ position: 'absolute', left: 0, top: 0, zIndex: 10, height: '100%', width: '100%', backgroundColor: 'white', alignContent: 'center', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={"#000000"} size='large' />
      </View>}
      <Video
        source={{ uri: uri }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        shouldPlay
        isLooping
        style={{ width: '100%', height: '100%' }}
        useNativeControls
        onLoadStart={() => {
          console.log('Video loading...');
          setShowLoader(true);
        }}
        onLoad={() => {
          console.log('Video loaded...')
          setShowLoader(false);
        }}
      />
    </View>
  )
}

export default MP4Player
