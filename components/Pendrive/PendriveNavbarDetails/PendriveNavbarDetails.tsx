/// <reference types="nativewind/types" />
import { Image, Text, Pressable, View } from 'react-native';
import { useGlobalContext } from '../../../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { Images } from '../../../images/images';
import * as Sentry from "@sentry/react-native";

export default function PendriveNavbarDetails() {
  // const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const { offlineSections, setDirectoryLevel, offlineSelectedSection, headers, setHeaders, setOfflineCurrentDirectory, setOfflineSelectedSection, setOfflineSelectedBatch, setOfflineLectures, setOfflineNotes, setOfflineDppPdf, setOfflineDppVideos, selectedClassName, setLogs } = useGlobalContext();
  const navigation = useNavigation();

const handleLogout = async () => {
  let logoutApiSuccess = false;
  try {
    const res = await axios.post("https://api.penpencil.co/v1/oauth/logout", {}, { headers: headers });
    logoutApiSuccess = res?.data?.success;
  } catch (err: any) {
    Sentry.captureException(err);
    setLogs((logs) => [ ...logs, "Logout API failed continuing with local cleanup: " + JSON.stringify(err?.response?.data || err?.message),]);
  }
  try {
    await AsyncStorage.clear();
    setHeaders(null); 
  } catch (clearError) {
    console.error("Failed to clear local storage:", clearError);
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

  // const getChapters = async (path: string) => {
  //   let listing = await FileSystem.ls(path);
  //   listing = listing.filter((chapter) => !chapter.startsWith('.'));
  //   let chapters: ItemType[] = [];
  //   listing.map((chapter, index) => {
  //     chapters.push({
  //       name: chapter,
  //       id: index,
  //       path: path + chapter,
  //     });
  //   })
  //   setOfflineChapters(chapters);
  //   setOfflineSelectedChapter(0);
  //   getLectures(path + chapters[0].name + '/Lectures');
  //   getNotes(path + chapters[0].name + '/Notes');
  //   getDppPdf(path + chapters[0].name + '/DPP');
  //   getDppVideos(path + chapters[0].name + '/DPP Videos');
  // }

  // const getLectures = async (path: string) => {
  //   let directoryItems: any[] = await FileSystem.ls(path);
  //   directoryItems = directoryItems.filter((lecture) => !lecture.startsWith('.'));
  //   const lecturesData: ItemType2[] = [];
  //   directoryItems?.map((lecture, index) => {
  //     if (!lecture?.endsWith('.png')) {
  //       const checkThumbnail = isThumbnailAvailable(directoryItems, String(lecture?.slice(0, -4) + '.png'));
  //       lecturesData?.push({
  //         name: lecture,
  //         path: path + "/" + lecture,
  //         id: index,
  //         thumbnail: checkThumbnail ? path + "/" + lecture?.slice(0, -4) + '.png' : Images.tv,
  //         defaultThumbnail: checkThumbnail
  //       })
  //     }
  //   })
  //   setOfflineLectures(lecturesData);
  // }

  // const getNotes = async (path: string) => {
  //   let directoryItems: any[] = await FileSystem.ls(path);
  //   directoryItems = directoryItems.filter((note) => !note.startsWith('.'));
  //   const notesData: ItemType2[] = [];
  //   directoryItems?.map((item, index) => {
  //     if (!item?.name?.endsWith('.png')) {
  //       const checkThumbnail = isThumbnailAvailable(directoryItems, item?.name?.slice(0, -4) + '.png');
  //       notesData?.push({
  //         name: item,
  //         path: path + "/" + item,
  //         id: index,
  //         thumbnail: checkThumbnail ? path + item + '.png' : Images.tv,
  //         defaultThumbnail: checkThumbnail
  //       })
  //     }
  //   })
  //   setOfflineNotes(notesData);
  // }

  // const getDppPdf = async (path: string) => {
  //   let directoryItems: any[] = await FileSystem.ls(path);
  //   directoryItems = directoryItems.filter((dpp) => !dpp.startsWith('.'));
  //   const dppPdfData: ItemType2[] = [];
  //   directoryItems?.map((item, index) => {
  //     if (!item?.name?.endsWith('.png')) {
  //       const checkThumbnail = isThumbnailAvailable(directoryItems, item?.name?.slice(0, -4) + '.png');
  //       dppPdfData?.push({
  //         name: item,
  //         path: path + "/" + item,
  //         id: index,
  //         thumbnail: checkThumbnail ? path + item + '.png' : Images.tv,
  //         defaultThumbnail: checkThumbnail
  //       })
  //     }
  //   })
  //   setOfflineDppPdf(dppPdfData);
  // }

  // const getDppVideos = async (path: string) => {
  //   let directoryItems: any[] = await FileSystem.ls(path);
  //   directoryItems = directoryItems.filter((video) => !video.startsWith('.'));
  //   const dppVideosData: ItemType2[] = [];
  //   directoryItems?.map((item, index) => {
  //     if (!item?.name?.endsWith('.png')) {
  //       const checkThumbnail = isThumbnailAvailable(directoryItems, item?.name?.slice(0, -4) + '.png');
  //       dppVideosData?.push({
  //         name: item,
  //         path: path + "/" + item,
  //         id: index,
  //         thumbnail: checkThumbnail ? path + item + '.png' : Images.tv,
  //         defaultThumbnail: checkThumbnail
  //       })
  //     }
  //   })
  //   setOfflineDppVideos(dppVideosData);
  // }

  // const isThumbnailAvailable = (directoryItems: any[], toFind: string) => {
  //   let flag = directoryItems.find((item) => item === toFind) ? true : false;
  //   return flag;
  // }

  // const renderSubjectItem = ({ item }: any) => (
  //   <Pressable
  //     style={styles.dropdownItem}
  //     onPress={() => {
  //       setOfflineSelectedSubject(item?.id);
  //       setDirectoryLevel(2);
  //       getChapters(item?.path + '/');
  //       // setOfflineCurrentDirectory(item?.path);
  //       setIsDropdownVisible(false);
  //     }}
  //   >
  //     <Text className='text-white text-xs'>{item?.name}</Text>
  //   </Pressable>
  // );

  function getIndexByDirectoryName(directoryItems: any[], name: string) {
    for (let i = 0; i < directoryItems.length; i++) {
      if (directoryItems[i].name === name) {
        return i;
      }
    }
    return -1;
  }
  

  return (
    <View className=" flex-row justify-between items-center p-4 bg-[#E1BD6433] border-b-[1px] border-gray-400">
      <View className='flex flex-row items-center justify-center gap-2'>
       <Pressable
          hasTVPreferredFocus={true}
          android_ripple={{
          color: "rgba(255,255,255,0.1)",
          borderless: false,
          radius: 1000,
          foreground: true
        }}
        onPress={() => {
          // @ts-expect-error
          navigation.navigate('PendriveBatches');
          setOfflineSelectedBatch(-1);
        }}
        className='flex-row justify-center items-center rounded-xl overflow-hidden px-2'>
        <Image source={Images.arrowLeft} className='w-2 h-3' width={10} height={10} tintColor={"#6B7280"} />
      </Pressable>
      <Text className=' text-gray-500'>Home</Text>
        {selectedClassName && <Text className='font-medium text-black/70'>/ {selectedClassName?.length > 10 ? `${selectedClassName.substring(0,12)}...` : selectedClassName}</Text> }
      </View>

        {/* <Pressable
          onPress={() => {
            setIsDropdownVisible(prev => !prev);
          }}
          className='rounded-xl bg-[#444444] px-5 py-2 overflow-hidden'
          hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.5)",
            borderless: false,
            radius: 1000,
            foreground: true
          }}>
          
          <View className='flex-row items-center justify-center gap-2'>
            {offlineSubjects[offlineSelectedSubject]?.name && <Text className='text-white text-sm'>{(offlineSubjects[offlineSelectedSubject]?.name?.length > 20) ? `${offlineSubjects[offlineSelectedSubject]?.name?.substring(0, 20)}...` : offlineSubjects[offlineSelectedSubject]?.name}</Text>}
            <Entypo name="chevron-down" size={20} color="white" />
          </View>
        </Pressable> */}
        
         {/*modal wala part */}
      

      <View className=' rounded-xl flex-row py-2 pr-20' >
        <Pressable
          hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.4)",
            borderless: false,
            radius: 1000,
            foreground: true
          }}
          className='w-24 items-center h-10 justify-center rounded-l-lg overflow-hidden border-l border-r border-t border-r-gray-400 border-t-gray-400 border-l-gray-400'
          style={{ backgroundColor: offlineSelectedSection == 3 ? '#f9c545' : 'white', borderBottomWidth: offlineSelectedSection == 3 ? 4 : 3 }}
          onPress={() => {
            if (offlineSections) {
              setDirectoryLevel(4);
              setOfflineCurrentDirectory(offlineSections[getIndexByDirectoryName(offlineSections, 'Lectures')]?.path);
              setOfflineSelectedSection(3);
            }
          }}
        >
          <Text className="font-normal text-sm text-black">Lectures</Text>
        </Pressable>
        <Pressable
          hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.4)",
            borderless: false,
            radius: 1000,
            foreground: true
          }}
          className='w-20 items-center h-10 justify-center overflow-hidden border-r border-t border-r-gray-400 border-t-gray-400 '
          style={{ backgroundColor: offlineSelectedSection == 4 ? '#f9c545' : 'white', borderBottomWidth: offlineSelectedSection == 4 ? 4 : 3 }}
          onPress={() => {
            if (offlineSections) {
              setDirectoryLevel(4);
              setOfflineCurrentDirectory(offlineSections[getIndexByDirectoryName(offlineSections, 'Notes')]?.path);
              setOfflineSelectedSection(4);
            }
          }}>
          <Text className="font-normal text-sm text-black">Notes</Text>
        </Pressable>

        <Pressable
          hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.4)",
            borderless: false,
            radius: 1000,
            foreground: true
          }}
          className='w-24 items-center h-10 justify-center overflow-hidden border-r border-t border-r-gray-400 border-t-gray-400'
          style={{ backgroundColor: offlineSelectedSection == 1 ? '#f9c545' : 'white', borderBottomWidth: offlineSelectedSection == 1 ? 4 : 3 }}
          onPress={() => {
            if (offlineSections) {
              setDirectoryLevel(4);
              setOfflineCurrentDirectory(offlineSections[getIndexByDirectoryName(offlineSections, 'DPP PDF')]?.path);
              setOfflineSelectedSection(1);
            }
          }}
        >
          <Text className="font-normal text-sm text-black">DPP PDF</Text>
        </Pressable>
        <Pressable
          android_ripple={
            {
              color: "rgba(255,255,255,0.4)",
              borderless: false,
              radius: 1000,
              foreground: true
            }
          }
          className='w-24 items-center h-10 justify-center rounded-r-lg overflow-hidden border-t border-r-[3px] border-t-gray-400'
          style={{ backgroundColor: offlineSelectedSection == 2 ? '#f9c545' : 'white', borderBottomWidth: offlineSelectedSection == 2 ? 4 : 3 }}
          onPress={() => {
            if (offlineSections) {
              setDirectoryLevel(4);
              setOfflineCurrentDirectory(offlineSections[getIndexByDirectoryName(offlineSections, 'DPP Videos')]?.path);
              setOfflineSelectedSection(2);
            }
          }}
        >
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