/// <reference types="nativewind/types" />
import { fromCSS } from "@bacons/css-to-expo-linear-gradient";
import { ScrollView, ToastAndroid, View } from 'react-native';
import Navbar from '../components/Global/Navbar';
import Batches from '../components/Home/Batches';
import Recent from "../components/Home/Recent";
import { useEffect, useState } from 'react';
import { useGlobalContext } from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import NetInfo from "@react-native-community/netinfo";

export default function Home({ navigation }: any) {
  const { setHeaders, getPaidBatches } = useGlobalContext();

  // const handleLogin = async () => {
  //   const randu = uuidv4();
  //   AsyncStorage.getItem("token").then(async (res)=>{
  //     if (res) {
  //       setHeaders({
  //         Authorization: `Bearer ${res}`
  //       })
  //       try {
  //         const headers = { 'Authorization': `Bearer ${await AsyncStorage.getItem("token")}`, 'randomId': randu }
  //         const res = await axios.post("https://api.penpencil.co/v3/oauth/verify-token", {}, { headers });
  //       } catch (err: any) {
  //         console.log("LOGGING HERE....", err.response.data.code);
  //         if(err.response.data.code === 401){
  //         const storedRefreshToken = await AsyncStorage.getItem("refreshToken");
  //         if(storedRefreshToken) {
  //           try{
  //             console.log("resfresh token there...");
  //           const response = await axios.post("https://api.penpencil.co/v3/oauth/refresh-token", 
  //             {
  //               client_id: "system-admin",
  //               client_secret: "KjPXuAVfC5xbmgreETNMaL7z",
  //               refresh_token: storedRefreshToken,
  //             }
  //           );        
  //           console.log("ref res:  ",response.data.data);
  //           await AsyncStorage.setItem("token", response.data.data.access_token);
  //           await AsyncStorage.setItem("refreshToken", response.data.data.refresh_token);
  //           await handleLogin();
  //         }catch(err){
  //           // @ts-ignore
  //           console.log("err: ", err);
  //           await AsyncStorage.removeItem("token");
  //           await AsyncStorage.removeItem("refreshToken");
  //           navigation?.navigate('Login')
  //         }
  //         }
  //         else{
  //           await AsyncStorage.removeItem("token");
  //           navigation?.navigate('Login')
  //         }
  //       }
  //         navigation?.navigate('Home')
  //       }
  //     }
  //     else {
  //       navigation?.navigate('Login')
  //     } 
  //   })
  // }

  const checkToken = async () => {
    const connected = await NetInfo.fetch();
    if (!connected.isConnected) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'PendriveBatches' }],
      });
      ToastAndroid.show("No internet connection", ToastAndroid.SHORT);
      return;
    }
    const randu = uuidv4();
    const token = await AsyncStorage.getItem("token");
    if (token) {
      const headers: any = { 'Authorization': `Bearer ${token}`, 'randomId': randu }
      const res = await axios.post("https://api.penpencil.co/v3/oauth/verify-token", {}, { headers });
      if (res.data.data.isVerified != true) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } else {
        getPaidBatches();
      }
    } else {
      console.log("Token not found");
    }
  }

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <LinearGradient
      {...fromCSS(
        `linear-gradient(276.29deg, #2D3A41 6.47%, #2D3A41 47.75%, #000000 100%)`
      )}
      className=" flex-1"
    >
      <Navbar />
      <ScrollView>
        <Batches />
        <Recent />
      </ScrollView>
    </LinearGradient>
  );
}
