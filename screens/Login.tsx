/// <reference types="nativewind/types" />

import { View, Text, Image, TextInput, Pressable, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { useGlobalContext } from '../context/MainContext';

export default function Login({navigation}: any) {
    
  const {setMainNavigation} = useGlobalContext();
  
  useEffect(()=>{
    navigation.setOptions({headerShown: false});
    setMainNavigation(navigation);
  }, [])

  return (
    <View className="bg-[#1A1A1A] w-full flex-1 items-center justify-center">
        <Image source={require('../assets/loginBackdrop.png')} className='w-full h-full absolute top-0 left-0 z-0' width={1920} height={1080} />
        <View className='flex-col items-center relative z-[2]'>
            <Image source={require('../assets/pw-logo.png')} className='w-16 h-16' width={10} height={10} />
            <Text className="text-white text-lg font-normal mt-5"> Welcome to</Text>
            <Text className="text-white text-2xl font-medium mt-2"> Physics Wallah </Text>
            <Text className="text-white text-sm font-normal mt-6"> Please enter your mobile no. to Login  / Register </Text>
            <TouchableOpacity  className='bg-black w-80 h-12 mt-3 flex-row rounded-md px-4 items-center justify-start'>
                <View className='flex-row items-center justify-start'>
                    <Image source={require('../assets/india.png')} className='w-6 h-6' width={10} height={10} />
                    <Text className="text-white text-lg font-semibold mx-2" > +91 </Text>
                </View>
                <TextInput hasTVPreferredFocus={true} onFocus={(e)=>{console.log("Focused")}}
            className='w-full text-white text-lg' placeholderTextColor={"rgba(255,255,255,0.7)"} placeholder='Enter Mobile No.' />
            </TouchableOpacity>
            <Pressable
            android_ripple={{
                color: "rgba(255,255,255,0.2)",
                borderless: false,
                radius: 1000,
                foreground: true
              }}
            className='bg-black w-80 h-12 overflow-hidden mt-3 flex-row rounded-full px-4 items-center justify-start'>
                <Text className='text-white/60 text-center w-full text-base'>Get OTP</Text>
            </Pressable>
        </View>
    </View>
  );
}
