/// <reference types="nativewind/types" />

import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useGlobalContext } from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VideoType } from '../types/types';
import moment from 'moment';

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
            <Text className='text-white text-lg font-medium ml-5'>Recent Learning</Text>
            <View className='bg-[#1B2124] p-5  my-2 flex-none overflow-hidden'>
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
                            className='bg-[#414347] rounded-lg h-fit w-72 overflow-hidden'>
                            <View >
                                <View>
                                    {order?.videoDetails?.image && <Image
                                        style={{ width: '100%', height: 135, objectFit: 'cover', borderRadius: 10, }}
                                        source={{ uri: `${order?.videoDetails?.image}` }}
                                    />}
                                </View>
                                <View className='p-2'>
                                    <Text className='text-base text-white font-medium my-1 mb-0'>{order?.videoDetails?.name?.length >= 60 ? `${order?.videoDetails?.name?.substring(0, 60)}...` : order?.videoDetails?.name}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View className='flex flex-row items-center justify-start gap-1'>
                                        <Image source={require('../assets/clock2.png')} className='w-4 h-4' width={10} height={10} />
                                        <Text className='text-white text-xs font-light pt-1'>{moment(order?.date).format("MMM Do YY")}</Text>
                                    </View>
                                    </View>
                                </View>
                                
                            </View>

                        </Pressable>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}
