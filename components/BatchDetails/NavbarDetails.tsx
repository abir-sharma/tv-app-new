/// <reference types="nativewind/types" />
import { useState } from 'react';
import { Image, Text, Pressable, View, Modal, FlatList, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { useGlobalContext } from '../../context/MainContext';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';

export default function NavbarDetails({ selectedMenu, setSelectedMenu, setContentType, setCurrentPage }: NavbarDetailsPropType) {
  const navigation = useNavigation();
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const { setSelectedSubject, batchDetails, selectedSubject, setRecentVideoLoad, setTopicList, setSelectSubjectSlug, setSelectedBatch, setSelectedChapter } = useGlobalContext();

  const handleDropdownPress = () => {
    setIsDropdownVisible(prev => !prev);
    setSelectedChapter(null);
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
      <Text className='text-white text-xs text-md bg-white/5 py-3 rounded-md px-4'>{item?.subject}</Text>
    </Pressable>
  );

  return (

    <View className=" flex-row justify-between items-center p-4 bg-[#111111]">
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
          }}
          className='flex-row justify-center items-center rounded-xl overflow-hidden px-2'>
          <Image source={require('../../assets/home.png')} className='w-8 h-8' width={10} height={10} />
        </Pressable>

        <Pressable
          onPress={() => { handleDropdownPress() }}
          className='rounded-xl bg-[#444444] px-5 py-2 overflow-hidden'
          hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.5)",
            borderless: false,
            radius: 1000,
            foreground: true
          }}>
          <View className='flex-row items-center justify-center gap-2'>
            <Text className='text-white text-sm'>{selectedSubject && (selectedSubject?.subject?.length > 20) ? `${selectedSubject?.subject.substring(0, 20)}...` : selectedSubject?.subject || "Select Subject"}</Text>
            <Entypo name="chevron-down" size={20} color="white" />
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
                  data={batchDetails?.subjects?.slice(1)}
                  renderItem={renderItem}
                  keyExtractor={(item) => item?._id}
                />
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>

      <View className=' rounded-xl flex-row gap-x-4 py-2 pr-5' >
        <Pressable hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.4)",
            borderless: false,
            radius: 1000,
            foreground: true
          }} className='w-24 items-center h-8 justify-center rounded-lg overflow-hidden' style={{ backgroundColor: selectedMenu == 0 ? '#414347' : 'transparent' }}
          onPress={() => { setSelectedMenu(0); setContentType('videos'); setCurrentPage(1) }}>
          <Text className="font-normal text-sm text-white">Lectures</Text>
        </Pressable>
        <Pressable hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.4)",
            borderless: false,
            radius: 1000,
            foreground: true
          }} className='w-20 items-center h-8 justify-center rounded-lg overflow-hidden' style={{ backgroundColor: selectedMenu == 1 ? 'rgba(255,255,255,.2)' : 'transparent' }} onPress={() => { setSelectedMenu(1); setContentType('notes'); setCurrentPage(1) }}>
          <Text className="font-normal text-sm text-white">Notes</Text>
        </Pressable>
        <Pressable hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.4)",
            borderless: false,
            radius: 1000,
            foreground: true
          }} className='w-24 items-center h-8 justify-center rounded-lg overflow-hidden' style={{ backgroundColor: selectedMenu == 2 ? 'rgba(255,255,255,.2)' : 'transparent' }} onPress={() => { setSelectedMenu(2); }}>
          <Text className="font-normal text-sm text-white">DPP Quiz</Text>
        </Pressable>
        <Pressable hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.4)",
            borderless: false,
            radius: 1000,
            foreground: true
          }} className='w-24 items-center h-8 justify-center rounded-lg overflow-hidden' style={{ backgroundColor: selectedMenu == 3 ? 'rgba(255,255,255,.2)' : 'transparent' }} onPress={() => { setSelectedMenu(3); setContentType('DppNotes'); setCurrentPage(1) }}>
          <Text className="font-normal text-sm text-white">DPP Notes</Text>
        </Pressable>
        <Pressable android_ripple={{
          color: "rgba(255,255,255,0.4)",
          borderless: false,
          radius: 1000,
          foreground: true
        }} className='w-24 items-center h-8 justify-center rounded-lg overflow-hidden' style={{ backgroundColor: selectedMenu == 4 ? 'rgba(255,255,255,.2)' : 'transparent' }} onPress={() => { setSelectedMenu(4); setContentType('DppVideos'); setCurrentPage(1) }}>
          <Text className="font-normal text-sm text-white">DPP Videos</Text>
        </Pressable>

      </View>

      <View className='flex-row opacity-0 justify-center overflow-hidden rounded-full items-center'>
        <Text className='bg-white/10 overflow-hidden rounded-xm text-white px-5 py-3'>Logout</Text>
      </View>
    </View>
  );
}