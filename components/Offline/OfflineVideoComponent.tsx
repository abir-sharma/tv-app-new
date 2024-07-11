import React from 'react';
import { View, Text, Image, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { fromCSS } from '@bacons/css-to-expo-linear-gradient';
import { Images } from '../../images/images';

export const OfflineVideoComponent = ({ videoList }: OfflineVideoComponentPropType) => {

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
      <LinearGradient
            {...fromCSS(
                `linear-gradient(152.97deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)`
              )}
              className='rounded-xl overflow-hidden h-52 border-[1px] border-white/30'
        >
      <View className='relative'>
          <View className="w-full aspect-video rounded-xl overflow-hidden relative">
          {item.defaultThumbnail ? <Image
          className='w-full h-full rounded-t-lg'
            source={{ uri: `${item?.thumbnail}` }}
          /> : <Image
            className='w-full h-full rounded-t-lg'
            source={Images.defaultt}
          />}
          </View>
          <View className='p-2 relative px-5 pt-3'>
              <View className='flex flex-row items-center justify-start gap-3'>
              <Text className='text-base text-white font-normal mb-0'>{item?.name?.length >= 40 ? `${item?.name?.substring(0, 40)}...` : item?.name}</Text>
              </View>                            
          </View>
      </View>
      </LinearGradient>
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
