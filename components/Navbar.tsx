/// <reference types="nativewind/types" />
import {
  FlatList,
  Image,
  Linking,
  Modal,
  NativeModules,
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useGlobalContext } from "../context/MainContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import QRCodeGenerator from "../screens/QrTest";
import { useEffect, useState } from "react";
// import useUdpServer from "../hooks/useUdpServer";

export default function Navbar() {
  const {
    mainNavigation,
    isOnline,
    setLogs,
    setIsOnline,
    headers,
    setHeaders,
    messageFromRemote,
  } = useGlobalContext();
  const [isQrModalVisible, setIsQrModalVisible] = useState(false);

  // const { sendMessageToClient } = useUdpServer();

  const handleLogout = async () => {
    try {
      mainNavigation.navigate("Login");
      AsyncStorage.clear();
      setHeaders(null);
      const res = await axios.post("https://api.penpencil.co/v1/oauth/logout", {
        headers,
      });
      if (res?.data?.success) {
      }
    } catch (err: any) {
      setLogs((logs) => [
        ...logs,
        "Error in LOGOUT API 2( Navbar component):" +
          JSON.stringify(err?.response),
      ]);
      console.log(err);
    }
  };

  const [phone, setPhone] = useState<string|null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(()=>{
    const getPhone = async () => {
      const temp = await AsyncStorage.getItem('phone');
      setPhone(temp);
    }
    getPhone();
  },[isDropdownVisible])

  

  return (
    <View className=" flex-row justify-between items-center p-4 ">
      {/* <View> */}
        <Modal
          transparent={true}
          animationType="fade"
          visible={isDropdownVisible}
          onRequestClose={() => setIsDropdownVisible(false)}
        >
            <TouchableWithoutFeedback onPress={() => setIsDropdownVisible(false)}>
            <View style={{ flex: 1 }}>
              <ScrollView className='bg-[#111111]/90 border-white/20 border-[1px] max-h-[200] overflow-hidden w-[10%] rounded-lg absolute top-[70] right-[20] z-[2]'>
                <Pressable onPress={()=>{}} className="w-full px-5 py-2"><Text className="text-white text-sm font-bold">{phone || "---"}</Text></Pressable>
                <View className="w-full h-[1px] bg-white/40"></View>
                <Pressable onPress={handleLogout} className="w-full px-5 py-2 rounded-b-lg"><Text className="text-white font-bold text-sm">Logout</Text></Pressable>
              </ScrollView>
            </View>
            </TouchableWithoutFeedback>
        </Modal>
      {/* </View> */}
      <Pressable
        hasTVPreferredFocus={true}
        android_ripple={{
          color: "rgba(255,255,255,0.5)",
          borderless: false,
          radius: 1000,
          foreground: true,
        }}
        className="flex-row justify-center items-center rounded-xl overflow-hidden px-2 gap-x-5"
      >
        <Image
          source={require("../assets/pw-logo.png")}
          className="w-10 h-10"
          width={10}
          height={10}
        />
        {/* <Text className='text-white font-medium text-xl ml-4'>Physics Wallah</Text> */}
      </Pressable>
      <View className="flex flex-row gap-2 absolute top-5 left-1/2 -translate-x-32">
        {/* <!-- <View className=' -ml-20 rounded-xl flex-row bg-[#0d0d0d] border-[1px] border-white/5'> */}
        <Pressable
          hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.5)",
            borderless: false,
            radius: 1000,
            foreground: true,
          }}
          onPress={() => {
            setIsOnline(true);
            mainNavigation.navigate("Home");
          }}
          // className={`w-52 h-10 overflow-hidden rounded-xl items-center justify-center ${isOnline ? "bg-white/10 border-[1px] border-white/20 " : ''}`}
          className={`w-36 h-10 rounded-xl items-center justify-center overflow-hidden ${isOnline && " bg-[#414347] "}  `}
          >
          <Text className={`text-white ${isOnline && "font-bold "}`}>Online Batches</Text>
        </Pressable>
        <Pressable
          android_ripple={{
            color: "rgba(255,255,255,0.4)",
            borderless: false,
            radius: 1000,
            foreground: true,
          }}
          onPress={() => {
            setIsOnline(false);
            mainNavigation.navigate("Offline");
          }}
          // className={`w-52 h-10 overflow-hidden rounded-xl items-center justify-center ${!isOnline ? "bg-white/10 border-[1px] border-white/20 " : ''}`}
          className="w-36 h-10 rounded-xl items-center justify-center overflow-hidden"
        >
          <Text className={`text-white ${!isOnline && " font-bold "}`}>Offline Batches</Text>
        </Pressable>
      </View>
      <View className="flex flex-row gap-2 items-center">
        <Pressable
          android_ripple={{
            color: "rgba(255,255,255,0.5)",
            borderless: false,
            radius: 1000,
            foreground: true,
          }}
          onPress={() => {
            // setIsQrModalVisible(true);
            mainNavigation?.navigate("QrTest");
          }}
          className="flex-row justify-center overflow-hidden rounded-full items-center"
        >
          <Text className="bg-white/10 overflow-hidden rounded-xm text-white px-5 py-3">
            Mobile Control
          </Text>
        </Pressable>
        <Pressable
          android_ripple={{
            color: "rgba(255,255,255,0.5)",
            borderless: false,
            radius: 1000,
            foreground: true,
          }}
          onPress={()=>{setIsDropdownVisible(prev=>!prev)}}
          className="flex-row justify-center overflow-hidden rounded-full items-center"
        >
          {/* <Text className="bg-white/10 overflow-hidden rounded-xm text-white flex items-center justify-center"> */}
            <Image source={require('../assets/dp.png')} className='w-10 h-10' width={40} height={40} />
          {/* </Text> */}
        </Pressable>
      </View>
      
    </View>
  );
}
