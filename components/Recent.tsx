/// <reference types="nativewind/types" />

import { useContext, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useGlobalContext } from '../context/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VideoType } from '../types/types';
import moment from 'moment';

export default function Recent() {

    const { orders, setOrders, mainNavigation, recentVideoLoad } = useGlobalContext();
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
        <View className='w-[95%] mx-auto'>
            <Text className='text-white text-lg font-medium ml-5 mt-2'>Recent Learning</Text>
            <View className='bg-white/5 p-5 rounded-lg  my-5 flex-none overflow-hidden'>
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
                                    lectureDetails: order.videoDetails,
                                });
                            }}
                            className='bg-white/10 rounded-lg h-52 w-72 overflow-hidden'>
                            <View >
                                <View>
                                    {order?.videoDetails?.image && <Image
                                        style={{ width: '100%', height: 135, objectFit: 'cover', borderRadius: 10, }}
                                        source={{ uri: `${order?.videoDetails?.image}` }}
                                    />}
                                </View>
                                <View className='p-2'>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Text className='text-white text-[10px]'>{moment(order.date).format("MMM Do YY")}</Text>
                                        <Text className='text-white text-[10px]'>{order?.videoDetails?.duration}</Text>
                                    </View>
                                    <Text className='text-xs text-white font-medium my-2'>{order?.videoDetails?.name?.length >= 60 ? `${order?.videoDetails?.name?.substring(0, 60)}...` : order?.videoDetails?.name}</Text>
                                </View>
                            </View>

                        </Pressable>
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}
