/// <reference types="nativewind/types" />

import { View, Image } from 'react-native';
import { useEffect } from 'react';

export default function Intro({ navigation }: any) {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Home');
    }, 4500);
  }, [])

  return (
    <View className="w-screen h-screen flex items-center justify-center bg-[#111111]">
      <Image source={require('../assets/intro.gif')} className='w-[80%] mx-auto h-96' width={10} height={10} />
    </View>
  );
}
