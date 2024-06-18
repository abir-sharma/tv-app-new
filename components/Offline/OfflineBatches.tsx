/// <reference types="nativewind/types" />

import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useGlobalContext } from '../../context/MainContext';
// @ts-expect-error
import defaultIcon from '../../assets/TV.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { fromCSS } from '@bacons/css-to-expo-linear-gradient';
import FastImage from 'react-native-fast-image';


export default function OfflineBatches(params: any) {

    const { setDirectoryLevel, setOfflineCurrentDirectory, offlineBatches } = useGlobalContext();
    const { mainNavigation } = useGlobalContext();
    const [showLoader, setShowLoader] = useState<boolean>(false);



    const getToken = async () => {
        console.log("Hi");
        console.log(await AsyncStorage.getItem("token"));
    }

    useEffect(() => {
        setShowLoader(true);
        if (offlineBatches) {
            setShowLoader(false);
        }
    }, [offlineBatches])

    return (
        <View className=' w-[95%] mx-auto my-5 flex-none overflow-hidden'>
            {showLoader && <View
                style={{ position: 'absolute', left: 0, top: 0, zIndex: 10, height: '100%', width: '100%', alignContent: 'center', flex: 1, alignItems: 'center', justifyContent: 'center' }}
                className='bg-white/10 '
            >
                <ActivityIndicator color={"#FFFFFF"} size={80} />
            </View>}
            <Text className='text-white text-2xl font-medium mt-2 mb-8'> Batches</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className='gap-x-4'>
                {offlineBatches?.map((batch: any, index: number) => (
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
                            console.log(batch?.path);
                            getToken();
                            setOfflineCurrentDirectory(batch?.path);
                            setDirectoryLevel(1);
                            mainNavigation?.navigate('OfflineDetails');
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
                        <FastImage
                                key={index}
                                className="w-full h-full rounded-t-lg"
                                source={{ uri: `${batch?.thumbnail}` }}
                                />
                        </View>
                        <View className='p-2 relative px-5'>
                            <View className='flex flex-row items-center justify-center gap-3'>
                                {/* <Text className='text-white text-lg font-base text-center'>{order?.batch?.name}</Text> */}
                                <Text className='text-white text-lg font-base text-center'>{batch?.name >= 20 ? `${batch?.name?.substring(0, 20)}...` : batch?.name}</Text>
                            </View>                            
                        </View>
                        </LinearGradient>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}
