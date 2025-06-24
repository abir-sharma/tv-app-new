import { FlatList, Pressable, Text, View } from 'react-native';
import { useGlobalContext } from '../../context/MainContext';
import { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { fromCSS } from '@bacons/css-to-expo-linear-gradient';

export default function Chapters() {

  const { topicList, setSelectedChapter, selectedChapter, loadMoreChaptersData } = useGlobalContext();

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
      className={` overflow-hidden rounded-xl bg-[#111111] my-1`}
      hasTVPreferredFocus={true}
      android_ripple={{
        color: "rgba(0,0,0,0)",                                     //recent hover colour change here is required 
        borderless: false,
        radius: 1000,
        foreground: true
      }}
      onPress={() => {
        setSelectedChapter(item);
      }}
    >
      {
        selectedChapter?._id === item?._id ?
        <LinearGradient {...fromCSS(`linear-gradient(90deg, #F9C545 0%, #F9C545 100%)`)}
          className='py-4 px-4 rounded-xl overflow-hidden'>
          <Text className='text-black font-semibold text-sm'>{item?.name}</Text>
        </LinearGradient>
        :
        <LinearGradient {...fromCSS(`linear-gradient(102.97deg, rgba(17, 17, 17, 0.2) 0%, rgba(17, 17, 17, 0) 100%)`)}
        className='py-4 px-4 rounded-xl overflow-hidden'>
        <Text className='text-white text-sm'>{item?.name}</Text>
      </LinearGradient>}
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
          onEndReached={() => { loadMoreChaptersData() }}
        />
      </View>
    </View>
  );
}