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
                <Pressable className='bg-white/20 rounded-xl px-5 py-2'>
                    <Text className='text-white text-lg'>View Instructions</Text>
                </Pressable>
                <Pressable className='bg-[#5A4BDA] rounded-xl px-5 py-2 ml-4'>
                    <Text className='text-white text-lg'>Submit Test</Text>
                </Pressable>
            </View>
        </View>
        <View className='mt-10'>
            <View className='bg-white/5 px-4 py-2 w-20 rounded-lg'><Text className='text-white text-center'>{"Maths"}</Text></View>
        </View>
    </View>
  )
}

export default Tests
