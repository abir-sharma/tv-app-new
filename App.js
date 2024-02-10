import Providers from './utils/Providers';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './screens/Home'
import Details from './screens/Details'
import Videos from './screens/Videos'
import PDFViewer from './components/pdf-viewer/pdf-viewer'

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <Providers>
      <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
        <Stack.Screen name="Details" component={Details} options={{headerShown: false}}/>
        <Stack.Screen name="Videos" component={Videos} options={{headerShown: false}} />
        {/* <Stack.Screen name="PDFViewer" component={PDFViewer} options={{headerShown: false}} /> */}
      </Stack.Navigator>
    </NavigationContainer>
    </Providers>
  );
}
