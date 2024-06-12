import React from 'react'
import { useKeepAwake } from 'expo-keep-awake';
import { View } from 'react-native'
import VideoPlayer from '../components/video-player/player'

const Videos = ({ route }: any) => {
  useKeepAwake();
  return (
    <View>
      <VideoPlayer lectureDetails={route?.params?.lectureDetails} scheduleDetails={route?.params?.scheduleDetails} isLive={false} />
    </View>
  )
}

export default Videos
