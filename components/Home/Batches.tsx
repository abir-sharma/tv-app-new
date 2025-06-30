/// <reference types="nativewind/types" />

import { Pressable, ScrollView, Text, View } from 'react-native';
import { useGlobalContext } from '../../context/MainContext';                    //L1 used
import FastImage from 'react-native-fast-image'
import { LinearGradient } from 'expo-linear-gradient';
import { fromCSS } from "@bacons/css-to-expo-linear-gradient";
import { useNavigation } from '@react-navigation/native';
import sendGoogleAnalytics from '../../utils/sendGoogleAnalytics';
import sendMongoAnalytics from '../../utils/sendMongoAnalytics';



export default function Batches() {

    const { subscribedBatches, setSelectedBatch, setSelectedMenu } = useGlobalContext();
    const navigation = useNavigation();
    
    return (
        <View className=''>
            <Text className='text-black text-2xl font-medium ml-5 mt-5'>Online Batches</Text>
        <View className='p-5 w-full mx-auto mb-3 mt-2 flex-none overflow-hidden'>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className='gap-x-4'>
                {subscribedBatches?.map((order, index) => order.isPurchased &&(
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
                            setSelectedBatch(order);
                            setSelectedMenu(0);
                            sendGoogleAnalytics("batch_opened", { 
                                batch_name: order?.name,
                                batch_id: order?._id,
                            });
                            sendMongoAnalytics("batch_opened", {
                                batchName: order?.name,
                                batchId: order?._id,
                            });
                            // @ts-expect-error
                            navigation.navigate('BatchDetails');
                        }}
                        className=' rounded-xl h-52 w-72 overflow-hidden '>
                            
                            {/* @ts-expect-error */}
                            <LinearGradient
                                {...fromCSS(
                                    `linear-gradient(152.97deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)`
                                  )}
                                  className='rounded-xl overflow-hidden h-52 border-[1px] border-black bg-[#fffbe6]'
                            >
                        <View className="w-[95%] aspect-video rounded-xl overflow-hidden relative mt-2 ml-2 mr-2">
                        <FastImage
                                key={index}
                                className="w-full h-full rounded-t-lg "
                                source={{ uri: `${order?.previewImage?.baseUrl + order?.previewImage?.key}` }}
                                />
                        </View>
                        <View className='p-2 relative px-5'>
                            <View className='flex flex-row items-center justify-center gap-3'>
                                <Text className='text-black text-lg font-base text-center'>{order?.name?.length > 20 ? `${order?.name?.substring(0, 20)}...` : order?.name}</Text>
                            </View>                            
                        </View>
                        </LinearGradient>
                    </Pressable>
                ))}
            </ScrollView>
        </View>
        </View>
    );
}
