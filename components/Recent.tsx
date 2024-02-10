/// <reference types="nativewind/types" />

import { useContext } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useGlobalContext } from '../context/MainContext';

export default function Recent() {

    const {orders, setOrders} = useGlobalContext();

  return (
    <View className='w-[95%] mx-auto'>
    <Text className='text-white text-lg font-medium ml-5 mt-2'>Recent Learning</Text>
    <View className='bg-white/5 p-5 rounded-lg  my-5 flex-none overflow-hidden'>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className='gap-x-4'>
            {orders?.map((order)=>(
                <Pressable
                key={order.orderId}
                hasTVPreferredFocus={true}
                android_ripple={{
                    color: "rgba(255,255,255,0.5)",
                    borderless: false,
                    radius: 1000,
                    foreground: true
                }}
                onPress={()=>{

                }}
                className='bg-white/10 rounded-2xl h-52 w-72 overflow-hidden'>
                    <View className="w-full h-40 overflow-hidden">
                        {order?.thumbnailImageLink && <Image
                            className=' w-full h-full object-cover rounded-lg ' 
                            source={{uri: `${order?.thumbnailImageLink}`}}
                        />}
                    </View>
                    <View className='p-2 relative px-5'>
                        <Text className='text-white text-xs font-medium'>{order.itemName}</Text>
                        <Text className='text-white text-xs font-light'>Starts On <Text className='text-white text-xs font-medium'>14th Feb 2023</Text></Text>
                        <Text className='text-white text-[10px] font-medium absolute right-2 top-1.5 rounded-md bg-black/50 px-2 py-1'>{"Hindi"}</Text>
                    </View>

                </Pressable>
            ))}
        </ScrollView>
    </View>
    </View>
  );
}
