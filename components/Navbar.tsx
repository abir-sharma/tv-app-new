/// <reference types="nativewind/types" />
import { Image, NativeModules, Pressable, Text, View } from 'react-native';
import { useGlobalContext } from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function Navbar() {

  const { mainNavigation, isOnline, setLogs, setIsOnline, headers, setHeaders } = useGlobalContext();


  const handleLogout = async () => {


    try {
      mainNavigation.navigate('Login');
      AsyncStorage.clear();
      setHeaders(null);
      const res = await axios.post("https://api.penpencil.co/v1/oauth/logout", { headers })
      if (res?.data?.success) {
      }
    }
    catch (err: any) {
      setLogs((logs) => [...logs, "Error in LOGOUT API 2( Navbar component):" + JSON.stringify(err?.response)]);
      console.log(err);
    }
  }

  return (
    <View className=" flex-row justify-between items-center p-4 bg-[#1B2124]">
      
      <View className='flex flex-row gap-2'>
      <Pressable
        hasTVPreferredFocus={true}
        android_ripple={{
          color: "rgba(255,255,255,0.5)",
          borderless: false,
          radius: 1000,
          foreground: true
        }}
        className='flex-row justify-center items-center rounded-xl overflow-hidden px-2 gap-x-5'>
        <Image source={require('../assets/pw-logo.png')} className='w-10 h-10' width={10} height={10} />
        {/* <Text className='text-white font-medium text-xl ml-4'>Physics Wallah</Text> */}
        
      </Pressable>
      {/* <View className=' -ml-20 rounded-xl flex-row bg-[#0d0d0d] border-[1px] border-white/5'> */}
        <Pressable
          hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.5)",
            borderless: false,
            radius: 1000,
            foreground: true
          }} onPress={() => { setIsOnline(true); mainNavigation.navigate('Home') }}
          // className={`w-52 h-10 overflow-hidden rounded-xl items-center justify-center ${isOnline ? "bg-white/10 border-[1px] border-white/20 " : ''}`}
          className='w-20 h-10 rounded-xl items-center justify-center overflow-hidden'
          >
          <Text className={`text-white ${isOnline && " font-bold "}`}>Online</Text>
        </Pressable>
        <Pressable android_ripple={{
          color: "rgba(255,255,255,0.4)",
          borderless: false,
          radius: 1000,
          foreground: true
        }} onPress={() => { setIsOnline(false); mainNavigation.navigate('Offline') }}
        // className={`w-52 h-10 overflow-hidden rounded-xl items-center justify-center ${!isOnline ? "bg-white/10 border-[1px] border-white/20 " : ''}`}
        className='w-20 h-10 rounded-xl items-center justify-center overflow-hidden'
        >
          <Text className={`text-white ${!isOnline && " font-bold "}`}>Offline</Text>
        </Pressable>
      {/* </View> */}

      <Pressable
        android_ripple={{
          color: "rgba(255,255,255,0.5)",
          borderless: false,
          radius: 1000,
          foreground: true
        }}
        onPress={()=>{mainNavigation.navigate('AiTeacher');}}
        className='flex-row justify-center overflow-hidden rounded-xl w-32 h-10 items-center'>
        <Text className='overflow-hidden rounded-xl text-white'>AI-Teacher</Text>
      </Pressable>

      <Pressable
        android_ripple={{
          color: "rgba(255,255,255,0.5)",
          borderless: false,
          radius: 1000,
          foreground: true
        }}
        onPress={()=>{mainNavigation.navigate('Attendance');}}
        className='flex-row justify-center overflow-hidden rounded-xl w-32 h-10 items-center'>
        <Text className=' overflow-hidden rounded-xl text-white'>Attendance</Text>
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
        <Text className='bg-white/10 overflow-hidden rounded-xm text-white px-5 py-3'>Logout</Text>
      </Pressable>
    </View>
  );
}