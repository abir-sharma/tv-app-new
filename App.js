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
import MP4Player from './components/mp4-player/mp4-player';
import AiTeacher from './screens/AiTecher';
import { Offline } from './screens/Offline';
import OfflineDetails from './screens/OfflineDeatils';
import { TestResult } from './screens/TestResult';
import Attendance from './screens/Attendance';
import Intro from './screens/Intro';
import QRCodeGenerator from './screens/QrTest';

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <Providers>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
          <Stack.Screen name="AiTeacher" component={AiTeacher} options={{ headerShown: false }} />
          <Stack.Screen name="Attendance" component={Attendance} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="Details" component={Details} options={{ headerShown: false }} />
          <Stack.Screen name="Videos" component={Videos} options={{ headerShown: false }} />
          <Stack.Screen name="Tests" component={Tests} options={{ headerShown: false }} />
          <Stack.Screen name="TestResult" component={TestResult} options={{ headerShown: false }} />
          <Stack.Screen name="TestSolutions" component={TestSolutions} options={{ headerShown: false }} />
          <Stack.Screen name="PDFViewer" component={PDFViewer} options={{ headerShown: false }} />
          <Stack.Screen name="Offline" component={Offline} options={{ headerShown: false }} />
          <Stack.Screen name="OfflineDetails" component={OfflineDetails} options={{ headerShown: false }} />
          <Stack.Screen name="MP4Player" component={MP4Player} options={{ headerShown: false }} />
          <Stack.Screen name="Intro" component={Intro} options={{ headerShown: false }} />
          <Stack.Screen name="QrTest" component={QRCodeGenerator} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Providers>
  );
}
