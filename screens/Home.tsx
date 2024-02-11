/// <reference types="nativewind/types" />

import { View } from 'react-native';
import Navbar from '../components/Navbar';
import Batches from '../components/Batches';
import Recent from '../components/Recent';
import { useEffect } from 'react';
import { useGlobalContext } from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home({navigation}: any) {
    
  const {setMainNavigation, mainNavigation, headers, setHeaders} = useGlobalContext();

  const handleLogin = async () => {
    if(await AsyncStorage.getItem("token")){
      setHeaders({
        Authorization: `Bearer ${await AsyncStorage.getItem("token")}`
      })
      console.log("already logged in");
      mainNavigation.navigate('Home')
    }
    else{
      console.log("not logged in");
      
      navigation.navigate('Login')
    }
  }
  
  useEffect(()=>{
    navigation.setOptions({headerShown: false});
    setMainNavigation(navigation);
    handleLogin();
    // AsyncStorage.clear();
  }, [])

  return (
    <View className="bg-[#1A1A1A] flex-1">
      <Navbar/>
      <Batches/>
      <Recent/>
    </View>
  );
}
