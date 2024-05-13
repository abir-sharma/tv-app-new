/// <reference types="nativewind/types" />

import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useGlobalContext } from '../context/MainContext';

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
                        className=' rounded-xl h-fit pb-2 w-72 overflow-hidden'>
                        <View className="w-full h-44 overflow-hidden rounded-lg relative">
                            {
                                orders?.map((item, index) => {
                                    if (item?.itemName === order?.batch?.name) {
                                        return item?.thumbnailImageLink && <Image key={index} className=' w-full h-full object-cover rounded-t-lg ' source={{ uri: `${item?.thumbnailImageLink}` }} />
                                    }
                                })
                            }
                            {/* <Text className='text-black text-[10px] font-medium absolute left-2 bottom-1.5 rounded-md bg-white/80 px-2 py-1'>{"Hindi"}</Text> */}
                        </View>
                        <View className='p-2 relative px-5'>
                            <View className='flex flex-row items-center justify-center gap-3'>
                                {/* <Image source={require('../assets/icon1.png')} className='w-3 h-3' width={10} height={10} /> */}
                                <Text className='text-white text-lg font-base text-center pt-1'>{order?.batch?.name}</Text>
                            </View>
                            {/* <View className='flex flex-row items-center justify-start gap-3'>
                                <Image source={require('../assets/icon1.png')} className='w-3 h-3' width={10} height={10} />
                                <Text className='text-white text-xs font-light pt-1'>Class 12th JEE Mains and Advanced Exam</Text>
                            </View>
                            <View className='flex flex-row items-center justify-start gap-3'>
                                <Image source={require('../assets/icon2.png')} className='w-3 h-3' width={10} height={10} />
                                <Text className='text-white text-xs font-light pt-1'>Starts On <Text className='text-white text-xs font-medium'>Starts on 09 May, 2024</Text></Text>
                            </View> */}
                            
                        </View>

                    </Pressable>
                ))}
            </ScrollView>
        </View>
        </View>
    );
}
