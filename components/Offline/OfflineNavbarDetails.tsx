/// <reference types="nativewind/types" />
import { useState } from 'react';
import { Image, Text, Pressable, View, Modal, FlatList } from 'react-native';
import { useGlobalContext } from '../../context/MainContext';
import styles from './NavbarDetails.style'
import Entypo from '@expo/vector-icons/Entypo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function OfflineNavbarDetails() {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const { offlineSections, setDirectoryLevel, offlineSelectedSection, headers, setHeaders, setOfflineCurrentDirectory, setOfflineSelectedSection, offlineSubjects, setOfflineSelectedBatch, setOfflineSelectedSubject, offlineSelectedSubject } = useGlobalContext();
  const navigation = useNavigation();

  const handleLogout = async () => {
    // @ts-expect-error
    navigation.navigate('Login');
    AsyncStorage.clear();
    setHeaders(null);
    try {
      const res = await axios.post("https://api.penpencil.co/v1/oauth/logout", { headers })
      if (res?.data?.success) {

      }
    }
    catch (err: any) {
    }
  }

  const renderItem = ({ item }: any) => (
    <Pressable
      style={styles.dropdownItem}
      onPress={() => {
        setOfflineSelectedSubject(item?.id);
        setDirectoryLevel(2);
        setOfflineCurrentDirectory(item?.path);
        setIsDropdownVisible(false);
      }}
    >
      <Text className='text-white text-xs'>{item?.name}</Text>
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
          className='rounded-xl bg-[#444444] px-5 py-2 overflow-hidden'
          hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.5)",
            borderless: false,
            radius: 1000,
            foreground: true
          }}>
          
          <View className='flex-row items-center justify-center gap-2'>
            {offlineSubjects[offlineSelectedSubject]?.name && <Text className='text-white text-sm'>{(offlineSubjects[offlineSelectedSubject]?.name?.length > 20) ? `${offlineSubjects[offlineSelectedSubject]?.name?.substring(0, 20)}...` : offlineSubjects[offlineSelectedSubject]?.name}</Text>}
            <Entypo name="chevron-down" size={20} color="white" />
          </View>
        </Pressable>
        </View>

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

      <View className=' rounded-xl flex-row gap-x-5 py-2 pr-5' >
        <Pressable
          hasTVPreferredFocus={true}
          android_ripple={{
            color: "rgba(255,255,255,0.4)",
            borderless: false,
            radius: 1000,
            foreground: true
          }}
          className='w-24 items-center h-8 justify-center rounded-lg overflow-hidden'
          style={{ backgroundColor: offlineSelectedSection == 3 ? 'rgba(255,255,255,.2)' : 'transparent' }}
          onPress={() => {
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
            color: "rgba(255,255,255,0.4)",
            borderless: false,
            radius: 1000,
            foreground: true
          }}
          className='w-24 items-center h-8 justify-center rounded-lg overflow-hidden'
          style={{ backgroundColor: offlineSelectedSection == 4 ? 'rgba(255,255,255,.2)' : 'transparent' }}
          onPress={() => {
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
            color: "rgba(255,255,255,0.4)",
            borderless: false,
            radius: 1000,
            foreground: true
          }}
          className='w-24 items-center h-8 justify-center rounded-lg overflow-hidden'
          style={{ backgroundColor: offlineSelectedSection == 1 ? 'rgba(255,255,255,.2)' : 'transparent' }}
          onPress={() => {
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
              color: "rgba(255,255,255,0.4)",
              borderless: false,
              radius: 1000,
              foreground: true
            }
          }
          className='w-24 items-center h-8 justify-center rounded-lg overflow-hidden'
          style={{ backgroundColor: offlineSelectedSection == 2 ? 'rgba(255,255,255,.2)' : 'transparent' }}
          onPress={() => {
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
        onPress={handleLogout}
        className='flex-row justify-center overflow-hidden rounded-full items-center'>
        <Text className='bg-white/10 overflow-hidden rounded-xm text-white px-5 py-3'>Logout</Text>
      </Pressable>
    </View>
  );
}