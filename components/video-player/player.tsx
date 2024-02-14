import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Dimensions, Modal, Platform, ActivityIndicator, Pressable } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import uuid from 'react-native-uuid';
// import Video from 'react-native-video';
import styles from './player.style';
import axios from 'axios';
// import ApiRoutes from '../../../config/api.config';A
import { Video, ResizeMode } from 'expo-av';
import { cookieSplitter } from './cookie-splitter';
import { useGlobalContext } from '../../context/MainContext';

export default function VideoPlayer(props: any) {
  const playerRef = useRef(null);
  const [spinner, setSpinner] = useState<any>();
  const [src, setSrc] = useState<any>(undefined);
  const [cookieParams, setCookieParams] = useState<any>(undefined);
  const [renderVideo, setRenderVideo] = useState<boolean>(false);
  const [noVideoAvailable, setNoVideoAvailable] = useState<boolean>(false);
  const { headers } = useGlobalContext();
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


  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const playVideo = () => {
    setIsPlaying(true);
    (playerRef.current as Video | null)?.playAsync();
  }

  const pauseVideo = () => {
    setIsPlaying(false);
    (playerRef.current as Video | null)?.pauseAsync();
  }

  const skipForward = () => {
        (playerRef.current as Video | null)?.getStatusAsync().then((status) => {
          const newPosition = Math.max((status as any).positionMillis + 10000, 0);
          (playerRef.current as Video | null)?.setPositionAsync(newPosition);
        });
    };

    const skipBackward = () => {
      (playerRef.current as Video | null)?.getStatusAsync().then((status) => {
        const newPosition = Math.min((status as any).positionMillis - 10000, (status as any).durationMillis);
        (playerRef.current as Video | null)?.setPositionAsync(newPosition);
      });
  };

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
    const newHeaders = {
      'Content-Type': 'application/json',
      Authorization: headers.Authorization,
      'Client-Type': 'WEB',
    };
    const data = {
      url: uri,
    };
    console.log('uri --->', uri);
    axios.post("https://api.penpencil.co/v3/files/send-analytics-data", data, { headers: newHeaders })
      .then((response) => {
        setCookieParams(cookieSplitter(response.data.data));
        setRenderVideo(true);
      })
      .catch((error) => {
        console.error('analytics failed --->', error.response.data);
      });
  }

  return (
    <View style={{ minHeight: '100%' }} className='bg-[#1A1A1A]'>
      <View className='absolute bottom-2 left-2 z-[2] flex-row'>
      <Pressable 
        android_ripple={{
            color: "rgba(255,255,255,0.5)",
            borderless: false,
            radius: 1000,
            foreground: true
        }}
        onPress={()=>{skipBackward()}} className='bg-black/40 overflow-hidden rounded-xl px-3 py-1'>
          <Text className='text-white text-lg font-medium'>{"<<"}</Text>
        </Pressable>
        <Pressable 
        android_ripple={{
            color: "rgba(255,255,255,0.5)",
            borderless: false,
            radius: 1000,
            foreground: true
        }}
        onPress={()=>{isPlaying? pauseVideo(): playVideo()}} className='bg-black/40 overflow-hidden rounded-xl ml-2 px-3 py-1'>
          <Text className='text-white text-lg font-medium'>{isPlaying? "Pause": "Play"}</Text>
        </Pressable>
        <Pressable 
        android_ripple={{
            color: "rgba(255,255,255,0.5)",
            borderless: false,
            radius: 1000,
            foreground: true
        }}
      onPress={()=>{skipForward()}} className='bg-black/40 overflow-hidden rounded-xl ml-2 px-3 py-1'>
        <Text className='text-white text-lg font-medium'>{">>"}</Text>
      </Pressable>
      </View>
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
          useNativeControls={true}
          resizeMode={ResizeMode.CONTAIN}
          onError={(err: any) => console.log('Video Player Error --->', err, `CloundFront-Key-Pair-Id=${cookieParams?.key_pair_id};CloudFront-Policy=${cookieParams?.policy};CloudFront-Signature=${cookieParams?.signature};`)}
          isMuted={false}
          shouldPlay
        />
      }
    </View>
  )
}
