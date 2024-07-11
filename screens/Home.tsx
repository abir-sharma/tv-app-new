/// <reference types="nativewind/types" />
import { fromCSS } from "@bacons/css-to-expo-linear-gradient";
import { ScrollView, View } from 'react-native';
import Navbar from '../components/Navbar';
import Batches from '../components/Batches';
import Recent from '../components/Recent';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

export default function Home({ navigation }: any) {
  const { setHeaders } = useGlobalContext();

  useEffect(() =>
      navigation.addListener("beforeRemove", (e: any) => {e.preventDefault()})
  [navigation]);

  const handleLogin = async () => {
    const randu = uuidv4();
    AsyncStorage.getItem("token").then(async (res)=>{
      if (res) {
        setHeaders({
          Authorization: `Bearer ${res}`
        })
        try {
          const headers = { 'Authorization': `Bearer ${await AsyncStorage.getItem("token")}`, 'randomId': randu }
          const res = await fetch("https://api.penpencil.co/v3/oauth/verify-token", {
            method: "POST",
            headers: headers,
            body: '',
          });
        } catch (err: any) {
          await AsyncStorage.removeItem("token");
          navigation?.navigate('Login')
        }
        navigation?.navigate('Home')
      }
      else {
        navigation?.navigate('Login')
      }
    })
  }

  useEffect(() => {
    handleLogin();
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
