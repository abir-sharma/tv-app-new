/// <reference types="nativewind/types" />
import { useState } from 'react';
import { Image, Text, Pressable, View, Modal, FlatList, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { useGlobalContext } from '../../context/MainContext';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { Images } from '../../images/images';

export default function NavbarDetails({ selectedMenu, setSelectedMenu, setContentType, setCurrentPage }: NavbarDetailsPropType) {
  const navigation = useNavigation();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const { setSelectedSubject, batchDetails, selectedSubject, setRecentVideoLoad, setTopicList, setSelectSubjectSlug, setSelectedBatch, setSelectedChapter } = useGlobalContext();

  const handleDropdownPress = () => {
    setIsDropdownVisible(prev => !prev);
  };

  const renderItem = ({ item }: any) => (
    <Pressable
      android_ripple={{
        color: "rgba(255, 255, 255, 0.1)",
        borderless: false,
        radius: 1000,
        foreground: true
      }}
      className='py-0.5 px-1 overflow-hidden '
      onPress={() => {
        setSelectedSubject(item);
        setSelectSubjectSlug(item?.slug);
        setIsDropdownVisible(false);
      }}
    >
      <Text className='text-white text-xs text-md bg-white/10 py-3 rounded-md px-4'>{item?.subject}</Text>
    </Pressable>
  );

  return (

    <View className=" flex-row justify-between items-center p-4 bg-[#fffbe6] border-b-[1px] border-gray-400">
      <View className='flex flex-row items-center justify-center gap-2'>
        <Pressable
          hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.4)",
            borderless: false,
            radius: 1000,
            foreground: true
          }}
          onPress={() => {
            // @ts-expect-error
            navigation.navigate('Home');
            setRecentVideoLoad(prev => !prev);
            setSelectedBatch(null);
            setSelectSubjectSlug(null);
            setSelectedSubject(null);
            setSelectedChapter(null);
            setTopicList(null);
            setSelectedMenu(0);
          }}
          className='flex-row justify-center items-center rounded-xl overflow-hidden px-2'>
          <Image source={Images.home} className='w-8 h-8' width={10} height={10} tintColor={"#f9c545"}/>
        </Pressable>

        <Pressable
          onPress={() => { handleDropdownPress() }}
          className='rounded-xl bg-[#f9c545] border border-gray-400 px-5 py-2 overflow-hidden'
          hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.5)",
            borderless: false,
            radius: 1000,
            foreground: true
          }}>
          <View className='flex-row items-center justify-center gap-2'>
            <Text className='text-black font-semibold text-sm'>{selectedSubject && (selectedSubject?.subject?.length > 20) ? `${selectedSubject?.subject.substring(0, 20)}...` : selectedSubject?.subject || "Select Subject"}</Text>
            <Entypo name="chevron-down" size={20} color="#222222" />
          </View>
        </Pressable>
      </View>


      <View>
        <Modal
          transparent={true}
          animationType="fade"
          visible={isDropdownVisible}
          onRequestClose={() => setIsDropdownVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setIsDropdownVisible(false)}>
            <View style={{ flex: 1 }}>
              <ScrollView className='bg-[#111111] border-white/20 border-[1px] max-h-[200] overflow-hidden w-[20%] rounded-lg absolute top-[70] left-[110] z-[2]'>
                <FlatList
                  data={batchDetails?.subjects}
                  renderItem={renderItem}
                  keyExtractor={(item) => item?._id}
                />
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>

      <View className=' rounded-xl flex-row py-2 pr-5' >
        <Pressable hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.4)",
            borderless: false,
            radius: 1000,
            foreground: true
          }} className='w-24 items-center h-10 justify-center rounded-l-lg overflow-hidden border-l border-r border-t border-r-gray-400 border-t-gray-400 border-l-gray-400' style={{ backgroundColor: selectedMenu == 0 ? '#f9c545' : 'white',borderBottomWidth: selectedMenu == 0 ? 4 : 3 }}
          onPress={() => { setSelectedMenu(0); setContentType('videos'); setCurrentPage(1) }}>
          <Text className="font-normal text-sm text-black">Lectures</Text>
        </Pressable>
        <Pressable hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.4)",
            borderless: false,
            radius: 1000,
            foreground: true
          }} className='w-20 items-center h-10 justify-center overflow-hidden border-r border-t border-r-gray-400 border-t-gray-400 ' style={{ backgroundColor: selectedMenu == 1 ? '#f9c545' : 'white',borderBottomWidth: selectedMenu == 1 ? 4 : 3 }} onPress={() => { setSelectedMenu(1); setContentType('notes'); setCurrentPage(1) }}>
          <Text className="font-normal text-sm text-black">Notes</Text>
        </Pressable>
        <Pressable hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.4)",
            borderless: false,
            radius: 1000,
            foreground: true
          }} className='w-24 items-center h-10 justify-center overflow-hidden border-r border-t border-r-gray-400 border-t-gray-400' style={{ backgroundColor: selectedMenu == 2 ? '#f9c545' : 'white',borderBottomWidth: selectedMenu == 2 ? 4 : 3 }} onPress={() => { setSelectedMenu(2); }}>
          <Text className="font-normal text-sm text-black">DPP Quiz</Text>
        </Pressable>
        <Pressable hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.4)",
            borderless: false,
            radius: 1000,
            foreground: true
          }} className='w-24 items-center h-10 justify-center overflow-hidden border-r border-t border-r-gray-400 border-t-gray-400' style={{ backgroundColor: selectedMenu == 3 ? '#f9c545' : 'white',borderBottomWidth: selectedMenu == 3 ? 4 : 3 }} onPress={() => { setSelectedMenu(3); setContentType('DppNotes'); setCurrentPage(1) }}>
          <Text className="font-normal text-sm text-black">DPP Notes</Text>
        </Pressable>
        <Pressable android_ripple={{
          color: "rgba(255,255,255,0.4)",
          borderless: false,
          radius: 1000,
          foreground: true
        }} className='w-24 items-center h-10 justify-center rounded-r-lg overflow-hidden border-t border-r-[3px] border-t-gray-400' style={{ backgroundColor: selectedMenu == 4 ? '#f9c545' : 'white', borderBottomWidth: selectedMenu == 4 ? 4 : 3 }} onPress={() => { setSelectedMenu(4); setContentType('DppVideos'); setCurrentPage(1) }}>
          <Text className="font-normal text-sm text-black">DPP Videos</Text>
        </Pressable>

      </View>

      <View className='flex-row opacity-0 justify-center overflow-hidden rounded-full items-center'>
        <Text className='bg-white/10 overflow-hidden rounded-xm text-black px-5 py-3'>Logout</Text>
      </View>
    </View>
  );
}