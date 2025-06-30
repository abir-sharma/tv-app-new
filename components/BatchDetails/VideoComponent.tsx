//L1 used
import React from 'react';
import { View, Text, Image, FlatList, Pressable } from 'react-native';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGlobalContext } from '../../context/MainContext';
import { LinearGradient } from 'expo-linear-gradient';
import { fromCSS } from '@bacons/css-to-expo-linear-gradient';
import sendGoogleAnalytics from '../../utils/sendGoogleAnalytics';
import sendMongoAnalytics from '../../utils/sendMongoAnalytics';
import { Ionicons } from '@expo/vector-icons';

export const VideoComponent = ({ videoList, loadMore, getPaidBatches }: VideoComponentPropType) => {

  const navigation = useNavigation();
  const { selectedSubject, selectedChapter, selectedBatch, selectedMenu } = useGlobalContext();

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
    }
  };

  const renderGridItem = ({ item }: any) => (
    <View
      className=' h-52 w-[25%] px-1 my-1'
      >
        <Pressable
    android_ripple={{
      color: "rgba(255,255,255,0.4)",
      borderless: false,
      radius: 1000,
      foreground: true
    }} className=' overflow-hidden rounded-xl'
    
    onPress={() => {
      sendGoogleAnalytics("video_opened", {
        video_name: item?.videoDetails?.name,
        video_id: item?.videoDetails?._id,
        batch_name: selectedBatch?.name,
        subject_name: selectedSubject?.subject,
        chapter_name: selectedChapter?.name,
        batchId: selectedBatch?._id,
      });
      sendMongoAnalytics("video_opened", {
        videoName: item?.videoDetails?.name,
        videoId: item?.videoDetails?._id,
        batchName: selectedBatch?.name,
        subjectName: selectedSubject?.subject,
        chapterName: selectedChapter?.name,
        batchId: selectedBatch?._id,
        isSolutionVideo: selectedMenu === 3 ? true : false
      });
      //@ts-expect-error
      navigation.navigate("Video", {
        lectureDetails: item?.videoDetails,
        scheduleDetails: item,
      });
      saveToRecentVideos(item);
    }}>
      {/* @ts-expect-error */}
        <LinearGradient
            {...fromCSS(
                `linear-gradient(152.97deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)`
              )}
              className='rounded-xl overflow-hidden h-48 border-[1px] border-black bg-[#fbfaef]'
        >
      <View className='relative'>
          <View className="w-[92%] aspect-video rounded-xl overflow-hidden relative mt-2 ml-2 mr-2">
              {item?.videoDetails?.image && <Image
                  className=' w-full h-full rounded-t-lg '
                  source={{ uri: `${item?.videoDetails?.image}` }}
              />}
          </View>
          <View className='p-2 relative px-5 pt-3'>
              <View className='flex flex-row items-center justify-start gap-2 right-2'>
               <View style={{ elevation: 6, shadowColor: '#9CA3AF'}}>
                   <Ionicons name="play" size={16} color="black"/>
                </View>
              <Text className='text-sm text-black/80 font-semibold mb-0'>{item?.videoDetails?.name?.length >= 40 ? `${item?.videoDetails?.name?.substring(0, 40)}...` : item?.videoDetails?.name}</Text>
             </View>                            
          </View>
      </View>
      </LinearGradient>
      </Pressable>
    </View>
  );


  return (
    <View className='p-5'>
      {/* <Text style={styles.subjectText}>Physics</Text> */}
      {videoList?.length === 0 && <Text className='text-black flex flex-wrap text-2xl self-center items-center'>No videos available!!</Text>}
      <FlatList
        data={videoList?.sort((a, b) => {
          const dateA = new Date(a?.videoDetails?.createdAt);
          const dateB = new Date(b?.videoDetails?.createdAt);
        
          // @ts-ignore
          return dateA - dateB;
        })}
        style={{gap: 5}}
        renderItem={renderGridItem}
        keyExtractor={(item: VideoType) => item._id}
        numColumns={4}
        // contentContainerStyle={styles.container}
        onEndReached={() => { loadMore && getPaidBatches() }}
      />
    </View>
  );
};
