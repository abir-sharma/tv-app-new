/// <reference types="nativewind/types" />

import { View, Text, Image } from 'react-native';
import { useEffect } from 'react';
import { useGlobalContext } from '../context/MainContext';
import { WebView } from 'react-native-webview';

export default function Intro({ navigation }: any) {

  const { setMainNavigation } = useGlobalContext();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    setMainNavigation(navigation);
  }, [])

  //navigate to home page after 5 sec
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Home');
    }, 4500);
  }, [])

  return (
    <View className="w-screen h-screen flex items-center justify-center bg-[#111111]">
      {/* <Video  
            // source={{uri: "https://res.cloudinary.com/dwwc6j2b7/video/upload/v1715711175/intro_ydm9bm.mov"}}             
            source={require('../assets/intro4.mp4')}    
            paused={false}
            repeat={true}
        /> */}
        <Image source={require('../assets/intro.gif')} className='w-[80%] mx-auto h-96' width={10} height={10} />
    </View>
  );
}
