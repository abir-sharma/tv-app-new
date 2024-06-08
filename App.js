import Providers from './utils/Providers';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home'
import Login from './screens/Login'
import Details from './screens/Details'
import Videos from './screens/Videos'
import Tests from './screens/Tests'
import TestSolutions from './screens/TestSolutions'
import PDFViewer from './components/pdf-viewer/pdf-viewer';
import PDFViewer2 from './components/pdf-viewer/pdf-viewer-2';
import MP4Player from './components/mp4-player/mp4-player';
import AiTeacher from './screens/AiTecher';
import { Offline } from './screens/Offline';
import OfflineDetails from './screens/OfflineDeatils';
import { TestResult } from './screens/TestResult';
import Attendance from './screens/Attendance';
import Intro from './screens/Intro';
import RecentVideos from './screens/RecentVideos';
import QRCodeGenerator from './screens/QrTest';
import VideoPlayer from './components/video-player/player';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VideoTest from './screens/VideoTest';
import UDPClient from './screens/UDPClient';
import Test from './screens/Test';
import { StatusBar } from 'react-native';

const Stack = createNativeStackNavigator();


export default function App() {

  AsyncStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTgzNzA4NTMuNzA0LCJkYXRhIjp7Il9pZCI6IjYwYzliZmQ1ZWM0NjliMDAxZmE3YTc3MiIsInVzZXJuYW1lIjoiOTM5NDI1NTc1NiIsImZpcnN0TmFtZSI6IkFybmFiIiwibGFzdE5hbWUiOiJSb3kiLCJvcmdhbml6YXRpb24iOnsiX2lkIjoiNWViMzkzZWU5NWZhYjc0NjhhNzlkMTg5Iiwid2Vic2l0ZSI6InBoeXNpY3N3YWxsYWguY29tIiwibmFtZSI6IlBoeXNpY3N3YWxsYWgifSwiZW1haWwiOiJtci5yb3kuYXJuYWJAZ21haWwuY29tIiwicm9sZXMiOlsiNWIyN2JkOTY1ODQyZjk1MGE3NzhjNmVmIl0sImNvdW50cnlHcm91cCI6IklOIiwidHlwZSI6IlVTRVIifSwiaWF0IjoxNzE3NzY2MDUzfQ.F58_mob5SDmml8lA-rVYZRZsP9aU0Np0W_ohKBGyw0E');

  return (
    <Providers>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='QrTest'>
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
          <Stack.Screen name="PDFViewer" component={PDFViewer2} options={{ headerShown: false }} />
          <Stack.Screen name="Offline" component={Offline} options={{ headerShown: false }} />
          <Stack.Screen name="OfflineDetails" component={OfflineDetails} options={{ headerShown: false }} />
          <Stack.Screen name="MP4Player" component={MP4Player} options={{ headerShown: false }} />
          <Stack.Screen name="Intro" component={Intro} options={{ headerShown: false }} />
          <Stack.Screen name="QrTest" component={QRCodeGenerator} options={{ headerShown: false }} />
          <Stack.Screen name="VideoPlayer" component={VideoPlayer} options={{ headerShown: false }} />
          <Stack.Screen name="VideoTest" component={VideoTest} options={{ headerShown: false }} />
          <Stack.Screen name="UDPClient" component={UDPClient} options={{ headerShown: false, orientation: 'portrait' }} />
          <Stack.Screen name="Test" component={Test} options={{ headerShown: false, orientation: 'portrait' }} />
        </Stack.Navigator>
        <StatusBar hidden />
      </NavigationContainer>
    </Providers>
  );
}
