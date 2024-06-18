import { FlatList, Pressable, Text, View } from 'react-native';
import { TopicType } from '../types/types';
import { useGlobalContext } from '../context/MainContext';
import { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { fromCSS } from '@bacons/css-to-expo-linear-gradient';

export default function Chapters() {

  const { topicList, setSelectedChapter, selectedChapter } = useGlobalContext();

  const sortedList = topicList?.sort((a:any, b:any) => {
    if (a.videos === 0 && b.videos !== 0) {
      return 1;
    } else if (a.videos !== 0 && b.videos === 0) {
      return -1;
    } else {
      return 0;
    }
  });

  useEffect(()=>{
    if(sortedList){
      setSelectedChapter(sortedList[0]);
    }
  }, [sortedList])


  const renderItem = ({ item }: any) => (
    <Pressable
      key={item?._id}
      className={` overflow-hidden rounded-xl bg-white/5 my-0.5`}
      hasTVPreferredFocus={true}
      android_ripple={{
        color: "rgba(255,255,255,0.5)",
        borderless: false,
        radius: 1000,
        foreground: true
      }}
      onPress={() => {
        setSelectedChapter(item);
        console.log("Chapter selected: ", item?._id);
      }}
    >
      {
        selectedChapter?._id === item?._id ?
        <LinearGradient {...fromCSS(`linear-gradient(90deg, #0368FF 0%, #5899FF 100%)`)}
          className='py-4 px-4 rounded-xl overflow-hidden'>
          <Text className='text-white text-sm'>{item?.name}</Text>
        </LinearGradient>
        :
      <View
        
        className='py-4 px-4 rounded-xl overflow-hidden'
      >
        <Text className='text-white text-sm'>{item?.name}</Text>
      </View>}
    </Pressable>
  );
  return (
    <View className=" flex-col justify-between items-center p-4 bg-[#111111]">
      <Text className='text-white font-medium text-left w-full text-2xl pl-2'>Chapters</Text>
      <View className=' rounded-xl overflow-hidden mt-5 h-[510] w-full'>

        <FlatList
          data={sortedList}
          renderItem={renderItem}
          keyExtractor={(item: TopicType) => item?._id}
          numColumns={1}
        />
      </View>
    </View>
  );
}