import React from 'react'
import { View } from 'react-native'
import VideoPlayer from '../components/video-player/player'

const Videos = ({route}: any) => {
  // console.log(route.params.lectureDetails);

  return (
    <View>
      <VideoPlayer lectureDetails={route?.params?.lectureDetails} isLive={false} />
    </View>
  )
}

export default Videos
