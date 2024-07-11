import React from 'react'
import { View } from 'react-native'
import { Video, ResizeMode } from "expo-av";
// import Video, {DRMType, VideoRef} from 'react-native-video';

const VideoTest = () => {
  return (
    <View style={{flex: 1, backgroundColor: 'pink'}}>
        <Video
          source={{
            uri: 'https://sec1.pw.live/b87ef4a1-e91d-421a-90ba-3a1811c8b8d7/master.m3u8',
            headers: {
              cookie: 'CloudFront-Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9zZWMxLnB3LmxpdmUvYjg3ZWY0YTEtZTkxZC00MjFhLTkwYmEtM2ExODExYzhiOGQ3LyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3MTc4NTgyMjR9fX1dfQ__;CloudFront-Key-Pair-Id=APKAJBP3D6S2IU5JK4LQ;CloudFront-Signature=HgYOhVHX0Xc8SP-gnUuZ28S1Q-h6IdqiOzTzmFMuqibpC3XBFwx7IxR0mJDqFcleBWtHzjo5Hjtp83O7gmHrFtFLhcxLZzgQxGxlJr1WkHwC4SYJgW0tEbHpfV6~Lv8abiT3wXlBHB49kZKaDbg5SYDjMFHTDda1rHemuynCzniyxHPnrVYE6iZ~sclhOqhemdbsSK1xoy3ny08eWy3FtDVxxGmty~M7ZDrzJL-WS0owXNHVYYvFA2aYwoL2aE3ICSdq9j21jGgLcb~Y7aUrilL2ouXygHJIZS5es-b-kEI0Co~iCj4T-nQ4mSFyIdFwc~dseUWhRIa0ZOdx3VC~jQ__',
              'Authorization': "Bearer "
            },
          }}
          useNativeControls={true}
          style={{ width: 500, height: 300, backgroundColor: 'cyan' }}
          onError={(error) => console.error('Error: ', error)}
        />
    </View>
  )
}

export default VideoTest