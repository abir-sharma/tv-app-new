/// <reference types="nativewind/types" />

import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useGlobalContext } from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VideoType } from '../types/types';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';

export default function Recent() {

    const { mainNavigation, recentVideoLoad } = useGlobalContext();
    const [recentVideos, setRecentVideos] = useState<VideoType[] | null>(null);

    useEffect(() => {
        console.log("loading recent videos from local");

        AsyncStorage.getItem('recentVideos').then((value) => {
            if (value) {
                setRecentVideos(JSON.parse(value));
            }
        });
    }, [recentVideoLoad])


    return (
        <View className=''>
            <Text className='text-white text-2xl font-medium ml-5'>Continue Learning</Text>
            <View className=' p-5  my-2 flex-none overflow-hidden'>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className='gap-x-4'>
                    {recentVideos?.map((order, index) => (
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
                                            {/* <Image source={require('../assets/clock2.png')} className='w-4 h-4' width={10} height={10} /> */}
                                            {/* <Text className='text-white text-xs font-light pt-1'>{moment(order?.date).format("MMM Do YY")}</Text> */}
                                            <Text className='text-white text-xs font-light pt-1'>Class-12 | Physics</Text>
                                        </View>
                                    </View>
                                    <Text className='text-lg text-white font-medium mb-0'>{order?.videoDetails?.name?.length >= 25 ? `${order?.videoDetails?.name?.substring(0, 25)}...` : order?.videoDetails?.name}</Text>
                                </View>
                                
                            </View>

                        </Pressable>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}
