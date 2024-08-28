/// <reference types="nativewind/types" />
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useGlobalContext } from "../../context/MainContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import sendGoogleAnalytics from "../../utils/sendGoogleAnalytics";
import { useNavigation } from "@react-navigation/native";
import { Images } from "../../images/images";
import sendMongoAnalytics from "../../utils/sendMongoAnalytics";
import { FileSystem } from "react-native-file-access";
import * as Sentry from "@sentry/react-native";

export default function Navbar() {
  const { isOnline, setLogs, setIsOnline, headers, setHeaders, setPENDRIVE_BASE_URL } = useGlobalContext();
  const navigation = useNavigation();
  const [phone, setPhone] = useState<string|null>(null);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [offlineSourceDropdown, setOfflineSourceDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      // @ts-expect-error
      navigation.navigate("Login");
      AsyncStorage.clear();
      setHeaders(null);
      const res = await axios.post("https://api.penpencil.co/v1/oauth/logout", {
        headers,
      });
      if (res?.data?.success) {
      }
    } catch (err: any) {
      Sentry.captureException(err);
      setLogs((logs) => [
        ...logs,
        "Error in LOGOUT API 2( Navbar component):" +
          JSON.stringify(err?.response),
      ]);
    }
  };

  const Seperator = () => {
    return (
      <View className="w-full h-[1px] bg-white/40"></View>
    )
  }

  useEffect(()=>{
    const getPhone = async () => {
      const temp = await AsyncStorage.getItem('phone');
      setPhone(temp);
    }
    getPhone();
  }, [isDropdownVisible])

  return (
    <View className=" flex-row justify-between items-center p-4 ">
        <Modal
          transparent={true}
          animationType="fade"
          visible={isDropdownVisible}
          onRequestClose={() => setIsDropdownVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsDropdownVisible(false)}>
            <View style={{ flex: 1 }}>
              <ScrollView className='bg-[#111111]/90 border-white/20 border-[1px] max-h-[200] overflow-hidden w-[10%] rounded-lg absolute top-[70] right-[20] z-[2]'>
                <View className="w-full px-5 py-2"><Text className="text-white text-sm font-bold">v1.0.1</Text></View>
                <Seperator />
                <View className="w-full px-5 py-2"><Text className="text-white text-sm font-bold">{phone || "---"}</Text></View>
                <Seperator />
                <Pressable onPress={handleLogout} className="w-full px-5 py-2 rounded-b-lg"><Text className="text-white font-bold text-sm">Logout</Text></Pressable>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <Modal
          transparent={true}
          animationType="fade"
          visible={offlineSourceDropdown}
          onRequestClose={() => setOfflineSourceDropdown(false)}
        >
          <TouchableWithoutFeedback onPress={() => setOfflineSourceDropdown(false)}>
            <View style={{ flex: 1 }}>
              <ScrollView className='bg-[#111111]/90 border-white/20 border-[1px] max-h-[200] overflow-hidden w-[10%] rounded-lg absolute top-[70] right-[150] z-[2]'>
                <Pressable onPress={() => {
                  setPENDRIVE_BASE_URL("/storage/emulated/0/Download/Batches");
                  setOfflineSourceDropdown(false);
                }} className="w-full px-5 py-2"><Text className="text-white text-sm font-bold">SD Card</Text></Pressable>
                <Seperator />
                <Pressable onPress={() => {
                FileSystem.ls("/mnt/media_rw")
                  .then(async (files) => {
                    if (files.length > 0) {
                      let batchesPd: string = '';
                      for (const pd of files) {
                        const ls = await FileSystem.ls(`/mnt/media_rw/${pd}`);
                        if (ls.includes("Batches")) {
                          batchesPd = pd;
                          break;
                        }
                      }
                      if (batchesPd === '') {
                        ToastAndroid.show("No Batches folder found in any pendrive", ToastAndroid.SHORT);
                        return;
                      }
                      const url = `/mnt/media_rw/${batchesPd}/Batches`;
                      setPENDRIVE_BASE_URL(url);
                      setOfflineSourceDropdown(false);
                      console.log(`PENDRIVE_BASE_URL set to: ${url}`);
                    } else {
                      ToastAndroid.show("No pendrive detected", ToastAndroid.SHORT);
                      setOfflineSourceDropdown(false);
                    }
                  })
                  .catch((error) => {
                    Sentry.captureException(error);
                    console.error("Error reading /mnt/media_rw:", error);
                  });
              }} className="w-full px-5 py-2"><Text className="text-white text-sm font-bold">Pendrive</Text>
              </Pressable>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
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
          source={Images.pwLogo}
          className="w-10 h-10"
          width={10}
          height={10}
        />
      </Pressable>
      <View className="flex flex-row gap-2 absolute top-5 left-1/2 -translate-x-32">
        <Pressable
          android_ripple={{
            color: "rgba(255,255,255,0.5)",
            borderless: false,
            radius: 1000,
            foreground: true,
          }}
          onPress={async () => {
            setIsOnline(true);
            sendGoogleAnalytics("online_mode_clicked", {});
            sendMongoAnalytics("online_mode_clicked", {});
            // @ts-expect-error
            navigation.navigate("Home");
          }}
          className={`w-36 h-10 rounded-xl items-center justify-center overflow-hidden ${isOnline && "bg-[#414347]"} `}
          >
          <Text className={`text-white ${isOnline && "font-bold "}`}>Online Batches</Text>
        </Pressable>
        {/* <Pressable
          android_ripple={{
            color: "rgba(255,255,255,0.4)",
            borderless: false,
            radius: 1000,
            foreground: true,
          }}
          onPress={async () => {
            setIsOnline(false);
            sendGoogleAnalytics("offline_mode_clicked", {});
            sendMongoAnalytics("offline_mode_clicked", {});
            // @ts-expect-error
            navigation.navigate("OfflineHome");
          }}
          // className="w-36 h-10 rounded-xl items-center justify-center overflow-hidden"
          className={`w-36 h-10 rounded-xl items-center justify-center overflow-hidden ${!isOnline && "bg-[#414347]"} `}
        >
          <Text className={`text-white ${!isOnline && " font-bold "}`}>Offline Batches</Text>
        </Pressable> */}
        <Pressable
          android_ripple={{
            color: "rgba(255,255,255,0.4)",
            borderless: false,
            radius: 1000,
            foreground: true,
          }}
          onPress={async () => {
            setIsOnline(false);
            sendGoogleAnalytics("offline_mode_clicked", {
              mode: "pendrive"
            });
            sendMongoAnalytics("offline_mode_clicked", {
              mode: "pendrive"
            });
            // @ts-expect-error
            navigation.navigate("PendriveBatches");
          }}
          // className="w-36 h-10 rounded-xl items-center justify-center overflow-hidden"
          className={`w-36 h-10 rounded-xl items-center justify-center overflow-hidden ${!isOnline && "bg-[#414347]"} `}
        >
          <Text className={`text-white ${!isOnline && " font-bold "}`}>Offline Batches</Text>
        </Pressable>
      </View>
      <View className="flex flex-row gap-2 items-center">
        {/* offline source dropdown */}
        { !isOnline &&
          <Pressable
            android_ripple={{
              color: "rgba(255,255,255,0.5)",
              borderless: false,
              radius: 1000,
              foreground: true,
            }}
            onPress={()=>{setOfflineSourceDropdown(prev=>!prev)}}
            className="flex-row justify-center overflow-hidden rounded-full items-center"
          >
            <Text className="bg-white/10 overflow-hidden rounded-xm text-white px-5 py-3">
              Offline Source
            </Text>
          </Pressable>
        }       

        {/* mobile control button */}
        <Pressable
          android_ripple={{
            color: "rgba(255,255,255,0.5)",
            borderless: false,
            radius: 1000,
            foreground: true,
          }}
          onPress={() => {
            // @ts-expect-error
            navigation.navigate("MobileControl");
            sendGoogleAnalytics("mobile_control_clicked", {});
            sendMongoAnalytics("mobile_control_clicked", {});
            Sentry.captureMessage("Mobile Control clicked");
          }}
          className="flex-row justify-center overflow-hidden rounded-full items-center"
        >
          <Text className="bg-white/10 overflow-hidden rounded-xm text-white px-5 py-3">
            Mobile Control
          </Text>
        </Pressable>

        {/* profile picture (dropdown) */}
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
          <Image source={Images.dp} className='w-10 h-10' width={40} height={40} />
        </Pressable>
      </View>
    </View>
  );
}
