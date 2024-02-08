/// <reference types="nativewind/types" />

import { View } from 'react-native';
import Navbar from '../components/Navbar';
import Batches from '../components/Batches';
import Recent from '../components/Recent';
import { useEffect } from 'react';
import { useGlobalContext } from '../context/MainContext';

export default function Home({navigation}: any) {
    
  const {setMainNavigation} = useGlobalContext();
  
  useEffect(()=>{
    navigation.setOptions({headerShown: false});
    setMainNavigation(navigation);
  }, [])

  return (
    <View className="bg-[#1A1A1A] flex-1">
      <Navbar/>
      <Batches/>
      <Recent/>
    </View>
  );
}
