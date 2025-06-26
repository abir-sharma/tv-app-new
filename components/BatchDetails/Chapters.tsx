import { FlatList, Pressable, Text, View, Animated } from 'react-native';
import { useGlobalContext } from '../../context/MainContext';
import { useEffect,useState, useRef } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { fromCSS } from '@bacons/css-to-expo-linear-gradient';
import Entypo from '@expo/vector-icons/Entypo';

export default function Chapters() {

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);     
  const dropdownHeight = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;                 
  const { topicList,batchDetails, selectedSubject, setSelectedSubject, setSelectSubjectSlug, setSelectedChapter, selectedChapter, loadMoreChaptersData } = useGlobalContext();

    const handleDropdownPress = () => {
      const willOpen = !isDropdownVisible;
      setIsDropdownVisible(willOpen);
    
   
    Animated.timing(dropdownHeight, {
      toValue: willOpen ? 200 : 0, 
      duration: 800,
      useNativeDriver: false,
    }).start();
    
    Animated.timing(rotateAnim, {
      toValue: willOpen ? 1 : 0,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const chevronRotation = rotateAnim.interpolate({    
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const renderSubjectItem = ({ item }: any) => (
    <Pressable
      android_ripple={{
        color: "rgba(255, 255, 255, 0.1)",
        borderless: false,
        radius: 1000,
      }}
      className='mx-2 my-1 overflow-hidden '
      onPress={() => {
        setSelectedSubject(item);
        setSelectSubjectSlug(item?.slug);
        handleDropdownPress();
      }}
    >
      <Text className='text-white text-xs text-md bg-[#111111] py-3 rounded-md px-4'>{item?.subject}</Text>
    </Pressable>
  );

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


  const renderChapterItem = ({ item }: any) => (
    <Pressable
      key={item?._id}
      className={` overflow-hidden rounded-xl bg-[#111111] my-1`}
      hasTVPreferredFocus={true}
      android_ripple={{
        color: "rgba(249,197,69,0)",                                     //recent hover colour change here is required 
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

    <View className=" flex-1 p-4 rounded-r-lg bg-[#111111]">
      <View className="mt-4 mb-4">
       <Pressable
          onPress={() => { handleDropdownPress() }}
          className='items-start justify-center rounded-xl bg-[#1d2228] border border-gray-400 w-full h-14 overflow-hidden'
          hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.1)",
            borderless: false,
            radius:1000,
            foreground: true
          }}>
          <View className='flex-row items-center justify-between px-4 w-full'>
            <Text className='text-white font-semibold text-sm flex-1'>{selectedSubject && (selectedSubject?.subject?.length > 20) ? `${selectedSubject?.subject.substring(0, 20)}...` : selectedSubject?.subject || "Select Subject"}</Text>
            <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
              <Entypo name="chevron-down" size={20} color="white" />
            </Animated.View>
          </View>
        </Pressable>
        <Animated.View
          style={{
            height: dropdownHeight,
            overflow: 'hidden',
          }}
          className="bg-[#111111] border-l border-r border-b border-[#111111] rounded-b-xl"
        >
          {isDropdownVisible && (
            <FlatList
              data={batchDetails?.subjects}
              renderItem={renderSubjectItem}
              keyExtractor={(item) => item?._id}
              className="flex-1"
              showsVerticalScrollIndicator={false}
              bounces={false}
            />
          )}
        </Animated.View>
      </View>
      <View className='flex-1 mt-6'>
      <Text className='text-white font-medium text-2xl mb-4'>Chapters</Text>
      <View className='flex-1'>
        <FlatList
          data={sortedList}
          renderItem={renderChapterItem}
          keyExtractor={(item: TopicType) => item?._id}
          numColumns={1}
          onEndReached={() => { loadMoreChaptersData() }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
        </View>
      </View>
    </View>
  );
}



