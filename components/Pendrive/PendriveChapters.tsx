/// <reference types="nativewind/types" />
import { FlatList, Pressable, Text, View } from 'react-native';
import { useGlobalContext } from '../../context/MainContext';
import { LinearGradient } from 'expo-linear-gradient';
import { fromCSS } from '@bacons/css-to-expo-linear-gradient';
import { FileSystem } from 'react-native-file-access';
import { Images } from '../../images/images';

export default function PendriveChapters() {

  const { offlineSelectedChapter, setDirectoryLevel, offlineChapters, setOfflineCurrentDirectory, setOfflineSelectedChapter, setOfflineLectures } = useGlobalContext();

  const getLectures = async (path: string) => {
    let directoryItems: any[] = await FileSystem.ls(path);
    directoryItems = directoryItems.filter((lecture) => !lecture.startsWith('.'));
    const lecturesData: ItemType2[] = [];
    directoryItems?.map((lecture, index) => {
      if (!lecture?.name?.endsWith('.png')) {
        const checkThumbnail = isThumbnailAvailable(directoryItems, lecture?.name?.slice(0, -4) + '.png');
        lecturesData?.push({
          name: lecture,
          path: path + "/" + lecture,
          id: index,
          thumbnail: checkThumbnail ? path + lecture?.name + '.png' : Images.tv,
          defaultThumbnail: checkThumbnail
        })
      }
    })
    setOfflineLectures(lecturesData);
  }

  const isThumbnailAvailable = (directoryItems: any[], toFind: string) => {
    for (let i = 0; i < directoryItems.length; i++) {
      if (directoryItems[i].name === toFind) {
        return true;
      }
    }
    return false;
  }

  const renderItem = ({ item }: any) => (
    <Pressable
      className={`overflow-hidden rounded-lg my-1`}
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
        getLectures(item?.path + "/Lectures");
        // setOfflineCurrentDirectory(item?.path);
      }}
    >
      {offlineSelectedChapter === item?.id ? 
      <LinearGradient {...fromCSS(`linear-gradient(90deg, #0368FF 0%, #5899FF 100%)`)}
        className='py-4 px-4 rounded-xl overflow-hidden'>
        <Text className='text-white text-sm'>{item?.name}</Text>
      </LinearGradient>
      :
      <LinearGradient {...fromCSS(`linear-gradient(102.97deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)`)}
        className='py-4 px-4 rounded-xl overflow-hidden'>
        <Text className='text-white text-sm'>{item?.name}</Text>
      </LinearGradient>  
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