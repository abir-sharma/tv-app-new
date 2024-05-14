import { FlatList, Pressable, Text, View } from 'react-native';
import { TopicType } from '../types/types';
import { useGlobalContext } from '../context/MainContext';

export default function Chapters() {

  const { topicList, setSelectedChapter, selectedChapter } = useGlobalContext();


  const renderItem = ({ item }: any) => (
    <Pressable
      key={item?._id}
      className={`py-4 px-4 overflow-hidden bg-white/5 my-0.5 rounded-lg ${selectedChapter?._id === item?._id && 'bg-[#7363FC]'}`}
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
      <Text className='text-white text-sm'>{item?.name}</Text>
    </Pressable>
  );
  return (
    <View className=" flex-col justify-between items-center p-4 bg-[#111111]">
      <Text className='text-white font-medium text-left w-full text-2xl pl-2'>Chapters</Text>
      <View className=' rounded-xl overflow-hidden mt-5 h-[510] w-full'>

        <FlatList
          data={topicList}
          renderItem={renderItem}
          keyExtractor={(item: TopicType) => item?._id}
          numColumns={1}
        />
      </View>
    </View>
  );
}