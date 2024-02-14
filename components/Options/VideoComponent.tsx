import React, { Dispatch, SetStateAction } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { VideoType } from '../../types/types';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

type VideoPropType = {
    videoList: VideoType[] | null,
    setVideoList: Dispatch<SetStateAction<VideoType[] | null>>,
    loadMore: boolean,
    getPaidBatches: any
}

export const VideoComponent = ({videoList, setVideoList, loadMore, getPaidBatches}: VideoPropType) => {

  const {mainNavigation, batchDetails} = useGlobalContext();  
  const navigation = useNavigation();

  const saveToRecentVideos = (item: VideoType) => {
    AsyncStorage.getItem('recentVideos').then((value)=>{
      if(value){
        let recentVideos = JSON.parse(value);
        let newRecentVideos = [...recentVideos, item];
        AsyncStorage.setItem('recentVideos', JSON.stringify(newRecentVideos));
      }else{
        AsyncStorage.setItem('recentVideos', JSON.stringify([item]));
      }
    });
  }

  const renderGridItem = ({ item }: any) => (
    <Pressable
        style={{flex: 1/4}}
        className=' m-2 overflow-hidden rounded-xl bg-white/5'
        android_ripple={{
            color: "rgba(255,255,255,0.4)",
            borderless: false,
            radius: 1000,
            foreground: true
        }}
        hasTVPreferredFocus
        onPress={()=>{
        // console.log("Go to Video Page");
        //@ts-expect-error
        navigation.navigate("Videos", {
          lectureDetails: item.videoDetails,
        });
        saveToRecentVideos(item);
        }}>
        <View >
            <View>
                {item?.videoDetails?.image && <Image
                    style={{width: '100%', height: 135, objectFit: 'cover', borderRadius: 10, }}
                    source={{uri: `${item?.videoDetails?.image}`}}
                />}
            </View>
            <View className='p-2'>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text className='text-white text-[10px]'>{moment(item.date).format("MMM Do YY")}</Text>
                    <Text className='text-white text-[10px]'>{item?.videoDetails?.duration}</Text>
                </View>
                <Text className='text-xs text-white font-medium my-2'>{item?.videoDetails?.name?.length >= 60? `${item?.videoDetails?.name?.substring(0,60)}...`: item?.videoDetails?.name}</Text>
            </View>
        </View>
        </Pressable>
    );

  return (
    <View>
      {/* <Text style={styles.subjectText}>Physics</Text> */}
      <FlatList
        data={videoList}
        renderItem={renderGridItem}
        keyExtractor={(item:VideoType) => item._id}
        numColumns={4}
        // contentContainerStyle={styles.container}
        onEndReached={()=>{loadMore && getPaidBatches()}}
      />
    </View>
  );
};
