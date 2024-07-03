import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { View, Text, Image, FlatList, Pressable } from 'react-native';
import { VideoType } from '../../types/types';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from '../../context/MainContext';
import { LinearGradient } from 'expo-linear-gradient';
import { fromCSS } from '@bacons/css-to-expo-linear-gradient';

type VideoPropType = {
  videoList: VideoType[] | null,
  setVideoList: Dispatch<SetStateAction<VideoType[] | null>>,
  loadMore: boolean,
  getPaidBatches: any
}

export const VideoComponent = ({ videoList, loadMore, getPaidBatches }: VideoPropType) => {

  const navigation = useNavigation();
  const {selectedSubject, selectedChapter, selectedBatch} = useGlobalContext();

  const saveToRecentVideos = async (item: VideoType) => {
    try {
      const recentVideosStr = await AsyncStorage.getItem('recentVideos');
      const recentVideos: { [key: string]: VideoType[] } = recentVideosStr
        ? JSON.parse(recentVideosStr)
        : {};
  
      const subject = selectedSubject?.subject || 'Unknown';
      const newVideo = {
        ...item,
        subject: subject,
        chapter: selectedChapter?.name,
        batch: selectedBatch?.batch?.name,
      };
  
      if (recentVideos[subject]) {
        recentVideos[subject] = [newVideo, ...recentVideos[subject]].slice(0, 5);
      } else {
        recentVideos[subject] = [newVideo];
      }
  
      await AsyncStorage.setItem('recentVideos', JSON.stringify(recentVideos));
    } catch (error) {
      console.error('Error saving recent videos:', error);
    }
  };

  const renderGridItem = ({ item }: any) => (
    <Pressable
      style={{ flex: 1 / 4 }}
      className=' m-2 overflow-hidden rounded-xl bg-white/5 h-52'
      android_ripple={{
        color: "rgba(255,255,255,0.1)",
        borderless: false,
        radius: 1000,
        foreground: true
      }}
      hasTVPreferredFocus
      onPress={() => {
        console.log("Go to Video Page", item);
        console.log(item)
        //@ts-expect-error
        navigation.navigate("Videos", {
          lectureDetails: item?.videoDetails,
          scheduleDetails: item,
        });
        saveToRecentVideos(item);
      }}>
        <LinearGradient
            {...fromCSS(
                `linear-gradient(152.97deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)`
              )}
              className='rounded-xl overflow-hidden h-52 border-[1px] border-white/30'
        >
      <View className='relative'>
          <View className="w-full aspect-video rounded-xl overflow-hidden relative">
              {item?.videoDetails?.image && <Image
                  className=' w-full h-full rounded-t-lg '
                  source={{ uri: `${item?.videoDetails?.image}` }}
              />}
          </View>
          <View className='p-2 relative px-5 pt-3'>
              <View className='flex flex-row items-center justify-start gap-3'>
              <Text className='text-base text-white font-normal mb-0'>{item?.videoDetails?.name?.length >= 40 ? `${item?.videoDetails?.name?.substring(0, 40)}...` : item?.videoDetails?.name}</Text>
              </View>                            
          </View>
      </View>
      </LinearGradient>
    </Pressable>
  );

  return (
    <View className='pt-5'>
      {/* <Text style={styles.subjectText}>Physics</Text> */}
      {videoList?.length === 0 && <Text className='text-white text-2xl self-center items-center'>No videos available!!</Text>}
      <FlatList
        data={videoList?.sort((a, b) => {
          const dateA = new Date(a?.videoDetails?.createdAt);
          const dateB = new Date(b?.videoDetails?.createdAt);
        
          // @ts-ignore
          return dateA - dateB;
        })}
        renderItem={renderGridItem}
        keyExtractor={(item: VideoType) => item._id}
        numColumns={4}
        // contentContainerStyle={styles.container}
        onEndReached={() => { loadMore && getPaidBatches() }}
      />
    </View>
  );
};
