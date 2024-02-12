/// <reference types="nativewind/types" />
import { useEffect, useState } from 'react';
import { Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { useGlobalContext } from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function Navbar() {

  const { mainNavigation, isOnline, setIsOnline, headers, setHeaders } = useGlobalContext();

  const handleLogout = async () => {
   

    try{
      const res = await axios.post("https://api.penpencil.co/v1/oauth/logout", {headers})
      if(res.data.success){
        mainNavigation.navigate('Login');
        AsyncStorage.clear();
        setHeaders(null);
      }
    }
    catch(err){
      console.log(err);
    }
  }

  return (
    <View className=" flex-row justify-between items-center p-4">
      <Pressable
        hasTVPreferredFocus={true}
        android_ripple={{
          color: "rgba(255,255,255,0.5)",
          borderless: false,
          radius: 1000,
          foreground: true
        }}
        className='flex-row justify-center items-center rounded-xl overflow-hidden px-2'>
        <Image source={require('../assets/pw-logo.png')} className='w-10 h-10' width={10} height={10} />
        <Text className='text-white font-medium text-xl ml-4'>Physics Wallah</Text>
      </Pressable>



      <View className=' -ml-20 rounded-xl flex-row bg-[#0d0d0d] border-[1px] border-white/5'>
        <Pressable
          hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.5)",
            borderless: false,
            radius: 1000,
            foreground: true
          }} onPress={() => { setIsOnline(true); mainNavigation.navigate('Home') }} className={`w-52 h-10 overflow-hidden rounded-xl items-center justify-center ${isOnline ? "bg-white/10 border-[1px] border-white/20 " : ''}`}>
          <Text className='text-white'>Online</Text>
        </Pressable>
        <Pressable android_ripple={{
          color: "rgba(255,255,255,0.4)",
          borderless: false,
          radius: 1000,
          foreground: true
        }} onPress={() => { setIsOnline(false); mainNavigation.navigate('Offline') }} className={`w-52 h-10 overflow-hidden rounded-xl items-center justify-center ${!isOnline ? "bg-white/10 border-[1px] border-white/20 " : ''}`}>
          <Text className='text-white'>Offline</Text>
        </Pressable>
      </View>
      
      <Pressable
        android_ripple={{
          color: "rgba(255,255,255,0.5)",
          borderless: false,
          radius: 1000,
          foreground: true
        }}
        onPress={handleLogout}
        className='flex-row justify-center overflow-hidden rounded-full items-center'>
        {/* <Image source={require('../assets/dp.png')} className='w-10 h-10' width={10} height={10} /> */}
        <Text className='bg-white/10 overflow-hidden rounded-xm text-white px-5 py-3'>Logout</Text>
      </Pressable>
    </View>
  );
}