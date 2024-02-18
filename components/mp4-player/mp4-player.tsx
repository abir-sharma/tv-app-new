import React, { useRef, useState } from 'react'
import { Video, ResizeMode } from 'expo-av'
import { Text, View, ActivityIndicator, Pressable } from 'react-native'
import { useGlobalContext } from '../../context/MainContext';

const MP4Player = ({ route }: any) => {
  const uri = route?.params?.videoUrl;
  console.log('Video URI', uri);

  const { mainNavigation } = useGlobalContext();

  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const playerRef = useRef(null);


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

  return (
    <View style={{ flex: 1 }}>
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
        onPress={() => { mainNavigation.goBack() }} className='bg-black/40 overflow-hidden rounded-xl px-3 z-[2] py-1 absolute top-2 left-2'>
        <Text className='text-white text-lg font-medium'>{"Back"}</Text>
      </Pressable>
      <Pressable
        android_ripple={{
          color: "rgba(255,255,255,0.5)",
          borderless: false,
          radius: 1000,
          foreground: true
        }}
        onPress={() => { setShowControls(prev => !prev) }} className='bg-black/80 overflow-hidden rounded-xl px-3 py-1 absolute bottom-2 z-[2] left-2'>
        <Text className='text-white text-lg font-medium'>{showControls ? "Hide Controls" : "Show Controls"}</Text>
      </Pressable>
      {showControls && <View className='absolute bottom-2 left-0 z-[2] w-full rounded-xl flex-row items-center justify-center'>
        <View className='flex-row bg-black/50 rounded-xl p-2'>
          <Pressable
            android_ripple={{
              color: "rgba(255,255,255,0.5)",
              borderless: false,
              radius: 1000,
              foreground: true
            }}
            onPress={() => { skipBackward(60000) }} className='bg-black/90 overflow-hidden rounded-xl px-3 py-1.5'>
            <Text className='text-white text-base font-medium'>{"-60s"}</Text>
          </Pressable>
          <Pressable
            android_ripple={{
              color: "rgba(255,255,255,0.5)",
              borderless: false,
              radius: 1000,
              foreground: true
            }}
            onPress={() => { skipBackward(10000) }} className='bg-black/90 overflow-hidden rounded-xl ml-2 px-3 py-1.5'>
            <Text className='text-white text-base font-medium'>{"-10s"}</Text>
          </Pressable>
          <Pressable
            android_ripple={{
              color: "rgba(255,255,255,0.5)",
              borderless: false,
              radius: 1000,
              foreground: true
            }}
            onPress={() => { isPlaying ? pauseVideo() : playVideo() }} className='bg-black/90 overflow-hidden rounded-xl ml-2 px-3 py-1'>
            <Text className='text-white text-lg font-medium'>{isPlaying ? "Pause" : "Play"}</Text>
          </Pressable>
          <Pressable
            android_ripple={{
              color: "rgba(255,255,255,0.5)",
              borderless: false,
              radius: 1000,
              foreground: true
            }}
            onPress={() => { skipForward(10000) }} className='bg-black/90 overflow-hidden rounded-xl ml-2 px-3 py-1.5'>
            <Text className='text-white text-base font-medium'>{"+10s"}</Text>
          </Pressable>
          <Pressable
            android_ripple={{
              color: "rgba(255,255,255,0.5)",
              borderless: false,
              radius: 1000,
              foreground: true
            }}
            onPress={() => { skipForward(60000) }} className='bg-black/90 overflow-hidden rounded-xl ml-2 px-3 py-1.5'>
            <Text className='text-white text-base font-medium'>{"+60s"}</Text>
          </Pressable>
        </View>
      </View>}

      <Video
        source={{ uri: uri }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        shouldPlay
        ref={playerRef}
        isLooping
        style={{ width: '100%', height: '100%' }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
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
