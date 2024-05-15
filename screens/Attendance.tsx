/// <reference types="nativewind/types" />

import { View } from 'react-native';
import Navbar from '../components/Navbar';
import Batches from '../components/Batches';
import Recent from '../components/Recent';
import { useEffect } from 'react';
import { useGlobalContext } from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { WebView } from 'react-native-webview';

export default function Attendance({ navigation }: any) {

  const { setMainNavigation } = useGlobalContext();
  const websiteUrl = 'https://attendence.betterpw.live/';

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    setMainNavigation(navigation);
  }, [])

  return (
    <View className="bg-[#1A1A1A] flex-1">
      <WebView
        source={{ uri: websiteUrl }}
        style={{ flex: 1 }}
      />
    </View>
  );
}