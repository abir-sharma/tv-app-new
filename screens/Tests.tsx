import React from 'react'
import { View, Text, Image, Pressable } from 'react-native'

const Tests = ({route}: any) => {

  return (
    <View className='bg-[#1A1A1A] min-h-screen p-5'>
        <View className='flex-row justify-between items-center'>
            <View>
                <Text className='text-white text-xl font-medium' >Practice Test Alpha</Text>
                <View className='flex-row mt-2'>
                    <Image source={require('../assets/clock.png')} className='w-5 h-5' width={10} height={10} />
                    <Text className='text-white ml-2'>{"03:18:52"}</Text>
                </View>
            </View>
            <View className='flex-row'>
                <Pressable
                hasTVPreferredFocus={true}
                android_ripple={{
                    color: "rgba(255,255,255,0.5)",
                    borderless: false,
                    radius: 1000,
                    foreground: true
                }}className='bg-white/20 rounded-xl px-5 py-2 overflow-hidden'>
                    <Text className='text-white text-lg'>View Instructions</Text>
                </Pressable>
                <Pressable
                hasTVPreferredFocus={true}
                android_ripple={{
                    color: "rgba(255,255,255,0.5)",
                    borderless: false,
                    radius: 1000,
                    foreground: true
                }}className='bg-[#5A4BDA] rounded-xl px-5 py-2 ml-4 overflow-hidden'>
                    <Text className='text-white text-lg'>Submit Test</Text>
                </Pressable>
            </View>
        </View>
        <View className='mt-10 justify-center'>
            <View className='bg-white/5 px-4 py-2 mr-auto rounded-lg'>
                <Text className='text-white text-center'>{"Maths"}</Text>
            </View>
            <View className='flex flex-row mt-4'>
                <View className='bg-[#8E89BA] px-4 py-2 rounded-lg'>
                    <Text className='text-white text-center'>{2}</Text>
                </View>
                <View className='bg-white/10 w-[2px] h-full mx-3'></View>
                <View className='bg-white/10 px-4 py-2 mr-3 rounded-lg'>
                    <Text className='text-white text-center'>{"Marks"} <Text className='text-green-500'> +4 </Text> <Text className='text-red-500'> -1 </Text> </Text>
                </View>
                <View className='bg-white/10 px-4 py-2 mr-auto rounded-lg'>
                    <Text className='text-white text-center'>{"Type: Single"} </Text>
                </View>
            </View>
        </View>
        <View className='flex-1 flex-row w-full rounded-xl mt-10 gap-x-5'>
            <View className='flex-[3] h-[380]'>
                <View className='flex-1 bg-white/5 rounded-xl'>
                    
                </View>
                <Pressable
                hasTVPreferredFocus={true}
                android_ripple={{
                    color: "rgba(255,255,255,0.5)",
                    borderless: false,
                    radius: 1000,
                    foreground: true
                }}className='bg-[#A79EEB] rounded-xl px-5 mr-auto mt-2 py-2 overflow-hidden'>
                    <Text className='text-white text-lg'>Previous</Text>
                </Pressable>
            </View>
            <View className='flex-[2] rounded-xl items-start justify-start px-5 py-3'>
                <Text className='text-white text-lg text-center'>Options:</Text>
                <View className='gap-y-2 mt-5 w-full'>
                    <View className='bg-white/5 px-5 py-5 rounded-lg'>
                        <Text className='text-white'> {"a.    "} <Text className='text-white'> {" 5,7 "} </Text></Text>
                    </View>
                    <View className='bg-white/5 px-5 py-5 rounded-lg'>
                        <Text className='text-white'> {"b.    "} <Text className='text-white'> {" 7,5 "} </Text></Text>
                    </View>
                    <View className='bg-white/5 px-5 py-5 rounded-lg'>
                        <Text className='text-white'> {"c.    "} <Text className='text-white'> {" 2,3 "} </Text></Text>
                    </View>
                    <View className='bg-white/5 px-5 py-5 rounded-lg'>
                        <Text className='text-white'> {"d.    "} <Text className='text-white'> {" 5,3 "} </Text></Text>
                    </View>

                </View>
            </View>
        </View>
    </View>
  )
}

export default Tests
