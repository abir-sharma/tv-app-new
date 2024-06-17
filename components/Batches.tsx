/// <reference types="nativewind/types" />

import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useGlobalContext } from '../context/MainContext';
import FastImage from 'react-native-fast-image'
import { LinearGradient } from 'expo-linear-gradient';
import { fromCSS } from "@bacons/css-to-expo-linear-gradient";
// import { BlurView } from 'expo-blur';


export default function Batches() {

    const { orders, mainNavigation, subscribedBatches, setSelectedBatch, } = useGlobalContext();

    return (
        <View className=''>
            <Text className='text-white text-2xl font-medium ml-5 mt-2'>Online Batches</Text>
        <View className='p-5 w-full mx-auto mb-3 mt-2 flex-none overflow-hidden'>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className='gap-x-4'>
                {subscribedBatches?.map((order, index) => (
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
                            console.log("Batch iD: ", order?.batch?._id);
                            setSelectedBatch(order);
                            mainNavigation?.navigate('Details');
                        }}
                        className=' rounded-xl h-fit w-72 overflow-hidden '>
                            {/* <BlurView intensity={100} > */}
                            <LinearGradient
                                {...fromCSS(
                                    `linear-gradient(152.97deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)`
                                  )}
                                  className='rounded-xl overflow-hidden border-[1px] border-white/30'
                            >
                        <View className="w-full aspect-video rounded-t-xl overflow-hidden relative">
                            {
                                orders?.map((item, index) => {
                                    if (item?.itemName === order?.batch?.name) {
                                        return item?.thumbnailImageLink && <FastImage key={index} className=' w-full h-full rounded-t-lg ' source={{ uri: `${item?.thumbnailImageLink}` }} />
                                    }
                                })
                            }
                            {/* <Text className='text-black text-[10px] font-medium absolute left-2 bottom-1.5 rounded-md bg-white/80 px-2 py-1'>{"Hindi"}</Text> */}
                        </View>
                        <View className='p-2 relative px-5'>
                            <View className='flex flex-row items-center justify-center gap-3'>
                                <Text className='text-white text-lg font-base text-center'>{order?.batch?.name}</Text>
                            </View>                            
                        </View>
                        </LinearGradient>
                        {/* </BlurView> */}
                    </Pressable>
                ))}
            </ScrollView>
        </View>
        </View>
    );
}
