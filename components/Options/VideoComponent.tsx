import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { View, Text, Image, FlatList, Pressable } from 'react-native';
import { VideoType } from '../../types/types';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from '../../context/MainContext';

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
      className=' m-2 overflow-hidden rounded-xl bg-white/5'
      android_ripple={{
        color: "rgba(75, 61, 196, 0.01)",
        borderless: false,
        radius: 1000,
        foreground: true
      }}
      hasTVPreferredFocus
      onPress={() => {
        console.log("Go to Video Page", item);
        console.log(item?.videoDetails?.topic);
        //@ts-expect-error
        navigation.navigate("Videos", {
          lectureDetails: item?.videoDetails,
          scheduleDetails: item,
        });
        saveToRecentVideos(item);
      }}>
      <View className='relative'>
          <View className="w-full aspect-video overflow-hidden rounded-lg relative">
              {item?.videoDetails?.image && <Image
                  className=' w-full h-full rounded-t-lg '
                  source={{ uri: `${item?.videoDetails?.image}` }}
              />}
          </View>
          <Image source={require('../../assets/grad3.png')} className='absolute w-full h-full bottom-0 left-0' width={10} height={10} />
          <View className='p-2 absolute bottom-2 left-2 text-white'>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  
              </View>
              {
                item.topic
                ? <Text className='text-lg text-white font-medium mb-0'>{item?.topic?.length >= 20 ? `${item?.topic?.substring(0, 20)}...` : item?.topic}</Text>
                : <Text className='text-lg text-white font-medium mb-0'>{item?.videoDetails?.name?.length >= 20 ? `${item?.videoDetails?.name?.substring(0, 20)}...` : item?.videoDetails?.name}</Text>
              }
          </View>
          
      </View>
    </Pressable>
  );

  return (
    <View className='pt-5'>
      {/* <Text style={styles.subjectText}>Physics</Text> */}
      {videoList?.length === 0 && <Text className='text-white text-2xl self-center items-center'>No videos available!!</Text>}
      <FlatList
        data={videoList?.sort((a, b) => {
          const nameA = a?.videoDetails?.name?.toUpperCase(); // Ignore case
          const nameB = b?.videoDetails?.name?.toUpperCase();

          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0; // Names are equal
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
