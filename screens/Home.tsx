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

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

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
    console.log("checking login...");
    const randu = uuidv4();
    console.log("randu: ", randu);
    AsyncStorage.getItem("token").then(async (res)=>{
      console.log("ressss:", res)
      if (res) {
        console.log("token exists");
        setHeaders({
          Authorization: `Bearer ${res}`
        })
        try {
          const headers = { 'Authorization': `Bearer ${await AsyncStorage.getItem("token")}`, 'randomId': randu }
          // const res = await axios.post("https://api.penpencil.co/v3/oauth/verify-token", '', { headers: headers });
          const res = await fetch("https://api.penpencil.co/v3/oauth/verify-token", {
            method: "POST",
            headers: headers,
            body: '',
          });
          console.log("verified token");
        } catch (err: any) {
          console.log("not verified");
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
    })
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