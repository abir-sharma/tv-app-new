import React from 'react'
import { useKeepAwake } from 'expo-keep-awake';
import VideoPlayer from '../components/Global/video-player/player'

const Videos = ({ route }: any) => {
  useKeepAwake();
  return (
      <VideoPlayer smallPlayer={false} lectureDetails={route?.params?.lectureDetails} scheduleDetails={route?.params?.scheduleDetails} isLive={false} />
  )
}

export default Videos
