/// <reference types="nativewind/types" />

import { fromCSS } from "@bacons/css-to-expo-linear-gradient";

import { View } from 'react-native';
import Navbar from '../components/Navbar';
import Batches from '../components/Batches';
import Recent from '../components/Recent';
import { useEffect } from 'react';
import { useGlobalContext } from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

export default function Home({ navigation }: any) {

  const { setMainNavigation, setLogs, mainNavigation, setHeaders } = useGlobalContext();

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e:any) => {
        e.preventDefault();
      }),
    [navigation]
  );

  const handleLogin = async () => {
    if (await AsyncStorage.getItem("token")) {
      console.log(await AsyncStorage.getItem("token"));
      setHeaders({
        Authorization: `Bearer ${await AsyncStorage.getItem("token")}`
      })
      try {
        const res = await axios.post("https://api.penpencil.co/v3/oauth/verify-token", { Authorization: `Bearer ${await AsyncStorage.getItem("token")}` });
      } catch (err: any) {
        setLogs((logs) => [...logs, "Error in VERIFY TOKEN API:" + JSON.stringify(err.response)]);
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
    handleLogin();
  }, [])

  return (
    <LinearGradient
  // colors={['#2D3A41', '#2D3A41', '#000000']}
  // locations={[0.0647, 0.4775, 1]}
  // start={{ x: 0.5, y: 0 }}
  // end={{ x: 0.5, y: 1 }}
    {...fromCSS(
      `linear-gradient(276.29deg, #2D3A41 6.47%, #2D3A41 47.75%, #000000 100%)`
    )}
    className=" flex-1">
      <Navbar />
      <Batches />
      <Recent />
    </LinearGradient>
  );
}