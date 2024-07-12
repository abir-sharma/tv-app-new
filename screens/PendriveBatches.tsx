import React, { useState, useEffect } from 'react';
import { fromCSS } from '@bacons/css-to-expo-linear-gradient';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { FileSystem } from 'react-native-file-access';
import Navbar from '../components/Global/Navbar';
import FastImage from 'react-native-fast-image';
import { Images } from '../images/images';

type OfflineBatches = {
  name: string,
  thumbnail: string | null
}

const PendriveBatches = () => {
  const [offlineBatches, setOfflineBatches] = useState<OfflineBatches[]>([]);

  const getBatches = async () => {
    const listing = await FileSystem.ls('/storage/emulated/0/Download/Batches/Batches');
    let batches: OfflineBatches[] = [];
    listing.map((item) => {
      if (!item?.endsWith('.png')) {
        const checkThumbnail = listing.includes(item + '.png');
        batches.push({
          name: item,
          thumbnail: checkThumbnail ? '/storage/emulated/0/Download/Batches/Batches/' + item + '.png' : null,
        });
      }
    })
    setOfflineBatches(batches);
  }

  useEffect(() => {
    getBatches();
  }, []);

  return (
    <LinearGradient
      {...fromCSS(`linear-gradient(276.29deg, #2D3A41 6.47%, #2D3A41 47.75%, #000000 100%)`)}
      className=" flex-1">
      <Navbar />
      {
        offlineBatches.map((batch, index) => {
          return (
            <View key={index} className="flex-row justify-between items-center p-4">
              <Text className="text-white">{batch.name}</Text>
            </View>
          )
        })
      }

      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className='gap-x-4'>
        {offlineBatches?.map((batch: any, index: number) => (
          console.log(batch),
          <Pressable
            key={index}
            hasTVPreferredFocus={true}
            android_ripple={{
              color: "rgba(255,255,255,0.5)",
              borderless: false,
              radius: 1000,
              foreground: true
            }}
            onPress={() => {
              
            }}
            className='bg-white/10 rounded-xl h-52 w-72 overflow-hidden'
          >
            <LinearGradient
              {...fromCSS(
                `linear-gradient(152.97deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)`
              )}
              className='rounded-xl overflow-hidden h-52 border-[1px] border-white/30'
            >
              <View className="w-full aspect-video rounded-t-xl overflow-hidden relative">
                <Image
                  key={index}
                  className="w-full h-full rounded-t-lg"
                  {
                    ...(batch?.thumbnail ? { source: { uri: batch?.thumbnail } } : { source: Images.tv })
                  }
                /> 
              </View>
              <View className='p-2 relative px-5'>
                <View className='flex flex-row items-center justify-center gap-3'>
                  <Text className='text-white text-lg font-base text-center'>{batch?.name >= 20 ? `${batch?.name?.substring(0, 20)}...` : batch?.name}</Text>
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({})

export default PendriveBatches;
