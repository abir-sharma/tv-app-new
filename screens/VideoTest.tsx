import React from 'react'
import { View } from 'react-native'
import { Video, ResizeMode } from "expo-av";
import WebView from 'react-native-webview';

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTgzNzA4NTMuNzA0LCJkYXRhIjp7Il9pZCI6IjYwYzliZmQ1ZWM0NjliMDAxZmE3YTc3MiIsInVzZXJuYW1lIjoiOTM5NDI1NTc1NiIsImZpcnN0TmFtZSI6IkFybmFiIiwibGFzdE5hbWUiOiJSb3kiLCJvcmdhbml6YXRpb24iOnsiX2lkIjoiNWViMzkzZWU5NWZhYjc0NjhhNzlkMTg5Iiwid2Vic2l0ZSI6InBoeXNpY3N3YWxsYWguY29tIiwibmFtZSI6IlBoeXNpY3N3YWxsYWgifSwiZW1haWwiOiJtci5yb3kuYXJuYWJAZ21haWwuY29tIiwicm9sZXMiOlsiNWIyN2JkOTY1ODQyZjk1MGE3NzhjNmVmIl0sImNvdW50cnlHcm91cCI6IklOIiwidHlwZSI6IlVTRVIifSwiaWF0IjoxNzE3NzY2MDUzfQ.F58_mob5SDmml8lA-rVYZRZsP9aU0Np0W_ohKBGyw0E';
const VIDEO_PLAYER_URL = "https://pw-video-player-stage.physicswallah.live/watch";
const lectureDetails = {"_id": "6081789d42cf3b0011880f42", "createdAt": "2021-04-22T13:22:37.183Z", "drmProtected": false, "duration": "01:16:25", "id": "6081789d42cf3b0011880f42", "image": "https://static.pw.live/5eb393ee95fab7468a79d189/94d164ef-5a1a-4622-adb1-22207eefefd0.png", "name": "Solution - 08 : Immiscible Liquids II Colligative Properties II Relative Lowering of Vapour Pressure", "status": "Ready", "types": ["DASH", "HLS"], "videoUrl": "https://d1d34p8vz63oiq.cloudfront.net/b87ef4a1-e91d-421a-90ba-3a1811c8b8d7/master.mpd"}
const scheduleDetails = {"_id": "60509e023b097703bd6c58ae", "conversationId": "608128fdd06cb400567d56e9", "dRoomId": "6148898f2680f60011313711", "date": "2021-04-22T00:00:01.000Z", "endTime": "2021-04-22T13:45:01.000Z", "isBatchDoubtEnabled": true, "isChatEnabled": false, "isCommentDisabled": false, "isDPPVideos": false, "isDoubtEnabled": false, "isFree": false, "isPathshala": false, "restrictedSchedule": false, "restrictedTime": 0, "startTime": "2021-04-22T13:45:01.000Z", "status": "PENDING", "tags": [{"_id": "606b06447772c8001867afed", "name": "Ch-01 : Solution"}], "teachers": [], "timeline": [], "topic": "Solution - 08 : Immiscible Liquids II Colligative Properties II Relative Lowering of Vapour Pressure (Recorded Class)", "url": "https://d1d34p8vz63oiq.cloudfront.net/b87ef4a1-e91d-421a-90ba-3a1811c8b8d7/master.mpd", "urlType": "penpencilvdo", "videoDetails": {"_id": "6081789d42cf3b0011880f42", "createdAt": "2021-04-22T13:22:37.183Z", "drmProtected": false, "duration": "01:16:25", "id": "6081789d42cf3b0011880f42", "image": "https://static.pw.live/5eb393ee95fab7468a79d189/94d164ef-5a1a-4622-adb1-22207eefefd0.png", "name": "Solution - 08 : Immiscible Liquids II Colligative Properties II Relative Lowering of Vapour Pressure", "status": "Ready", "types": ["DASH", "HLS"], "videoUrl": "https://d1d34p8vz63oiq.cloudfront.net/b87ef4a1-e91d-421a-90ba-3a1811c8b8d7/master.mpd"}}

console.log(`${VIDEO_PLAYER_URL}/?type=${lectureDetails.types[0]}&src=${lectureDetails.videoUrl}&token=${token}&clientType=TEACHER&randomId=${"pw-test-uuid"}&back_button=false&three_dots=false&is_products_enabled=false`);   

const VideoTest = () => {
  return (
    <View style={{flex: 1, backgroundColor: '#00000040'}}>
        {/* <Video
          source={{
            uri: 'https://sec1.pw.live/b87ef4a1-e91d-421a-90ba-3a1811c8b8d7/master.m3u8',    
            // uri: 'https://live-hls-abr-cdn.livepush.io/live/bigbuckbunnyclip/index.m3u8',
            headers: {
              cookie: 'CloudFront-Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9zZWMxLnB3LmxpdmUvYjg3ZWY0YTEtZTkxZC00MjFhLTkwYmEtM2ExODExYzhiOGQ3LyoiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3MTc4MDkwMjR9fX1dfQ__;CloudFront-Key-Pair-Id=APKAJBP3D6S2IU5JK4LQ;CloudFront-Signature=dDa7VKou-RCOgWQo4khAgoMwA0slFdtjXwwgpVAO2~08pdBIFYb~hhyYWqrI3VZLV3WvsdqTsqAFAgxFLzzQewpwiUVAvrFhVpD7~30~J~QbZYe8SNL63Oe4P9zM2T7-yzkWYnbHqdB9qHdXgf1Q8Sgag8cP383V-hDmyHvmhXyXkgRUZq00kKJh0L4w90qYKhwg0zpO-3suV40mZ9nu8fOdcYxa9IaEPvp4iYhwsejehklU1dF~y6TINoR-yvfi8jqFojwcByIQKSemgUu-E7hXxF4dl5TpU0ZVsbYIkUa7O7BUF5X9vD8gBV85TtipKUwgBAGD5Ss85Hkg85KWug__',
            },
          }}
          style={{ width: 500, height: 300, backgroundColor: '#5a4' }}
          onError={(error) => console.log('Error: ', error)}
        /> */}
        <WebView
            source={{
                uri: `${VIDEO_PLAYER_URL}/?type=${scheduleDetails.urlType}&src=${scheduleDetails.url}&token=${token}&clientType=TEACHER&randomId=123-skabd12-123jhb-98h&back_button=false&three_dots=false&is_products_enabled=false`
            }}
            style={{ flex: 1 }}
        />
    </View>
  )
}

export default VideoTest
