import React from 'react';
import { View, Text, Image, FlatList, Pressable } from 'react-native';
import { ItemType } from '../../types/types';
import { useNavigation } from '@react-navigation/native';
// @ts-expect-error
import defaultIcon from '../../assets/TV.png';

type VideoPropType = {
  videoList: ItemType[] | null,
}

export const OfflineVideoComponent = ({ videoList }: VideoPropType) => {

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
          <Text className='text-xs text-white font-medium my-2'>{item?.name?.length >= 60 ? `${item?.name?.substring(0, 60)}...` : item?.name}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View>
      <FlatList
        data={videoList?.sort((a, b) => {
          const nameA = a?.name?.toUpperCase(); // Ignore case
          const nameB = b?.name?.toUpperCase();

          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0; // Names are equal
        })}
        renderItem={renderGridItem}
        numColumns={4}
      />
    </View>
  );
};
