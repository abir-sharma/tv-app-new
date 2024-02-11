/// <reference types="nativewind/types" />
import { useState } from 'react';
import { Image, Text, Pressable, View, Modal, TouchableWithoutFeedback, FlatList, TouchableOpacity } from 'react-native';
import { useGlobalContext } from '../../context/MainContext';
import { NoteType, VideoType } from '../../types/types';
import styles from './NavbarDetails.style'


export default function OfflineNavbarDetails() {

  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const { offlineCurrentDirectory, offlineSections, setDirectoryLevel, offlineSelectedSection, setOfflineCurrentDirectory, setOfflineSelectedSection, offlineSubjects, setOfflineSelectedBatch, setOfflineSelectedSubject, offlineSelectedSubject, mainNavigation } = useGlobalContext();


  const renderItem = ({ item }: any) => (
    <Pressable
      style={styles.dropdownItem}
      onPress={() => {
        setOfflineSelectedSubject(item.id);
        setDirectoryLevel(2);
        setOfflineCurrentDirectory(item?.path);
        setIsDropdownVisible(false);
      }}
    >
      <Text className='text-white text-xs'>{item.name}</Text>
    </Pressable>
  );



  return (
    <View className=" flex-row justify-between items-center p-4 bg-white/5">
      <Pressable
        hasTVPreferredFocus={true}
        android_ripple={{
          color: "rgba(255,255,255,0.2)",
          borderless: false,
          radius: 1000,
          foreground: true
        }}
        onPress={() => {
          mainNavigation.navigate('Home');
          setOfflineSelectedBatch(-1);
        }}
        className='flex-row justify-center items-center rounded-xl overflow-hidden px-2'>
        <Image source={require('../../assets/home.png')} className='w-8 h-8' width={10} height={10} />
      </Pressable>

      <View>
        <Pressable
          onPress={() => {
            setIsDropdownVisible(prev => !prev);
          }}
          className='rounded-xl bg-[#444444] px-16 py-2 overflow-hidden'
          hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.5)",
            borderless: false,
            radius: 1000,
            foreground: true
          }}>
          {offlineSubjects[offlineSelectedSubject]?.name && <Text className='text-white text-sm'>{(offlineSubjects[offlineSelectedSubject]?.name.length > 20) ? `${offlineSubjects[offlineSelectedSubject].name.substring(0, 20)}...` : offlineSubjects[offlineSelectedSubject].name}</Text>}
        </Pressable>

        <Modal
          transparent={true}
          animationType="fade"
          visible={isDropdownVisible}
          onRequestClose={() => setIsDropdownVisible(false)}
        >
          <Pressable onPress={() => setIsDropdownVisible(false)}>
            <View style={{ flex: 1 }}>
              <View className='bg-[#444444] max-h-[200] overflow-hidden w-[20%] rounded-lg absolute top-[70] left-[130] z-[2]'>
                {offlineSubjects && <FlatList
                  data={offlineSubjects}
                  renderItem={renderItem}
                />}
              </View>
            </View>
          </Pressable>
        </Modal>
      </View>

      <View className='bg-white/10 rounded-xl flex-row gap-x-5 py-2 pr-5' >
        <Pressable
          hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.2)",
            borderless: false,
            radius: 1000,
            foreground: true
          }}
          className='w-24 items-center h-8 justify-center rounded-lg overflow-hidden'
          style={{ backgroundColor: offlineSelectedSection == 3 ? 'rgba(255,255,255,.2)' : 'transparent' }}
          onPress={() => {
            console.log(offlineSections);
            if (offlineSections) {
              setDirectoryLevel(4);
              setOfflineCurrentDirectory(offlineSections[3]?.path);
              setOfflineSelectedSection(3);
            }
          }}
        >
          <Text className="font-normal text-sm text-white">Lectures</Text>
        </Pressable>
        <Pressable
          hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.2)",
            borderless: false,
            radius: 1000,
            foreground: true
          }}
          className='w-24 items-center h-8 justify-center rounded-lg overflow-hidden'
          style={{ backgroundColor: offlineSelectedSection == 4 ? 'rgba(255,255,255,.2)' : 'transparent' }}
          onPress={() => {
            console.log(offlineSections);
            if (offlineSections) {
              setDirectoryLevel(4);
              setOfflineCurrentDirectory(offlineSections[4]?.path);
              setOfflineSelectedSection(4);
            }
          }}>
          <Text className="font-normal text-sm text-white">Notes</Text>
        </Pressable>
        <Pressable
          hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.2)",
            borderless: false,
            radius: 1000,
            foreground: true
          }}
          className='w-24 items-center h-8 justify-center rounded-lg overflow-hidden'
          style={{ backgroundColor: offlineSelectedSection == 0 ? 'rgba(255,255,255,.2)' : 'transparent' }}
          onPress={() => {
            console.log(offlineSections);
            if (offlineSections) {
              setDirectoryLevel(4);
              setOfflineCurrentDirectory(offlineSections[0]?.path);
              setOfflineSelectedSection(0);
            }
          }}
        >
          <Text className="font-normal text-sm text-white">DPP</Text>
        </Pressable>
        <Pressable
          hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.2)",
            borderless: false,
            radius: 1000,
            foreground: true
          }}
          className='w-24 items-center h-8 justify-center rounded-lg overflow-hidden'
          style={{ backgroundColor: offlineSelectedSection == 1 ? 'rgba(255,255,255,.2)' : 'transparent' }}
          onPress={() => {
            console.log(offlineSections);
            if (offlineSections) {
              setDirectoryLevel(4);
              setOfflineCurrentDirectory(offlineSections[1]?.path);
              setOfflineSelectedSection(1);
            }
          }}
        >
          <Text className="font-normal text-sm text-white">DPP PDF</Text>
        </Pressable>
        <Pressable
          android_ripple={
            {
              color: "rgba(255,255,255,0.2)",
              borderless: false,
              radius: 1000,
              foreground: true
            }
          }
          className='w-24 items-center h-8 justify-center rounded-lg overflow-hidden'
          style={{ backgroundColor: offlineSelectedSection == 2 ? 'rgba(255,255,255,.2)' : 'transparent' }}
          onPress={() => {
            console.log(offlineSections);
            if (offlineSections) {
              setDirectoryLevel(4);
              setOfflineCurrentDirectory(offlineSections[2]?.path);
              setOfflineSelectedSection(2);
            }
          }}
        >
          <Text className="font-normal text-sm text-white">DPP Videos</Text>
        </Pressable>

      </View>

      <Pressable
        android_ripple={{
          color: "rgba(255,255,255,0.5)",
          borderless: false,
          radius: 1000,
          foreground: true
        }}
        className='flex-row justify-center overflow-hidden rounded-full items-center'>
        <Image source={require('../../assets/dp.png')} className='w-10 h-10' width={10} height={10} />
      </Pressable>
    </View>
  );
}