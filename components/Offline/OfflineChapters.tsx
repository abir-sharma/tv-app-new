/// <reference types="nativewind/types" />
import { FlatList, Pressable, Text, View } from 'react-native';
import { useGlobalContext } from '../../context/MainContext';

export default function OfflineChapters() {

  const { offlineSelectedChapter, setDirectoryLevel, offlineChapters, setOfflineCurrentDirectory, setOfflineSelectedChapter } = useGlobalContext();

  const renderItem = ({ item }: any) => (
    <Pressable
      className={`py-4 px-4 overflow-hidden rounded-lg ${offlineSelectedChapter === item?.id && 'bg-[#8E89BA]'}`}
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
      <Text className='text-white text-sm'>{item?.name}</Text>
    </Pressable>
  );

  return (
    <View className=" flex-col justify-between items-center p-4">
      <Text className='text-white font-medium text-center w-full text-lg'>CHAPTERS</Text>
      <View className='bg-white/5 rounded-xl overflow-hidden mt-5 w-full'>
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