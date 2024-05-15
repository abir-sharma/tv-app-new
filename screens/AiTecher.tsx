/// <reference types="nativewind/types" />

import { View } from 'react-native';
import Navbar from '../components/Navbar';
import Batches from '../components/Batches';
import Recent from '../components/Recent';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { WebView } from 'react-native-webview';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';

export default function AiTeacher({ navigation }: any) {

  const { setMainNavigation } = useGlobalContext();
  const websiteUrl = 'https://ai-teacher-alpha.vercel.app/';

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    setMainNavigation(navigation);
  }, [])

  const [requestingAudio, setRequestingAudio] = useState(true);
  const [requestingCamera, setRequestingCamera] = useState(true);


  async function requestAudioPermissions() {
    try {
      return await Audio.requestPermissionsAsync();
    } catch (err) {
      console.error("Failed to request permissions", err);
    } finally {
      setRequestingAudio(false);
    }
  }

  async function getAudioPermissions() {
    try {
      return await Audio.getPermissionsAsync();
    } catch (err) {
      console.error("Failed to get permissions", err);
    } finally {
      setRequestingAudio(false);
    }
  }

  async function requestCameraPermissions() {
    try {
      return await Camera.requestCameraPermissionsAsync();
    } catch (err) {
      console.error("Failed to get permission", err);
    } finally {
      setRequestingCamera(false);
    }
  }

  async function getCameraPermissions() {
    try {
      return await Camera.getCameraPermissionsAsync();
    } catch (err) {
      console.error("Failed to get permission", err);
    } finally {
      setRequestingCamera(false);
    }
  }

  useEffect(() => {
    (async () => {
      const permissions = await getAudioPermissions();
      if (permissions?.granted) {
        setRequestingAudio(false);
      } else {
        requestAudioPermissions();
      }
    })();
  }, []);

  useEffect(() => {
    if (requestingAudio) return;

    (async () => {
      const permissions = await getCameraPermissions();
      if (permissions?.granted) {
        setRequestingCamera(false);
      } else {
        requestCameraPermissions();
      }
    })();
  }, [requestingAudio]);

  if (requestingCamera) return null;

  return (
    <View className="bg-[#1A1A1A] flex-1">
      <WebView
        mediaCapturePermissionRequestType="grant"
        mediaPlaybackRequiresUserAction={false}
        source={{ uri: websiteUrl }}
        style={{ flex: 1 }}
      />
    </View>
  );
}
