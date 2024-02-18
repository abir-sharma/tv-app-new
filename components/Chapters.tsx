import { useState } from 'react';
import { FlatList, Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import { TopicType, VideoType } from '../types/types';
import { useGlobalContext } from '../context/MainContext';

export default function Chapters() {

  const { topicList, setSelectedChapter, selectedChapter } = useGlobalContext();


  const renderItem = ({ item }: any) => (
    <Pressable
      key={item._id}
      className={`py-4 px-4 overflow-hidden rounded-lg ${selectedChapter?._id === item._id && 'bg-[#8E89BA]'}`}
      hasTVPreferredFocus={true}
      android_ripple={{
        color: "rgba(255,255,255,0.5)",
        borderless: false,
        radius: 1000,
        foreground: true
      }}
      onPress={() => {
        setSelectedChapter(item);
        console.log("Chapter selected: ", item._id);
      }}
    >
      <Text className='text-white text-sm'>{item.name}</Text>
    </Pressable>
  );
  return (
    <View className=" flex-col justify-between items-center p-4">
      <Text className='text-white font-medium text-center w-full text-lg'>CHAPTERS</Text>
      <View className='bg-white/5 rounded-xl overflow-hidden mt-5 h-[510] w-full'>
        {/* <Text style={styles.subjectText}>Physics</Text> */}
        <FlatList
          data={topicList}
          renderItem={renderItem}
          keyExtractor={(item: TopicType) => item._id}
          numColumns={1}
        // contentContainerStyle={styles.container}
        // onEndReached={()=>{loadMore && getPaidBatches()}}
        />
      </View>
    </View>
  );
}