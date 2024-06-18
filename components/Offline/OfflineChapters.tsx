/// <reference types="nativewind/types" />
import { FlatList, Pressable, Text, View } from 'react-native';
import { useGlobalContext } from '../../context/MainContext';
import { LinearGradient } from 'expo-linear-gradient';
import { fromCSS } from '@bacons/css-to-expo-linear-gradient';

export default function OfflineChapters() {

  const { offlineSelectedChapter, setDirectoryLevel, offlineChapters, setOfflineCurrentDirectory, setOfflineSelectedChapter } = useGlobalContext();

  const renderItem = ({ item }: any) => (
    <Pressable
      className={`overflow-hidden rounded-lg bg-white/5 my-0.5`}
      hasTVPreferredFocus={true}
      android_ripple={{
        color: "rgba(255,255,255,0.5)",
        borderless: false,
        radius: 1000,
        foreground: true
      }}
      onPress={() => {
        setOfflineSelectedChapter(item?.id);
        setDirectoryLevel(3);
        setOfflineCurrentDirectory(item?.path);
        console.log("Chapter selected: ", item);
      }}
    >
      {offlineSelectedChapter === item?.id ? 
      <LinearGradient {...fromCSS(`linear-gradient(90deg, #0368FF 0%, #5899FF 100%)`)}
        className='py-4 px-4 rounded-xl overflow-hidden'>
        <Text className='text-white text-sm'>{item?.name}</Text>
      </LinearGradient>
      :
      <View
        
        className='py-4 px-4 rounded-xl overflow-hidden'
      >
        <Text className='text-white text-sm'>{item?.name}</Text>
      </View>  
    }
    </Pressable>
  );

  return (
    <View className=" flex-col justify-between items-center p-4 bg-[#111111]">
      <Text className='text-white font-medium text-left w-full text-2xl pl-2'>CHAPTERS</Text>
      <View className=' rounded-xl overflow-hidden mt-5 h-[510] w-full'>
        {/* <Text style={styles.subjectText}>Physics</Text> */}
        <FlatList
          data={offlineChapters}
          renderItem={renderItem}
          numColumns={1}
        // contentContainerStyle={styles.container}
        // onEndReached={()=>{loadMore && getPaidBatches()}}
        />
      </View>
    </View>
  );
}