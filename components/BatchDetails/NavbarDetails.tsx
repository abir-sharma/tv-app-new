/// <reference types="nativewind/types" />
import { Image, Text, Pressable, View} from 'react-native';
import { useGlobalContext } from '../../context/MainContext';
import { useNavigation } from '@react-navigation/native';
import { Images } from '../../images/images';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Sentry from "@sentry/react-native";

export default function NavbarDetails({ selectedMenu, setSelectedMenu, setContentType, setCurrentPage }: NavbarDetailsPropType) {
  const navigation = useNavigation();
 
  const { setSelectedSubject, batchDetails, setRecentVideoLoad, setTopicList, setSelectSubjectSlug, setSelectedBatch, setSelectedChapter, headers, setHeaders, setLogs } = useGlobalContext(); 


const handleLogout = async () => {
  let logoutApiSuccess = false;
  try {
    const res = await axios.post("https://api.penpencil.co/v1/oauth/logout", {}, { headers: headers });
    logoutApiSuccess = res?.data?.success;
  } catch (err: any) {
    Sentry.captureException(err);
    setLogs((logs) => [ ...logs, "Logout API failed (continuing with local cleanup): " + JSON.stringify(err?.response?.data || err?.message),]);
  }
  try {
    await AsyncStorage.clear();
    setHeaders(null); 
  } catch (clearError) {
    console.error("Critical: Failed to clear local storage:", clearError);
    Sentry.captureException(clearError);
  }
  try {
    // @ts-expect-error
    navigation.navigate("Login");
  } catch (navError) {
    console.error("Navigation error:", navError);
  }
  if (logoutApiSuccess) {
    console.log("Logout successfully");
  } else {
    console.log("Logout completed but server logout may have failed)");
  }
};

    return (

    <View className=" flex-row justify-between items-center p-4 bg-[#E1BD6433] border-b-[1px] border-gray-400">
      <View className='flex flex-row items-center justify-center gap-2'>
        <Pressable
          hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.4)",
            borderless: false,
            radius: 1000,
            foreground: true
          }}
          onPress={() => {
            // @ts-expect-error
            navigation.navigate('Home');
            setRecentVideoLoad(prev => !prev);
            setSelectedBatch(null);
            setSelectSubjectSlug(null);
            setSelectedSubject(null);
            setSelectedChapter(null);
            setTopicList(null);
            setSelectedMenu(0);
          }}
          className='flex-row justify-center items-center rounded-xl overflow-hidden px-2'>
          <Image source={Images.arrowLeft} className='w-2 h-3' width={10} height={10} tintColor={"#6B7280"}/>
        </Pressable>
        
        <Text className=' text-gray-500'>Home</Text>
        {batchDetails?.name && <Text className='font-medium text-black/70'>/ {batchDetails?.name.length > 10 ? `${batchDetails.name.substring(0,12)}...` : batchDetails.name}</Text> }
      </View>

      <View className=' rounded-xl flex-row py-2 pr-20' >
        <Pressable hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.4)",
            borderless: false,
            radius: 1000,
            foreground: true
          }} className='w-24 items-center h-10 justify-center rounded-l-lg overflow-hidden border-l border-r border-t border-r-gray-400 border-t-gray-400 border-l-gray-400' style={{ backgroundColor: selectedMenu == 0 ? '#f9c545' : 'white',borderBottomWidth: selectedMenu == 0 ? 4 : 3 }}
          onPress={() => { setSelectedMenu(0); setContentType('videos'); setCurrentPage(1) }}>
          <Text className="font-normal text-sm text-black">Lectures</Text>
        </Pressable>
        <Pressable hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.4)",
            borderless: false,
            radius: 1000,
            foreground: true
          }} className='w-20 items-center h-10 justify-center overflow-hidden border-r border-t border-r-gray-400 border-t-gray-400 ' style={{ backgroundColor: selectedMenu == 1 ? '#f9c545' : 'white',borderBottomWidth: selectedMenu == 1 ? 4 : 3 }} onPress={() => { setSelectedMenu(1); setContentType('notes'); setCurrentPage(1) }}>
          <Text className="font-normal text-sm text-black">Notes</Text>
        </Pressable>
        <Pressable hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.4)",
            borderless: false,
            radius: 1000,
            foreground: true
          }} className='w-24 items-center h-10 justify-center overflow-hidden border-r border-t border-r-gray-400 border-t-gray-400' style={{ backgroundColor: selectedMenu == 2 ? '#f9c545' : 'white',borderBottomWidth: selectedMenu == 2 ? 4 : 3 }} onPress={() => { setSelectedMenu(2); }}>
          <Text className="font-normal text-sm text-black">DPP Quiz</Text>
        </Pressable>
        <Pressable hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.4)",
            borderless: false,
            radius: 1000,
            foreground: true
          }} className='w-24 items-center h-10 justify-center overflow-hidden border-r border-t border-r-gray-400 border-t-gray-400' style={{ backgroundColor: selectedMenu == 3 ? '#f9c545' : 'white',borderBottomWidth: selectedMenu == 3 ? 4 : 3 }} onPress={() => { setSelectedMenu(3); setContentType('DppNotes'); setCurrentPage(1) }}>
          <Text className="font-normal text-sm text-black">DPP Notes</Text>
        </Pressable>
        <Pressable android_ripple={{
          color: "rgba(255,255,255,0.4)",
          borderless: false,
          radius: 1000,
          foreground: true
        }} className='w-24 items-center h-10 justify-center rounded-r-lg overflow-hidden border-t border-r-[3px] border-t-gray-400' style={{ backgroundColor: selectedMenu == 4 ? '#f9c545' : 'white', borderBottomWidth: selectedMenu == 4 ? 4 : 3 }} onPress={() => { setSelectedMenu(4); setContentType('DppVideos'); setCurrentPage(1) }}>
          <Text className="font-normal text-sm text-black">DPP Videos</Text>
        </Pressable>

      </View>

      <Pressable
        android_ripple={{
          color: "rgba(255,255,255,0.4)",
          borderless: false,
          radius: 1000,
          foreground: true
        }}
        onPress={handleLogout}
        className='flex-row justify-center overflow-hidden rounded-full items-center '>
        <Image source={Images.Dropdown} className='w-10 h-10 ' width={40} height={40} />
      </Pressable>
    </View>
  );
}