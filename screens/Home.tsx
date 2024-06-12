/// <reference types="nativewind/types" />

import { View, Modal, Text, Button } from "react-native";
import Navbar from "../components/Navbar";
import Batches from "../components/Batches";
import Recent from "../components/Recent";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/MainContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
// import useUdpClient from '../hooks/useUdpClient';
import WebView from "react-native-webview";
// import useUdpServer from "../hooks/useUdpServer";

export default function Home({ navigation }: any) {
  // const { message, sendMessageToClient } = useUdpServer();
  const { setMainNavigation, setLogs, mainNavigation, setHeaders } =
    useGlobalContext();
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e: any) => {
        e.preventDefault();
      }),
    [navigation]
  );

  // useEffect(() => {
  //   console.log("message", message);
  //   try {
  //     if (message && JSON.parse(message)?.type == "youtube") {
  //       setYoutubeUrl(JSON.parse(message)?.url);
  //       setShowYoutubeModal(true);
  //       sendMessageToClient("youtube");
  //     }
  //   } catch (err) {
  //     console.log("err while parsing", err);
  //   }
  // }, [message]);

  const handleLogin = async () => {
    if (await AsyncStorage.getItem("token")) {
      console.log(await AsyncStorage.getItem("token"));
      setHeaders({
        Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
      });
      try {
        const res = await axios.post(
          "https://api.penpencil.co/v3/oauth/verify-token",
            {
              Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
              randomId: Math.random(),
            }
        );
      } catch (err: any) {
        setLogs((logs) => [
          ...logs,
          "Error in VERIFY TOKEN API:" + JSON.stringify(err.response),
        ]);
        await AsyncStorage.removeItem("token");
        mainNavigation?.navigate("Login");
      }
      mainNavigation?.navigate("Home");
    } else {
      console.log("not logged in");
      navigation?.navigate('Login')
    }
  };

  useEffect(() => {
    setMainNavigation(navigation);
    handleLogin();
  }, []);

  return (
    <View className="bg-[#111111] flex-1">
      <Navbar />
      <Batches />
      <Recent />

      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={showYoutubeModal}
        onRequestClose={() => {
          setShowYoutubeModal(false);
        }}
      >
        <WebView source={{ uri: youtubeUrl }} style={{ flex: 1, margin: 10 }} />
      </Modal> */}
    </View>
  );
}
