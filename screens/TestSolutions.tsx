import React from 'react'
import { View, Text, Image, Pressable, ScrollView } from 'react-native'

const TestSolutions = ({route}: any) => {

  return (
    <View className='bg-[#1A1A1A] min-h-screen p-5'>
        <View className='flex-row justify-between items-center'>
            <View>
                <View className='flex-row'>
                    <Image source={require('../assets/back.png')} className='w-8 h-8' width={10} height={10} />
                </View>
            </View>
            <Text className='text-white text-xl font-medium' >PRACTICE TEST ALPHA</Text>
            <Pressable
                android_ripple={{
                color: "rgba(255,255,255,0.5)",
                borderless: false,
                radius: 1000,
                foreground: true
                }}
                className='flex-row justify-center overflow-hidden rounded-full items-center'>
                <Image source={require('../assets/dp.png')} className='w-10 h-10' width={10} height={10} />
                {/* <Text className='bg-white/10 overflow-hidden rounded-xm text-white px-5 py-3'>Logout</Text> */}
            </Pressable>
        </View>
        
        <View className='flex-1 flex-row w-full rounded-xl mt-5 gap-x-5'>
        <View className='flex-[2] rounded-xl items-start justify-start px-5 py-0'>
                <Text className='text-white text-sm ml-auto text-center'>Video solution for Question 1</Text>
                <View className='h-52 bg-gray-600 rounded-lg w-full mt-1'></View>
                <View className='flex-row mt-3 gap-x-2'>
                    <Text className='text-[#5A4BDA] text-base bg-[#DEDAFF] px-5 py-1 text-center rounded flex-1'>All</Text>
                    <Text className='text-white text-base px-5 py-1 text-center rounded flex-1'>Incorrect</Text>
                    <Text className='text-white text-base px-5 py-1 text-center rounded flex-1'>Correct</Text>
                    <Text className='text-white text-base px-5 py-1 text-center rounded flex-1'>Skipped</Text>
                </View>
                {/* <ScrollView> */}
                <View className='flex-row flex-wrap py-4 gap-2'>
                    <View className='w-16 h-16 bg-white/10 rounded items-center justify-center'><Text className=' text-lg text-white font-medium '>{"01"}</Text></View>
                    <View className='w-16 h-16 bg-[#8E89BA] rounded items-center justify-center'><Text className=' text-lg text-white font-medium '>{"02"}</Text></View>
                    <View className='w-16 h-16 bg-white/10 rounded items-center justify-center'><Text className=' text-lg text-white font-medium '>{"03"}</Text></View>
                    <View className='w-16 h-16 bg-white/10 rounded items-center justify-center'><Text className=' text-lg text-white font-medium '>{"04"}</Text></View>
                    <View className='w-16 h-16 bg-white/10 rounded items-center justify-center'><Text className=' text-lg text-white font-medium '>{"05"}</Text></View>
                    <View className='w-16 h-16 bg-white/10 rounded items-center justify-center'><Text className=' text-lg text-white font-medium '>{"06"}</Text></View>
                    <View className='w-16 h-16 bg-white/10 rounded items-center justify-center'><Text className=' text-lg text-white font-medium '>{"07"}</Text></View>
                    <View className='w-16 h-16 bg-white/10 rounded items-center justify-center'><Text className=' text-lg text-white font-medium '>{"08"}</Text></View>
                    <View className='w-16 h-16 bg-white/10 rounded items-center justify-center'><Text className=' text-lg text-white font-medium '>{"09"}</Text></View>
                    <View className='w-16 h-16 bg-white/10 rounded items-center justify-center'><Text className=' text-lg text-white font-medium '>{"10"}</Text></View>
                </View>
                {/* </ScrollView> */}
                <View className='flex-row mt-3 justify-between items-center '>
                    <View className='flex-row flex-1 items-center justify-start gap-x-2'>
                        <View className='w-2 h-2 rounded-full bg-green-500'></View>
                        <Text className='text-white text-base text-center'>Correct</Text>
                    </View>
                    <View className='flex-row flex-1 items-center justify-start gap-x-2'>
                        <View className='w-2 h-2 rounded-full bg-red-500'></View>
                        <Text className='text-white text-base text-center'>Incorrect</Text>
                    </View>
                    <View className='flex-row flex-1 items-center justify-start gap-x-2'>
                        <View className='w-2 h-2 rounded-full bg-gray-400'></View>
                        <Text className='text-white text-base text-center'>Skipped</Text>
                    </View>
                </View>
                <View className=' flex-row justify-between items-center mt-5 w-full'>
                <Pressable
                hasTVPreferredFocus={true}
                android_ripple={{
                    color: "rgba(255,255,255,0.5)",
                    borderless: false,
                    radius: 1000,
                    foreground: true
                }}className='bg-[#A79EEB] rounded-xl w-40 text-center items-center py-2 overflow-hidden'>
                    <Text className='text-white text-lg'>Previous</Text>
                </Pressable>
                <Pressable
                hasTVPreferredFocus={true}
                android_ripple={{
                    color: "rgba(255,255,255,0.5)",
                    borderless: false,
                    radius: 1000,
                    foreground: true
                }}className='bg-[#A79EEB] rounded-xl w-40 text-center items-center py-2 overflow-hidden'>
                    <Text className='text-white text-lg'>Next</Text>
                </Pressable>
                </View>
            </View>
            <View className='flex-[3] h-[550]'>
                <View className='flex-1 bg-white/5 rounded-xl p-5'>
                    <View className='h-24 bg-white w-full rounded-lg'></View>
                <View className='gap-y-2 mt-5 w-[60%]'>
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
    </View>
  )
}

export default TestSolutions
