import React, { useCallback, useEffect, useState } from "react";
import { StatusBar, Modal, Image, ActivityIndicator, Alert } from "react-native";
import Providers from "./utils/Providers";
import getYouTubeID from "get-youtube-id";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./screens/Home";
import Login from "./screens/Login";
import BatchDetails from "./screens/BatchDetails";
import DppQuiz from "./screens/DppQuiz";
import DppQuizSolution from "./screens/DppQuizSolution";
import PDFViewer from "./components/Global/pdf-viewer/pdf-viewer";
import MP4Player from "./components/Global/mp4-player";
import { OfflineHome } from "./screens/OfflineHome";
import OfflineBatchDetails from "./screens/OfflineBatchDetails";
import { DppQuizResult } from "./screens/DppQuizResult";
import Intro from "./screens/Splash";
import Video from "./screens/Video";
import MobileControl from "./screens/MobileControl";
import VideoPlayer from "./components/Global/video-player/player";
import useUdpServer from "./hooks/useUdpServer";
import PDFTronViewer from "./components/Global/pdf-viewer/pdf-viewer-2";
import { createNavigationContainerRef } from "@react-navigation/native";
import axios from "axios";
import YoutubePlayer from "react-native-youtube-iframe";
import ModalPDFViewer from "./components/Global/pdf-viewer/modal-pdf-viewer";
import sendGoogleAnalytics from "./utils/sendGoogleAnalytics";
import PendriveBatches from "./screens/PendriveBatches";
import PendriveBatchDetails from "./screens/PendriveBatchDetails";
import * as Updates from 'expo-updates';
import sendMongoAnalytics from "./utils/sendMongoAnalytics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Sentry from "@sentry/react-native";

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
    }
  }, []);

  async function onFetchUpdateAsync() {
    Sentry.captureMessage('Checking for updates');
    try {
      const update = await Updates.checkForUpdateAsync();
      console.log('update', update);
      Sentry.captureMessage('Update checked: ', update);
      
      // if (update.isAvailable) {
      //   await Updates.fetchUpdateAsync();
      //   await Updates.reloadAsync();
      //   Sentry.captureMessage('Successfully Updated');
      // }
       
      if (update.isAvailable) {
        Alert.alert(
          "Update Available",
          "A new version of the app is available. Would you like to update now?",
          [
            {
              text: "Not Now",
              onPress: () => console.log("Update deferred"),
              style: "cancel"
            },
            { 
              text: "Update", 
              onPress: async () => {
                await Updates.fetchUpdateAsync();
                await Updates.reloadAsync();
              }
            }
          ]
        );
      }
    } catch (error) {
      Sentry.captureException(error);
      console.error('Error fetching latest Expo update: ', error)
    }
  }

  useEffect(() => {
    sendGoogleAnalytics("app_open", {});
    sendMongoAnalytics("app_open", {});
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

  useEffect(() => {
    onFetchUpdateAsync()
    const init = async () => {
      const schoolData = await AsyncStorage.getItem('schoolData');
      console.log('schoolData', schoolData);
    }
    init();
    console.log('this is a test mesage 5.0')
  }, [])

  return (
    <Providers>
      <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="BatchDetails" component={BatchDetails} options={{ headerShown: false }} />
        <Stack.Screen name="Video" component={Video} options={{ headerShown: false }} />
        <Stack.Screen name="DppQuiz" component={DppQuiz} options={{ headerShown: false }} />
        <Stack.Screen name="DppQuizResult" component={DppQuizResult} options={{ headerShown: false }} />
        <Stack.Screen name="DppQuizSolution" component={DppQuizSolution} options={{ headerShown: false }} />
        <Stack.Screen name="OldPDFViewer" component={PDFViewer} options={{ headerShown: false }} />
        <Stack.Screen name="PDFViewer" component={PDFTronViewer} options={{ headerShown: false }} />
        <Stack.Screen name="OfflineHome" component={OfflineHome} options={{ headerShown: false }} />
        <Stack.Screen name="OfflineBatchDetails" component={OfflineBatchDetails} options={{ headerShown: false }} />
        <Stack.Screen name="MP4Player" component={MP4Player} options={{ headerShown: false }} />
        <Stack.Screen name="Intro" component={Intro} options={{ headerShown: false }} />
        <Stack.Screen name="MobileControl" component={MobileControl} options={{ headerShown: false }} />
        <Stack.Screen name="VideoPlayer" component={VideoPlayer} options={{ headerShown: false }} />
        <Stack.Screen name="PendriveBatches" component={PendriveBatches} options={{ headerShown: false }} />
        <Stack.Screen name="PendriveBatchDetails" component={PendriveBatchDetails} options={{ headerShown: false }} />
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
