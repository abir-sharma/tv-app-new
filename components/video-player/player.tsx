import React, { useEffect, useState, useRef } from 'react'
import { View, Text, ActivityIndicator, Pressable, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview';
import styles from './player.style';
import axios from 'axios';
import { Video, ResizeMode } from 'expo-av';
import { cookieSplitter } from './cookie-splitter';
import { useGlobalContext } from '../../context/MainContext';
import { Slider } from "@miblanchard/react-native-slider";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const playbackSpeedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function VideoPlayer(props: any) {

  const { mainNavigation } = useGlobalContext();
  const playerRef = useRef<Video | null>(null);
  const [spinner, setSpinner] = useState<any>();
  const [src, setSrc] = useState<any>(undefined);
  const [cookieParams, setCookieParams] = useState<any>(undefined);
  const [renderVideo, setRenderVideo] = useState<boolean>(false);
  const [noVideoAvailable, setNoVideoAvailable] = useState<boolean>(false);
  const { headers } = useGlobalContext();
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(true);

  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [quality, setQuality] = useState(720);

  function convertToSeconds(timeString:string) {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  function formatTime(milliseconds:number) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
  
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
  }
  
  function padZero(number:number) {
    return number.toString().padStart(2, '0');
  }

  const MPDTesting = async(mpdUrl: string) => {
    const m3u8url = convertMPDToM3U8(mpdUrl);
    console.log("urlsent:", m3u8url, {headers: {cookie: cookieParams}});
    try{
      const res = await axios.get(m3u8url);
      console.log("resss: ", res.data);
    }
    catch(err){
      console.log("err: ", err);
    }

  }

  useEffect(() => {
    // console.log("url: ", props?.lectureDetails?.videoUrl);

    // MPD testing
    MPDTesting(props?.lectureDetails?.videoUrl);

    setDuration(convertToSeconds(props?.lectureDetails?.duration));
    
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
  }, [quality])
  
  useEffect(()=>{
    console.log(currentTime);
  }, [currentTime])

  const togglePlaybackSpeed = () => {
    //gets the next playback speed index
    const nextSpeedIndex = playbackSpeedOptions.indexOf(playbackSpeed) + 1;
    if (nextSpeedIndex < playbackSpeedOptions.length) {
      playerRef.current && playerRef.current.setRateAsync(playbackSpeedOptions[nextSpeedIndex], true);
      setPlaybackSpeed(playbackSpeedOptions[nextSpeedIndex]);
    }
    //if the last option i.e. 2x speed is applied. then moves to first option 
    else {
      playerRef.current && playerRef.current.setRateAsync(playbackSpeedOptions[0], true);
      setPlaybackSpeed(playbackSpeedOptions[0]);
    }
  };

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showControls, setShowControls] = useState<boolean>(true);

  const playVideo = () => {
    setIsPlaying(true);
    (playerRef.current as Video | null)?.playAsync();
  }

  const pauseVideo = () => {
    setIsPlaying(false);
    (playerRef.current as Video | null)?.pauseAsync();
  }

  const skipForward = (skipTime: number) => {
    (playerRef.current as Video | null)?.getStatusAsync().then((status) => {
      const newPosition = Math.max((status as any).positionMillis + skipTime, 0);
      (playerRef.current as Video | null)?.setPositionAsync(newPosition);
    });
  };

  const skipBackward = (skipTime: number) => {
    (playerRef.current as Video | null)?.getStatusAsync().then((status) => {
      const newPosition = Math.min((status as any).positionMillis - skipTime, (status as any).durationMillis);
      (playerRef.current as Video | null)?.setPositionAsync(newPosition);
    });
  };

  function convertMPDToM3U8(mpdUrl: string) {
    // Define a regular expression to match the ID in the MPD URL
    const idRegex = /\/([0-9a-f-]+)\/master\.mpd$/i;
    const match = mpdUrl.match(idRegex);

    if (match) {
      const id = match[1]; // Extract the ID from the URL
      const m3u8Url = `https://sec1.pw.live/${id}/hls/${quality}/main.m3u8`;
      return m3u8Url;
    } else {
      // Handle invalid MPD URLs here (e.g., return an error message)
      return "Invalid MPD URL";
    }
  }

  useEffect(() => {
    setSrc(convertMPDToM3U8(props?.lectureDetails?.videoUrl));
    console.log("uu: ", convertMPDToM3U8(props?.lectureDetails?.videoUrl));
  }, [quality]);

  async function sendAnalyticsData(uri: string) {
    const newHeaders = {
      'Content-Type': 'application/json',
      Authorization: headers.Authorization,
      'Client-Type': 'WEB',
    };
    const data = {
      url: uri,
    };
    axios.post("https://api.penpencil.co/v3/files/send-analytics-data", data, { headers: newHeaders })
      .then((response) => {
        console.log("analytics success", response.data.data);
        setCookieParams(cookieSplitter(response?.data?.data));
        setRenderVideo(true);
      })
      .catch((error) => {
        console.error('analytics failed --->', error?.response?.data);
      });
  }

  const handlePlaybackStatusUpdate = (status:any) => {
    setCurrentTime(status.positionMillis);
  };

  useEffect(() => {
    const interval = setInterval(() => setShowControls(false), 15000);
    return () => clearInterval(interval)
  }, [isActive]);

  return (
    <View style={{ minHeight: '100%' }} className='bg-[#1A1A1A] h-full'>
      {showLoader && <View
        style={{ position: 'absolute', left: 0, top: 0, zIndex: 10, height: '100%', width: '100%', alignContent: 'center', flex: 1, alignItems: 'center', justifyContent: 'center' }}
        className='bg-white/10 '
      >
        <ActivityIndicator color={"#FFFFFF"} size={80} />
      </View>}
      <Pressable
        android_ripple={{
          color: "rgba(255,255,255,0.5)",
          borderless: false,
          radius: 1000,
          foreground: true
        }}
        onPress={() => { mainNavigation.goBack() }} className='bg-black/40 overflow-hidden rounded-full z-[2] p-2 absolute top-2 left-2'>
        <Image
          source={require('../../assets/exit.png')}
          width={30}
          height={30}
          className='h-[30] w-[30]'
        />
      </Pressable>
      <Pressable
        android_ripple={{
          color: "rgba(255,255,255,0.5)",
          borderless: false,
          radius: 1000,
          foreground: true
        }}
        onPress={() => { setIsActive(!isActive); setShowControls(prev => !prev) }} className={`bg-black/80 overflow-hidden rounded-xl px-3 py-1 absolute ${showControls ? "bottom-12 mb-1" : "bottom-2"} duration-300  z-[3] left-2`}>
        <Text className='text-white text-lg font-medium'>{showControls ? "Hide Controls" : "Show Controls"}</Text>
      </Pressable>
      { showControls && <Pressable
        className={`bg-black/80 overflow-hidden rounded-xl flex flex-row items-center px-1 pl-2 py-1 absolute duration-300 bottom-12 mb-1 z-[3] right-2`}>
        
        <Pressable
         android_ripple={{
          color: "rgba(255,255,255,0.5)",
          borderless: false,
          radius: 1000,
          foreground: true
        }}
        onPress={() => {
          setIsMuted(!isMuted);
          // playerRef.current && playerRef.current.setIsMutedAsync(!isMuted);
        }}
        className='p-1 rounded-lg overflow-hidden w-10 flex items-center justify-center'
        >
          {/* <Text className='text-[#7363FC] font-bold' >Mute</Text> */}
          {isMuted?
          (<FontAwesome5 name="volume-mute" size={24} color="#7363FC" />):(
            volume<0.3 ?
            <FontAwesome5 name="volume-off" size={24} color="#7363FC" />:
            volume>=0.3 && volume<0.7 ?
            <FontAwesome5 name="volume-down" size={24} color="#7363FC" />:
            <FontAwesome5 name="volume-up" size={24} color="#7363FC" />
          )
        }
        </Pressable>

            <View className='w-40'>
              <Slider
              containerStyle={styles2.slider}
                minimumValue={0}
                maximumValue={1}
                value={volume}
                onValueChange={(value:any) => {
                  setVolume(+value);
                }}
                onSlidingComplete={(value:any) => {
                  setVolume(+value);
                  setIsMuted(false);
                }}
                minimumTrackTintColor="#7363FC"
                maximumTrackTintColor="#AAA"
                thumbTintColor="#7363FC"
              />
            </View>
            <Text className='text-white w-10'>{Math.round(volume * 100)}%</Text>
      </Pressable>}
      {showControls && <View className='absolute bottom-2 left-0 z-[2] w-full rounded-xl flex-col items-center justify-center px-2'>
        <View className='flex-row bg-black/50 rounded-xl p-2'>
        <Pressable
            onPress={() => {
              const qualityOptions = [240, 360, 480, 720];
              const currentIndex = qualityOptions.indexOf(quality);
              const nextIndex = (currentIndex + 1) % qualityOptions.length;
              setQuality(qualityOptions[nextIndex]);
            }}
            className='bg-black/90 overflow-hidden rounded-full w-12 h-12 flex mr-2 items-center justify-center'
          >
            <Text className=' text-sm text-[#7363FC] font-bold mb-1 overflow-hidden'>{`${quality}p`}</Text>
          </Pressable>
          <Pressable
            android_ripple={{
              color: "rgba(255,255,255,0.5)",
              borderless: false,
              radius: 1000,
              foreground: true
            }}
            onPress={() => { setIsActive(!isActive); skipBackward(30000) }} className='bg-black/90 overflow-hidden rounded-full p-2'>
            <Image
              source={require('../../assets/30b.png')}
              width={30}
              height={30}
              className='h-[30] w-[30]'
            />
          </Pressable>
          <Pressable
            android_ripple={{
              color: "rgba(255,255,255,0.5)",
              borderless: false,
              radius: 1000,
              foreground: true
            }}
            onPress={() => { setIsActive(!isActive); skipBackward(10000) }} className='bg-black/90 overflow-hidden rounded-full ml-2 p-2'>
            <Image
              source={require('../../assets/10b.png')}
              width={30}
              height={30}
              className='h-[30] w-[30]'
            />
          </Pressable>
          <Pressable
            android_ripple={{
              color: "rgba(255,255,255,0.5)",
              borderless: false,
              radius: 1000,
              foreground: true
            }}
            onPress={() => { setIsActive(!isActive); isPlaying ? pauseVideo() : playVideo() }} className='bg-black/90 overflow-hidden rounded-full ml-2 p-2'>
            <Image
              source={isPlaying ? require('../../assets/pause.png') : require('../../assets/play.png')}
              width={30}
              height={30}
              className='h-[30] w-[30]'
            />
          </Pressable>
          <Pressable
            android_ripple={{
              color: "rgba(255,255,255,0.5)",
              borderless: false,
              radius: 1000,
              foreground: true
            }}
            onPress={() => { setIsActive(!isActive); skipForward(10000) }} className='bg-black/90 overflow-hidden rounded-full ml-2 p-2'
          >
            <Image
              source={require('../../assets/10f.png')}
              width={30}
              height={30}
              className='h-[30] w-[30]'
            />
          </Pressable>
          <Pressable
            android_ripple={{
              color: "rgba(255,255,255,0.5)",
              borderless: false,
              radius: 1000,
              foreground: true
            }}
            onPress={() => { setIsActive(!isActive); skipForward(30000) }} className='bg-black/90 overflow-hidden rounded-full ml-2 p-2'>
            <Image
              source={require('../../assets/30f.png')}
              width={30}
              height={30}
              className='h-[30] w-[30]'
            />
          </Pressable>

          <Pressable
            onPress={() => {
              togglePlaybackSpeed();
            }}
            className='bg-black/90 overflow-hidden rounded-full w-12 h-12 flex ml-2 items-center justify-center'
          >
            <Text className=' text-sm text-[#7363FC] font-bold mb-1 overflow-hidden'>{`${playbackSpeed}x`}</Text>
          </Pressable>
        </View>
        <View className='flex-row bg-black/50 rounded-xl mt-2 px-5 w-full mx-5'>
          <View className='flex flex-row justify-between items-center w-full'>
            <Text className='text-white' >{formatTime(currentTime)}</Text>
            <View className='flex-1'>
              <Slider
              containerStyle={styles2.slider}
                minimumValue={0}
                maximumValue={duration * 1000}
                value={currentTime}
                onValueChange={(value:any) => {
                  playerRef.current && playerRef.current.setPositionAsync(+value);
                  setCurrentTime(+value);
                }}
                onSlidingComplete={(value:any) => {
                  playerRef.current && playerRef.current.setPositionAsync(+value);
                  setCurrentTime(+value);
                }}
                minimumTrackTintColor="#7363FC"
                maximumTrackTintColor="#AAA"
                thumbTintColor="#7363FC"
              />
            </View>
            <Text className='text-white'>{formatTime(duration * 1000)}</Text>
          </View>
        </View>
      </View>}
      <ActivityIndicator style={{ display: spinner ? 'flex' : 'none', marginTop: 100 }} size="small" color="#5a4bda" animating={spinner} />
      {
        noVideoAvailable &&
        <View style={{ alignItems: 'center', marginTop: 100 }}>
          <Text style={{ fontSize: 16, color: '#757575' }}>No video available</Text>
        </View>
      }
      {
        !props?.lectureDetails?.types &&
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
          style={styles.backgroundVideo}
          ref={playerRef}
          useNativeControls={false}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          resizeMode={ResizeMode.CONTAIN}
          onError={(err: any) => console.log('Video Player Error --->', err, `CloundFront-Key-Pair-Id=${cookieParams?.key_pair_id};CloudFront-Policy=${cookieParams?.policy};CloudFront-Signature=${cookieParams?.signature};`)}
          isMuted={isMuted}
          shouldPlay
          volume={volume}
          onLoad={() => setShowLoader(false)}
        />
      }
    </View>
  )
}

const styles2 = StyleSheet.create({
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#000",
  },
  controlButton: {
    flex: 1,
    width: "100%",
    marginHorizontal: 10,
  },
  playbackSpeedText: {
    color: "white",
    fontSize: 16,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
    backgroundColor: "black",
    padding: 10,
  },
  slider: {
    marginHorizontal: 10,
  },
  timeText: {
    color: "white",
    fontSize: 12,
  },
});