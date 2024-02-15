/// <reference types="nativewind/types" />

import { View } from 'react-native';
import Navbar from '../components/Navbar';
import Batches from '../components/Batches';
import Recent from '../components/Recent';
import { useEffect } from 'react';
import { useGlobalContext } from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function Home({ navigation }: any) {

  const { setMainNavigation, mainNavigation, headers, setHeaders } = useGlobalContext();

  const handleLogin = async () => {
    if (await AsyncStorage.getItem("token")) {
      console.log(await AsyncStorage.getItem("token"));
      setHeaders({
        Authorization: `Bearer ${await AsyncStorage.getItem("token")}`
      })
      try {
        const res = await axios.post("https://api.penpencil.co/v3/oauth/verify-token", { Authorization: `Bearer ${await AsyncStorage.getItem("token")}` });
      } catch (err) {
        // console.log("error token check: ", err);
        await AsyncStorage.removeItem("token");
        mainNavigation?.navigate('Login')
      }
      mainNavigation?.navigate('Home')
    }
    else {
      console.log("not logged in");

      navigation?.navigate('Login')
    }
  }

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    setMainNavigation(navigation);
    // const logToken = async () => {
    //   console.log(await AsyncStorage.getItem("token"));
    // }
    // logToken();
    handleLogin();
    // AsyncStorage.clear();
  }, [])

  return (
    <View className="bg-[#1A1A1A] flex-1">
      <Navbar />
      <Batches />
      <Recent />
    </View>
  );
}
