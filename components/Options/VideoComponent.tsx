import React, { Dispatch, SetStateAction } from 'react';
import { View, Text, Image, FlatList, Pressable } from 'react-native';
import { VideoType } from '../../types/types';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type VideoPropType = {
  videoList: VideoType[] | null,
  setVideoList: Dispatch<SetStateAction<VideoType[] | null>>,
  loadMore: boolean,
  getPaidBatches: any
}

export const VideoComponent = ({ videoList, loadMore, getPaidBatches }: VideoPropType) => {

  const navigation = useNavigation();

  const saveToRecentVideos = (item: VideoType) => {
    AsyncStorage.getItem('recentVideos').then((value) => {
      if (value) {
        let recentVideos = JSON.parse(value);
        let newRecentVideos = [...recentVideos, item];
        AsyncStorage.setItem('recentVideos', JSON.stringify(newRecentVideos));
      } else {
        AsyncStorage.setItem('recentVideos', JSON.stringify([item]));
      }
    });
  }

  const renderGridItem = ({ item }: any) => (
    <Pressable
      style={{ flex: 1 / 4 }}
      className=' m-2 overflow-hidden rounded-xl bg-white/5'
      android_ripple={{
        color: "rgba(255,255,255,0.4)",
        borderless: false,
        radius: 1000,
        foreground: true
      }}
      hasTVPreferredFocus
      onPress={() => {
        console.log("Go to Video Page", item?.videoDetails);
        //@ts-expect-error
        navigation.navigate("Videos", {
          lectureDetails: item?.videoDetails,
        });
        saveToRecentVideos(item);
      }}>
      {/* <View >
        <View>
          {item?.videoDetails?.image && <Image
            style={{ width: '100%', height: 135, objectFit: 'cover', borderRadius: 10, }}
            source={{ uri: `${item?.videoDetails?.image}` }}
          />}
        </View>
        <View className='p-2'>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text className='text-white text-[10px]'>{moment(item?.date).format("MMM Do YY")}</Text>
            <Text className='text-white text-[10px]'>{item?.videoDetails?.duration}</Text>
          </View>
          <Text className='text-xs text-white font-medium my-2'>{item?.videoDetails?.name?.length >= 60 ? `${item?.videoDetails?.name?.substring(0, 60)}...` : item?.videoDetails?.name}</Text>
        </View>
      </View> */}
      <View className='relative'>
          <View className="w-full h-36 overflow-hidden rounded-lg relative">
              {item?.videoDetails?.image && <Image
                  className=' w-full h-full object-cover rounded-t-lg '
                  source={{ uri: `${item?.videoDetails?.image}` }}
              />}
          </View>
          <Image source={require('../../assets/cardgrad2.png')} className='absolute w-full h-full bottom-0 left-0' width={10} height={10} />
          <View className='p-2 absolute bottom-2 left-2 text-white'>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View className='flex flex-row items-center justify-start gap-1'>
                      {/* <Image source={require('../assets/clock2.png')} className='w-4 h-4' width={10} height={10} /> */}
                      {/* <Text className='text-white text-xs font-light pt-1'>{moment(order?.date).format("MMM Do YY")}</Text> */}
                      <Text className='text-white text-xs font-light pt-1'>{moment(item?.date).format("MMM Do YY")} | {item?.videoDetails?.duration}</Text>
                  </View>
              </View>
              <Text className='text-lg text-white font-medium mb-0'>{item?.videoDetails?.name?.length >= 25 ? `${item?.videoDetails?.name?.substring(0, 25)}...` : item?.videoDetails?.name}</Text>
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
