/// <reference types="nativewind/types" />

import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useGlobalContext } from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VideoType } from '../types/types';
import moment from 'moment';
import { fromCSS } from '@bacons/css-to-expo-linear-gradient';
import { LinearGradient } from 'expo-linear-gradient';

export default function Recent() {

    const { mainNavigation, recentVideoLoad } = useGlobalContext();
    // const [recentVideos, setRecentVideos] = useState<VideoType[] | null>(null);
    const [recentVideos, setRecentVideos] = useState<{ [key: string]: VideoType[] } | null>(null);


    // useEffect(() => {
    //     console.log("loading recent videos from local");

    //     AsyncStorage.getItem('recentVideos').then((value) => {
    //         if (value) {
    //             setRecentVideos(JSON.parse(value));
    //         }
    //     });
    // }, [recentVideoLoad])
    useEffect(() => {
        AsyncStorage.getItem('recentVideos').then((value) => {
          if (value) {
            setRecentVideos(JSON.parse(value));
          }
        });
      }, [recentVideoLoad]);


    return (
        <View className=''>
            <Text className='text-white text-2xl font-medium ml-5'>Continue Learning</Text>
            <View className=' p-5  my-2 flex-none overflow-hidden'>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className='gap-x-4'>
                {recentVideos && Object.entries(recentVideos).map(([subject, videos], index) => (
              <Pressable
                key={index}
                hasTVPreferredFocus={true}
                android_ripple={{ color: 'rgba(255,255,255,0.5)', borderless: false, radius: 1000, foreground: true }}
                onPress={async () => {
                  mainNavigation.navigate('RecentVideos', { lectureDetails: videos[0]?.videoDetails, subject: subject});
                }}
                className=' rounded-lg h-fit w-72 overflow-hidden'
              >
                
                {/* <View className='relative'>
                    <View className="w-full h-44 overflow-hidden rounded-lg relative">
                        {videos[0]?.videoDetails?.image && <Image
                            className=' w-full h-full object-cover rounded-t-lg '
                            source={{ uri: `${videos[0]?.videoDetails?.image}` }}
                        />}
                    </View>
                    <Image source={require('../assets/cardgrad2.png')} className='absolute w-full h-full bottom-0 left-0' width={10} height={10} />
                    <View className='p-2 absolute bottom-2 left-2 text-white'>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View className='flex flex-row items-center justify-start gap-1'>
                                <Text className='text-white text-sm font-bold pt-1'>{subject}-({videos?.length})</Text>
                            </View>
                        </View>
                        <Text className='text-lg text-white font-normal mb-0'>{videos[0]?.videoDetails?.name?.length >= 25 ? `${videos[0]?.videoDetails?.name?.substring(0, 25)}...` : videos[0]?.videoDetails?.name}</Text>
                    </View>
                    
                </View> */}
                <LinearGradient
                        {...fromCSS(
                            `linear-gradient(152.97deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)`
                        )}
                        className='rounded-xl overflow-hidden border-[1px] border-white/30'
                    >
                <View className='relative'>
                    <View className="w-full aspect-video rounded-t-xl overflow-hidden relative">
                        {videos[0]?.videoDetails?.image && <Image
                            className=' w-full h-full object-cover rounded-t-lg '
                            source={{ uri: `${videos[0]?.videoDetails?.image}` }}
                        />}
                    </View>
                    <View className='p-2 relative px-5'>
                        <View className='flex flex-col items-center justify-start gap-1'>

                                <Text className='text-white text-xs font-bold'>{subject}-({videos?.length})</Text>

                        <Text className='text-base text-white font-normal mb-0'>{videos[0]?.videoDetails?.name?.length >= 25 ? `${videos[0]?.videoDetails?.name?.substring(0, 25)}...` : videos[0]?.videoDetails?.name}</Text>
                        </View>                            
                    </View>
                </View>
                </LinearGradient>
              </Pressable>
            ))}
                    {/* {recentVideos?.map((order, index) => (
                        <Pressable
                            key={index}
                            hasTVPreferredFocus={true}
                            android_ripple={{
                                color: "rgba(255,255,255,0.5)",
                                borderless: false,
                                radius: 1000,
                                foreground: true
                            }}
                            onPress={async () => {
                                mainNavigation.navigate("Videos", {
                                    lectureDetails: order?.videoDetails,
                                });
                            }}
                            className=' rounded-lg h-fit w-72 overflow-hidden'>
                            <View className='relative'>
                                <View className="w-full h-44 overflow-hidden rounded-lg relative">
                                    {order?.videoDetails?.image && <Image
                                       className=' w-full h-full object-cover rounded-t-lg '
                                        source={{ uri: `${order?.videoDetails?.image}` }}
                                    />}
                                </View>
                                <Image source={require('../assets/cardgrad.png')} className='absolute w-full h-full bottom-0 left-0' width={10} height={10} />
                                <View className='p-2 absolute bottom-2 left-2 text-white'>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View className='flex flex-row items-center justify-start gap-1'>
                                            <Text className='text-white text-xs font-light pt-1'>Class-12 | Physics</Text>
                                        </View>
                                    </View>
                                    <Text className='text-lg text-white font-medium mb-0'>{order?.videoDetails?.name?.length >= 25 ? `${order?.videoDetails?.name?.substring(0, 25)}...` : order?.videoDetails?.name}</Text>
                                </View>
                                
                            </View>

                        </Pressable>
                    ))} */}
                </ScrollView>
            </View>
        </View>
    );
}
