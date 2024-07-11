import React, { useCallback, useEffect, useState } from "react";
import { StatusBar, Modal, Image, ActivityIndicator } from "react-native";
import Providers from "./utils/Providers";
import getYouTubeID from "get-youtube-id";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Details from "./screens/Details";
import Videos from "./screens/Videos";
import Tests from "./screens/Tests";
import TestSolutions from "./screens/TestSolutions";
import PDFViewer from "./components/pdf-viewer/pdf-viewer";
import MP4Player from "./components/mp4-player/mp4-player";
import AiTeacher from "./screens/AiTecher";
import { Offline } from "./screens/Offline";
import OfflineDetails from "./screens/OfflineDeatils";
import { TestResult } from "./screens/TestResult";
import Attendance from "./screens/Attendance";
import Intro from "./screens/Intro";
import RecentVideos from "./screens/RecentVideos";
import MobileControlQR from "./screens/MobileControlQR";
import VideoPlayer from "./components/video-player/player";
import useUdpServer from "./hooks/useUdpServer";
import PDFTronViewer from "./components/pdf-viewer/pdf-viewer-2";
import { createNavigationContainerRef } from "@react-navigation/native";
import axios from "axios";
import YoutubePlayer from "react-native-youtube-iframe";
import ModalPDFViewer from "./components/pdf-viewer/modal-pdf-viewer";
import sendGoogleAnalytics from "./hooks/sendGoogleAnalytics";

const Stack = createNativeStackNavigator();

export default function App() {
  const { connectionStatus, message, ipAddress, sendMessageToClient } =
    useUdpServer();
  // modals
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [showImgModal, setShowImgModal] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const navigationRef = createNavigationContainerRef();

  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
      Alert.alert("video has finished playing!");
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    sendGoogleAnalytics("app_open", {});
  }, []);

  useEffect(() => {
    try {
      if (message) {
        const msg = JSON.parse(message);

        if (msg.type === "youtube") {
          setYoutubeUrl(msg.url);
          setShowYoutubeModal(true);
          sendMessageToClient("youtube");
          setShowImgModal(false);
          setShowPdfModal(false);
        } else if (msg.type == "close_modal") {
          setShowYoutubeModal(false);
          setShowImgModal(false);
          setShowPdfModal(false);
        } else if (msg.type == "serve_pdf") {
          setPdfUrl("");
          setShowPdfModal(true);
          axios.get(msg.requestUrl)
            .then((res) => {
              let pdfUrl = res.data.uri;
              setShowYoutubeModal(false);
              setShowImgModal(false);
              setPdfUrl(pdfUrl);
              setShowPdfModal(true);
            })
            .catch((err) => {
              setShowPdfModal(false);
            });
        } else if (msg.type == "serve_image") {
          setImgUrl("");
          setShowImgModal(true);
          axios
            .get(msg.requestUrl)
            .then((res) => {
              let imgUrl = res.data.uri;
              setShowPdfModal(false);
              setShowYoutubeModal(false);
              setImgUrl(imgUrl);
              setShowImgModal(true);
            })
            .catch((err) => {
              setShowImgModal(false);
            });
        }
      }
    } catch (err) {
      console.error('use effect error - App.js', err)
    }
  }, [message]);

  return (
    <Providers>
      <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="AiTeacher" component={AiTeacher} options={{ headerShown: false }} />
        <Stack.Screen name="Attendance" component={Attendance} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Details" component={Details} options={{ headerShown: false }} />
        <Stack.Screen name="Videos" component={Videos} options={{ headerShown: false }} />
        <Stack.Screen name="RecentVideos" component={RecentVideos} options={{ headerShown: false }} />
        <Stack.Screen name="Tests" component={Tests} options={{ headerShown: false }} />
        <Stack.Screen name="TestResult" component={TestResult} options={{ headerShown: false }} />
        <Stack.Screen name="TestSolutions" component={TestSolutions} options={{ headerShown: false }} />
        <Stack.Screen name="OldPDFViewer" component={PDFViewer} options={{ headerShown: false }} />
        <Stack.Screen name="PDFViewer" component={PDFTronViewer} options={{ headerShown: false }} />
        <Stack.Screen name="Offline" component={Offline} options={{ headerShown: false }} />
        <Stack.Screen name="OfflineDetails" component={OfflineDetails} options={{ headerShown: false }} />
        <Stack.Screen name="MP4Player" component={MP4Player} options={{ headerShown: false }} />
        <Stack.Screen name="Intro" component={Intro} options={{ headerShown: false }} />
        <Stack.Screen name="MobileControlQR" component={MobileControlQR} options={{ headerShown: false }} />
        <Stack.Screen name="VideoPlayer" component={VideoPlayer} options={{ headerShown: false }} />
      </Stack.Navigator>
      {/* <StatusBar hidden /> */}
      <StatusBar backgroundColor="#000" barStyle="light-content" />
      </NavigationContainer>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showYoutubeModal}
        onRequestClose={() => {
          setShowYoutubeModal(true);
        }}
      >
        {youtubeUrl && (
          <YoutubePlayer
            height={"100%"}
            play={playing}
            videoId={`${getYouTubeID(youtubeUrl)}`}
            onChangeState={onStateChange}
          />
        )}
      </Modal>

      {/* image modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={showImgModal}
        onRequestClose={() => {
          setShowImgModal(false);
        }}
      >
        {imgUrl == "" && (
          <ActivityIndicator
            size="large"
            color="#000"
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        )}
        {imgUrl && (
          <Image
            source={{ uri: imgUrl }}
            style={{
              flex: 1,
              resizeMode: "contain", // Add this line
              margin: 0,
              borderRadius: 0,
            }}
          />
        )}
      </Modal>

      <Modal
        animationType="slide"
        transparent={false}
        visible={showPdfModal}
        onRequestClose={() => {
          setShowPdfModal(false);
        }}
      >
        {pdfUrl == "" && (
          <ActivityIndicator
            size="large"
            color="#000"
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        )}
        {pdfUrl && (<ModalPDFViewer pdfUrl={pdfUrl} />)}
      </Modal>
    </Providers>
  );
}
