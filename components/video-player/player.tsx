import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Dimensions, Modal, Platform, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import uuid from 'react-native-uuid';
// import Video from 'react-native-video';
import styles from './player.style';
import axios from 'axios';
// import ApiRoutes from '../../../config/api.config';A
import { Video, ResizeMode } from 'expo-av';
import { cookieSplitter } from './cookie-splitter';

export default function VideoPlayer(props: any) {
  const [spinner, setSpinner] = useState<any>();
  const [src, setSrc] = useState<any>(undefined);
  const [cookieParams, setCookieParams] = useState<any>(undefined);
  const playerRef = useRef(null);
  const [renderVideo, setRenderVideo] = useState<boolean>(false);
  const [noVideoAvailable, setNoVideoAvailable] = useState<boolean>(false);
  // console.log("###### --->", props?.lectureDetails);

  useEffect(() => {
    setSpinner(true);
    if (!props?.lectureDetails?.videoUrl && props?.lectureDetails?.types) {
      setNoVideoAvailable(true);
      setSpinner(false);
      return;
    }
    if (!props?.lectureDetails?.types) {
      setSrc(props?.lectureDetails?.embedCode);
      setRenderVideo(true);
      setSpinner(false);
      return;
    }
    if (props.isLive) {
      setSrc(props?.lectureDetails?.videoUrl);
      sendAnalyticsData(props?.lectureDetails?.videoUrl);
      setRenderVideo(true);
      setSpinner(false);
      return;
    }
    else {
      setSrc(convertMPDToM3U8(props?.lectureDetails?.videoUrl));
      let m3u8Url = convertMPDToM3U8(props?.lectureDetails?.videoUrl);
      sendAnalyticsData(m3u8Url);
      setRenderVideo(true);
      setSpinner(false);
    }
  }, [])

  function convertMPDToM3U8(mpdUrl: string) {
    // Define a regular expression to match the ID in the MPD URL
    const idRegex = /\/([0-9a-f-]+)\/master\.mpd$/i;
    const match = mpdUrl.match(idRegex);

    if (match) {
      const id = match[1]; // Extract the ID from the URL
      const m3u8Url = `https://sec1.pw.live/${id}/master.m3u8`;
      console.log("m3u8 --->", m3u8Url)
      return m3u8Url;
    } else {
      // Handle invalid MPD URLs here (e.g., return an error message)
      return "Invalid MPD URL";
    }
  }

  async function sendAnalyticsData(uri: string) {
    const headers = {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${await AsyncStorage.getItem('token')}`,
      // Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDczNjk4MzAuODk4LCJkYXRhIjp7Il9pZCI6IjVlY2QzNGZhYjU4NWYxMjUyZTc4MmJiNiIsInVzZXJuYW1lIjoiODQyMDMxMDEyNSIsImZpcnN0TmFtZSI6IlNheWFrIiwibGFzdE5hbWUiOiJTYXJrYXIiLCJvcmdhbml6YXRpb24iOnsiX2lkIjoiNWViMzkzZWU5NWZhYjc0NjhhNzlkMTg5Iiwid2Vic2l0ZSI6InBoeXNpY3N3YWxsYWguY29tIiwibmFtZSI6IlBoeXNpY3N3YWxsYWgifSwiZW1haWwiOiJzYXlha3NhcmthcjczQGdtYWlsLmNvbSIsInJvbGVzIjpbIjViMjdiZDk2NTg0MmY5NTBhNzc4YzZlZiJdLCJjb3VudHJ5R3JvdXAiOiJJTiIsInR5cGUiOiJVU0VSIn0sImlhdCI6MTcwNjc2NTAzMH0.BC2hePPB0jKRwoxcTkLO7feCFGeZAVcpCvwVh6XwMr8",
      Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDc3NDkzMTYuNDU2LCJkYXRhIjp7Il9pZCI6IjVlY2QzNGZhYjU4NWYxMjUyZTc4MmJiNiIsInVzZXJuYW1lIjoiODQyMDMxMDEyNSIsImZpcnN0TmFtZSI6IlNheWFrIiwibGFzdE5hbWUiOiJTYXJrYXIiLCJvcmdhbml6YXRpb24iOnsiX2lkIjoiNWViMzkzZWU5NWZhYjc0NjhhNzlkMTg5Iiwid2Vic2l0ZSI6InBoeXNpY3N3YWxsYWguY29tIiwibmFtZSI6IlBoeXNpY3N3YWxsYWgifSwiZW1haWwiOiJzYXlha3NhcmthcjczQGdtYWlsLmNvbSIsInJvbGVzIjpbIjViMjdiZDk2NTg0MmY5NTBhNzc4YzZlZiJdLCJjb3VudHJ5R3JvdXAiOiJJTiIsInR5cGUiOiJVU0VSIn0sImlhdCI6MTcwNzE0NDUxNn0.RPE5gvodX6441YbQmZsPCpq_agaoEWnqviQbw0fw_9M",
      'Client-Type': 'WEB',
    };
    const data = {
      url: uri,
    };
    console.log('uri --->', uri);
    axios.post("https://api.penpencil.co/v3/files/send-analytics-data", data, { headers })
      .then((response) => {
        setCookieParams(cookieSplitter(response.data.data));
        setRenderVideo(true);
      })
      .catch((error) => {
        console.error('analytics failed --->', error.response.data);
      });
  }

  return (
    <View style={{ minHeight: '100%' }}>
      <ActivityIndicator style={{ display: spinner ? 'flex' : 'none', marginTop: 100 }} size="small" color="#5a4bda" animating={spinner} />
      {
        noVideoAvailable &&
        <View style={{ alignItems: 'center', marginTop: 100 }}>
          <Text style={{ fontSize: 16, color: '#757575' }}>No video available</Text>
        </View>
      }
      {
        !props.lectureDetails?.types &&
        <View style={{ height: '100%' }}>
          <WebView
            style={{ flex: 1 }}
            // source={{ uri: "https://www.youtube.com/embed/d3sLImqhjHc" }}
            source={{ uri: src }}
          />
        </View>
      }
      {
        renderVideo &&
        <Video
          source={{
            uri: src,
            headers: {
              cookie: cookieParams
            }
          }}
          ref={playerRef}
          style={styles.backgroundVideo}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          onError={(err: any) => console.log('Video Player Error --->', err, `CloundFront-Key-Pair-Id=${cookieParams?.key_pair_id};CloudFront-Policy=${cookieParams?.policy};CloudFront-Signature=${cookieParams?.signature};`)}
          isMuted={false}
          shouldPlay
        />
      }
    </View>
  )
}
