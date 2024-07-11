import React, { useEffect, useRef, useState } from 'react'
import { Video, ResizeMode } from 'expo-av'
import { Text, View, ActivityIndicator, Pressable, Image } from 'react-native'
import { useGlobalContext } from '../../context/MainContext';
import { useNavigation } from '@react-navigation/native';

const MP4Player = ({ route }: any) => {
  const uri = route?.params?.videoUrl;
  const navigation = useNavigation();
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(true);

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

  useEffect(() => {
    const interval = setInterval(() => setShowControls(false), 10000);
    return () => clearInterval(interval)
  }, [isActive]);

  return (
    <View style={{ flex: 1, backgroundColor: '#000000' }}>
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
        onPress={() => { navigation.goBack() }} className='bg-black/40 overflow-hidden rounded-full z-[2] p-2 absolute top-2 left-2'
      >
        <Image
          source={require('../../assets/exit.png')}
          width={30}
          height={30}
          className='h-[30] w-[30]'
        />
      </Pressable>
      

      <Video
        source={{ uri: uri }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        shouldPlay
        ref={playerRef}
        isLooping
        style={{ width: '100%', height: '100%', backgroundColor: '#000000' }}
        useNativeControls={true}
        resizeMode={ResizeMode.CONTAIN}
        onLoadStart={() => {
          setShowLoader(true);
        }}
        onLoad={() => {
          setShowLoader(false);
        }}
      />
    </View>
  )
}

export default MP4Player
