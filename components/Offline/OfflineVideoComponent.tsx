import React, { Dispatch, SetStateAction } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { ItemType, VideoType } from '../../types/types';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../../context/MainContext';
// @ts-expect-error
import defaultIcon from '../../assets/TV.png';

type VideoPropType = {
  videoList: ItemType[] | null,
  // setVideoList: Dispatch<SetStateAction<VideoType[] | null>>,
  // loadMore: boolean,
  // getPaidBatches: any
}

export const OfflineVideoComponent = ({ videoList }: VideoPropType) => {

  const { mainNavigation, batchDetails } = useGlobalContext();
  const navigation = useNavigation();

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
        //@ts-expect-error
        navigation.navigate('MP4Player', { videoUrl: item?.path });
      }}>
      <View >
        <View>
          {item.defaultThumbnail ? <Image
            style={{ width: '100%', height: 142, objectFit: 'contain', borderRadius: 5 }}
            source={{ uri: `${item?.thumbnail}` }}
          /> : <Image
            style={{ width: '100%', height: 142, objectFit: 'contain', borderRadius: 5 }}
            source={defaultIcon}
          />}
        </View>
        <View className='p-2'>
          {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text className='text-white text-[10px]'>{moment(item.date).format("MMM Do YY")}</Text>
            <Text className='text-white text-[10px]'>{item?.videoDetails?.duration}</Text>
          </View> */}
          <Text className='text-xs text-white font-medium my-2'>{item?.name?.length >= 60 ? `${item?.name?.substring(0, 60)}...` : item?.name}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View>
      {/* <Text style={styles.subjectText}>Physics</Text> */}
      <FlatList
        data={videoList?.sort((a, b) => {
          const nameA = a.name.toUpperCase(); // Ignore case
          const nameB = b.name.toUpperCase();

          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0; // Names are equal
        })}
        renderItem={renderGridItem}
        keyExtractor={(item: any) => item.id}
        numColumns={4}
      // contentContainerStyle={styles.container}
      />
    </View>
  );
};
