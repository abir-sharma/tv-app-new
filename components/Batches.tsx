/// <reference types="nativewind/types" />

import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useGlobalContext } from '../context/MainContext';

export default function Batches() {

    const { orders, mainNavigation, subscribedBatches, setSelectedBatch, } = useGlobalContext();

    return (
        <View className='bg-white/5 p-5 w-[95%] rounded-3xl mx-auto my-5 flex-none overflow-hidden'>
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
                        className='bg-white/10 rounded-lg h-52 w-72 overflow-hidden'>
                        <View className="w-full h-40 overflow-hidden">
                            {
                                orders?.map((item, index) => {
                                    if (item?.itemName === order?.batch?.name) {
                                        return item?.thumbnailImageLink && <Image key={index} className=' w-full h-full object-cover rounded-lg ' source={{ uri: `${item?.thumbnailImageLink}` }} />
                                    }

                                })
                            }
                        </View>
                        <View className='p-2 relative px-5'>
                            <Text className='text-white text-xs font-medium'>{order?.batch?.name}</Text>
                            <Text className='text-white text-xs font-light'>Starts On <Text className='text-white text-xs font-medium'>14th Feb 2023</Text></Text>
                            <Text className='text-white text-[10px] font-medium absolute right-2 top-1.5 rounded-md bg-black/50 px-2 py-1'>{"Hindi"}</Text>
                        </View>

                    </Pressable>
                ))}
            </ScrollView>
        </View>
    );
}
