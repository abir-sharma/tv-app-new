/// <reference types="nativewind/types" />
import { FlatList, Pressable, Text, View, Animated } from 'react-native';
import { useGlobalContext } from '../../context/MainContext';
import { LinearGradient } from 'expo-linear-gradient';
import { fromCSS } from '@bacons/css-to-expo-linear-gradient';
import { FileSystem } from 'react-native-file-access';
import { Images } from '../../images/images';
import { useState, useRef } from 'react';
import Entypo from '@expo/vector-icons/Entypo';

export default function PendriveChapters() {

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownHeight = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current; 
  const { offlineSubjects, setOfflineSelectedSubject, offlineSelectedSubject,setOfflineChapters, offlineSelectedChapter, setDirectoryLevel, offlineChapters, setOfflineCurrentDirectory, setOfflineSelectedChapter, setOfflineLectures, setOfflineDppPdf, setOfflineDppVideos, setOfflineNotes } = useGlobalContext();

  
const handleDropdownPress = () => {
    const willOpen = !isDropdownVisible;
    setIsDropdownVisible(willOpen);
    
   
    Animated.timing(dropdownHeight, {
      toValue: willOpen ? 200 : 0, 
      duration: 800,
      useNativeDriver: false,
    }).start();
    
    Animated.timing(rotateAnim, {
      toValue: willOpen ? 1 : 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const chevronRotation = rotateAnim.interpolate({    
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const renderSubjectItem = ({ item }: any) => (
    <Pressable
      android_ripple={{
        color: "rgba(255, 255, 255, 0.1)",
        borderless: false,
        radius: 1000,
      }}
      className='mx-2 my-1 overflow-hidden '
        onPress={() => {
        setOfflineSelectedSubject(item?.id);
        setDirectoryLevel(2);
        getChapters(item?.path + '/');
        // setOfflineCurrentDirectory(item?.path);
        setIsDropdownVisible(false);
        handleDropdownPress()
      }}
    >
      <Text className='text-white text-xs text-md bg-[#111111] py-3 rounded-md px-4'>{item?.name}</Text>
    </Pressable>
    
  );


  const getChapters = async (path: string) => {
    let listing = await FileSystem.ls(path);
    listing = listing.filter((chapter) => !chapter.startsWith('.'));
    let chapters: ItemType[] = [];
    listing.map((chapter, index) => {
      chapters.push({
        name: chapter,
        id: index,
        path: path + chapter,
      });
    })
    setOfflineChapters(chapters);
    setOfflineSelectedChapter(0);
    getLectures(path + chapters[0].name + '/Lectures');
    getNotes(path + chapters[0].name + '/Notes');
    getDppPdf(path + chapters[0].name + '/DPP');
    getDppVideos(path + chapters[0].name + '/DPP Videos');
  }


  const getLectures = async (path: string) => {
    let directoryItems: any[] = await FileSystem.ls(path);
    directoryItems = directoryItems.filter((lecture) => !lecture.startsWith('.'));
    const lecturesData: ItemType2[] = [];
    directoryItems?.map((lecture, index) => {
      if (!lecture?.endsWith('.png')) {
        const checkThumbnail = isThumbnailAvailable(directoryItems, String(lecture?.slice(0, -4) + '.png'));
        lecturesData?.push({
          name: lecture,
          path: path + "/" + lecture,
          id: index,
          thumbnail: checkThumbnail ? path + "/" + lecture?.slice(0, -4) + '.png' : Images.tv,
          defaultThumbnail: checkThumbnail
        })
      }
    })
    setOfflineLectures(lecturesData);
  }

  const getNotes = async (path: string) => {
    let directoryItems: any[] = await FileSystem.ls(path);
    directoryItems = directoryItems.filter((note) => !note.startsWith('.'));
    const notesData: ItemType2[] = [];
    directoryItems?.map((item, index) => {
      if (!item?.name?.endsWith('.png')) {
        const checkThumbnail = isThumbnailAvailable(directoryItems, item?.name?.slice(0, -4) + '.png');
        notesData?.push({
          name: item,
          path: path + "/" +item,
          id: index,
          thumbnail: checkThumbnail ? path + item + '.png' : Images.tv,
          defaultThumbnail: checkThumbnail
        })
      }
    })
    setOfflineNotes(notesData);
  }

  const getDppPdf = async (path: string) => {
    let directoryItems: any[] = await FileSystem.ls(path);
    directoryItems = directoryItems.filter((dpp) => !dpp.startsWith('.'));
    const dppPdfData: ItemType2[] = [];
    directoryItems?.map((item, index) => {
      if (!item?.name?.endsWith('.png')) {
        const checkThumbnail = isThumbnailAvailable(directoryItems, item?.name?.slice(0, -4) + '.png');
        dppPdfData?.push({
          name: item,
          path: path + "/" + item,
          id: index,
          thumbnail: checkThumbnail ? path + item + '.png' : Images.tv,
          defaultThumbnail: checkThumbnail
        })
      }
    })
    setOfflineDppPdf(dppPdfData);
  }

  const getDppVideos = async (path: string) => {
    let directoryItems: any[] = await FileSystem.ls(path);
    directoryItems = directoryItems.filter((dpp) => !dpp.startsWith('.'));
    const dppVideosData: ItemType2[] = [];
    directoryItems?.map((item, index) => {
      if (!item?.name?.endsWith('.png')) {
        const checkThumbnail = isThumbnailAvailable(directoryItems, item?.name?.slice(0, -4) + '.png');
        dppVideosData?.push({
          name: item,
          path: path + "/" + item,
          id: index,
          thumbnail: checkThumbnail ? path + item + '.png' : Images.tv,
          defaultThumbnail: checkThumbnail
        })
      }
    })
    setOfflineDppVideos(dppVideosData);
  }

  const isThumbnailAvailable = (directoryItems: any[], toFind: string) => {
    let flag = directoryItems.find((item) => item === toFind) ? true : false;
    return flag;
  }

  const renderChapterItem = ({ item }: any) => (
    <Pressable
      className={`overflow-hidden rounded-lg my-1 bg-[#111111]`}
      hasTVPreferredFocus={true}
      android_ripple={{
        color: "rgba(249,197,69,0)",
        borderless: false,
        radius: 1000,
        foreground: true
      }}
      onPress={() => {
        setOfflineSelectedChapter(item?.id);
        setDirectoryLevel(3);
        getLectures(item?.path + "/Lectures");
        getNotes(item?.path + "/Notes");
        getDppPdf(item?.path + "/DPP");
        getDppVideos(item?.path + "/DPP Videos");
        // setOfflineCurrentDirectory(item?.path);
      }}
    >
      {offlineSelectedChapter === item?.id ? 
      <LinearGradient {...fromCSS(`linear-gradient(90deg, #F9C545 0%, #F9C545 100%)`)}
        className='py-4 px-4 rounded-xl overflow-hidden'>
        <Text className='text-black text-sm font-semibold'>{item?.name}</Text>
      </LinearGradient>
      :
      <LinearGradient {...fromCSS(`linear-gradient(102.97deg, rgba(17, 17, 17, 0.2) 0%, rgba(17, 17, 17, 0) 100%)`)}
        className='py-4 px-4 rounded-xl overflow-hidden'>
        <Text className='text-white text-sm'>{item?.name}</Text>
      </LinearGradient>  
    }
    </Pressable>
  );

  return (
    <View className="flex-1 p-4 rounded-r-lg bg-[#111111]">
      <View className="mt-4 mb-4">
       <Pressable
          onPress={() => { handleDropdownPress() }}
          className='items-start justify-center rounded-xl bg-[#1d2228] border border-gray-400 w-full h-14 overflow-hidden'
          hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.1)",
            borderless: false,
            radius:1000,
            foreground: true
          }}>
          <View className='flex-row items-center justify-between px-4 w-full'>
           {offlineSubjects[offlineSelectedSubject]?.name && <Text className='text-white font-semibold flex-1 text-sm'>{(offlineSubjects[offlineSelectedSubject]?.name?.length > 20) ? `${offlineSubjects[offlineSelectedSubject]?.name?.substring(0, 20)}...` : offlineSubjects[offlineSelectedSubject]?.name}</Text>}
            <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
              <Entypo name="chevron-down" size={20} color="white" />
            </Animated.View>
          </View>
        </Pressable>
        <Animated.View
          style={{
            height: dropdownHeight,
            overflow: 'hidden',
          }}
          className="bg-[#111111] border-l border-r border-b border-[#111111] rounded-b-xl"
        >
          {isDropdownVisible && ( offlineSubjects && 
            ( <FlatList
              data={offlineSubjects}
              renderItem={renderSubjectItem}
              keyExtractor={(item, index) => index.toString()}
              className="flex-1"
              showsVerticalScrollIndicator={false}
              bounces={false}
            /> )
          )}
        
        </Animated.View>
      </View>

      <View className='flex-1 mt-6'>
      <Text className='text-white font-medium text-2xl mb-4'>Chapters</Text>
       <View className='flex-1'>
        {/* <Text style={styles.subjectText}>Physics</Text> */}
        <FlatList
          data={offlineChapters}
          renderItem={renderChapterItem}
          numColumns={1}
        // contentContainerStyle={styles.container}
        // onEndReached={()=>{loadMore && getPaidBatches()}}
         showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        />
        </View>
      </View>
    </View>
  );
}
