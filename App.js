import React, { useEffect, useState } from "react";
import { StatusBar, Modal, Image } from "react-native";
import Providers from "./utils/Providers";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Details from "./screens/Details";
import Videos from "./screens/Videos";
import Tests from "./screens/Tests";
import TestSolutions from "./screens/TestSolutions";
import PDFViewer from "./components/pdf-viewer/pdf-viewer";
import PDFViewer2 from "./components/pdf-viewer/pdf-viewer-2";
import MP4Player from "./components/mp4-player/mp4-player";
import AiTeacher from "./screens/AiTecher";
import { Offline } from "./screens/Offline";
import OfflineDetails from "./screens/OfflineDeatils";
import { TestResult } from "./screens/TestResult";
import Attendance from "./screens/Attendance";
import Intro from "./screens/Intro";
import RecentVideos from "./screens/RecentVideos";
import QRCodeGenerator from "./screens/QrTest";
import VideoPlayer from "./components/video-player/player";
import AsyncStorage from "@react-native-async-storage/async-storage";
import VideoTest from "./screens/VideoTest";
import UDPClient from "./screens/UDPClient";
import useUdpServer from "./hooks/useUdpServer";
import WebView from "react-native-webview";
import { useGlobalContext } from "./context/MainContext";
import PDFTronViewer from "./components/pdf-viewer/pdf-viewer-2";
import { createNavigationContainerRef } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

export default function App() {
    const { connectionStatus, message, ipAddress, sendMessageToClient } = useUdpServer();
    // modals
    const [showYoutubeModal, setShowYoutubeModal] = useState(false);
    const [youtubeUrl, setYoutubeUrl] = useState("");
    // const [pdfUrl, setPdfUrl] = useState("");
    // const [showPdfModal, setShowPdfModal] = useState(false);
    const [pdfChunks, setPdfChunks] = useState([]);
    const [imgChunks, setImgChunks] = useState([]);
    const [showImgModal, setShowImgModal] = useState(false);
    const [imgUrl, setImgUrl] = useState("");
    const navigationRef = createNavigationContainerRef();

  // useEffect(() => {
  //   let localUrl = "";
  //   try {
  //     if (message && JSON.parse(message)?.type == "youtube") {
  //       setYoutubeUrl(JSON.parse(message)?.url);
  //       setShowYoutubeModal(true);
  //       sendMessageToClient("youtube");
  //     }
  //     if (message && JSON.parse(message)?.type == "pdf_chunk") {
  //       // navigationRef.current.navigate("PDFViewer", { pdfUrl: JSON.parse(message)?.url });
  //       if (JSON.parse(message)?.index == 0) {
  //         // setPdfUrl(JSON.parse(message)?.chunk);
  //         localUrl = JSON.parse(message)?.chunk;
  //       } else {
  //         // setPdfUrl(pdfUrl + JSON.parse(message)?.chunk);
  //         localUrl += JSON.parse(message)?.chunk;
  //       }
  //       if (JSON.parse(message)?.type == "pdf_chunk_end") {
  //         navigationRef.current.navigate("PDFViewer", { pdfUrl: `data:application/pdf;base64,${localUrl}` });
  //       }
  //     }
  //   } catch (err) {
  //     console.log("err while parsing", err);
  //   }
  // }, [message]);

  useEffect(() => {
    try {
      if (message) {
        const msg = JSON.parse(message);

        if (msg.type === "youtube") {
          setYoutubeUrl(msg.url);
          setShowYoutubeModal(true);
          sendMessageToClient("youtube");
          setShowImgModal(false);
        } else if (msg.type == "pdf_chunk_start") {
          setPdfChunks([]);
          setShowYoutubeModal(false);
          setShowImgModal(false);
        } else if (msg.type === "pdf_chunk") {
          setPdfChunks((prevChunks) => [...prevChunks, msg]);
        } else if (msg.type == "pdf_chunk_end") {
          const sortedChunks = pdfChunks.sort((a, b) => a.index - b.index);
          const pdfData = sortedChunks.map((chunk) => chunk.chunk).join("");
          navigationRef.current.navigate("OldPDFViewer", { pdfUrl: `data:application/pdf;base64,${pdfData}` });
        } else if (msg.type == "image_chunk_start") {
          setImgChunks([]);
          setShowYoutubeModal(false);
        } else if (msg.type === "image_chunk") {
          setImgChunks((prevChunks) => [...prevChunks, msg]);
        } else if (msg.type == "image_chunk_end") {
          const sortedChunks = imgChunks.sort((a, b) => a.index - b.index);
          const imgData = sortedChunks.map((chunk) => chunk.chunk).join("");
          setImgUrl(`data:image/png;base64,${imgData}`);
          setShowImgModal(true);
        } else if (msg.type == "close_modal") {
          setShowYoutubeModal(false);
          setShowImgModal(false);
        }
      }
    } catch (err) {
      console.log("Error while parsing message:", err);
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
          <Stack.Screen name="PDFViewer" component={PDFViewer2} options={{ headerShown: false }} />
          <Stack.Screen name="Offline" component={Offline} options={{ headerShown: false }} />
          <Stack.Screen name="OfflineDetails" component={OfflineDetails} options={{ headerShown: false }} />
          <Stack.Screen name="MP4Player" component={MP4Player} options={{ headerShown: false }} />
          <Stack.Screen name="Intro" component={Intro} options={{ headerShown: false }} />
          <Stack.Screen name="QrTest" component={QRCodeGenerator} options={{ headerShown: false }} />
          <Stack.Screen name="VideoPlayer" component={VideoPlayer} options={{ headerShown: false }} />
          <Stack.Screen name="VideoTest" component={VideoTest} options={{ headerShown: false }} />
          <Stack.Screen name="UDPClient" component={UDPClient} options={{ headerShown: false, orientation: "portrait" }} />
        </Stack.Navigator>
        {/* <StatusBar hidden /> */}
        <StatusBar backgroundColor="#000" barStyle="light-content" />
      </NavigationContainer>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showYoutubeModal}
        onRequestClose={() => {
          setShowYoutubeModal(false);
        }}
      >
        <WebView source={{ uri: youtubeUrl }} style={{ flex: 1 }} />
      </Modal>
      {/* image modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showImgModal}
        onRequestClose={() => {
          setShowImgModal(false);
        }}
      >
        <Image source={{ uri: imgUrl }} style={{ flex: 1, margin: 0, borderRadius: 0 }} />
      </Modal>
    </Providers>
  );
}
