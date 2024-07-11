import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ToastAndroid, Pressable } from 'react-native';
import axios from 'axios';
import cheerio from 'cheerio';
import Navbar from '../components/Navbar';
import { useGlobalContext } from '../context/MainContext';
import { ItemType, ItemType2 } from '../types/types';
import OfflineBatches from '../components/Offline/OfflineBatches';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fromCSS } from '@bacons/css-to-expo-linear-gradient';
import { LinearGradient } from 'expo-linear-gradient';


export const Offline = () => {

  const { setDirectoryLevel, showIpInput, setShowIpInput, setOfflineSections, setOfflineSelectedSubject, setOfflineSelectedSection, setOfflineSelectedChapter, setOfflineLectures, setOfflineDpp, setOfflineNotes, setOfflineDppPdf, setOfflineDppVideos, offlineSelectedSection, directoryLevel, offlineCurrentDirectory, setOfflineCurrentDirectory, setOfflineBatches, setOfflineSubjects, setOfflineChapters } = useGlobalContext();
  const [ipAddress, setIpAddress] = useState("");
  const [ipp, setIpp] = useState("");

  useEffect(() => {
    fetchDirectoryListing(offlineCurrentDirectory);
  }, [offlineCurrentDirectory]);


  const isThumbnailAvailable = (directoryItems: any[], toFind: string) => {
    for (let i = 0; i < directoryItems.length; i++) {
      if (directoryItems[i].name === toFind) {
        return true;
      }
    }
    return false;
  }

  const fetchBatches = async () => {
    let directoryItems: any[] = await fetchListing();
    directoryItems = directoryItems?.filter((item) => item?.name?.startsWith('PW'));
    const batchNames: ItemType2[] = [];
    directoryItems?.map((item, index) => {
      if (!item?.name?.endsWith('.png')) {
        const checkThumbnail = isThumbnailAvailable(directoryItems, item?.link?.slice(0, -1) + '.png');
        batchNames?.push({
          name: item?.name?.slice(3, -1)?.trim(),
          path: offlineCurrentDirectory + item?.link,
          id: index,
          thumbnail: checkThumbnail ? offlineCurrentDirectory + item?.link?.slice(0, -1) + '.png' : '../assets/TV.png',
          defaultThumbnail: checkThumbnail
        })
      }
    })
    setOfflineBatches(batchNames);
  }

  const fetchSubjects = async () => {
    let directoryItems: any[] = await fetchListing();
    const subjectNames: ItemType[] = [];
    directoryItems?.map((item, index) => {
      if (!item?.name?.endsWith('.png')) {
        subjectNames?.push({
          name: item?.name?.slice(0, -1)?.trim(),
          path: offlineCurrentDirectory + item?.link,
          id: index,
        })
      }
    })
    setOfflineSubjects(subjectNames);
    setOfflineSelectedSubject(0);
    setDirectoryLevel(2);
    setOfflineCurrentDirectory(subjectNames[0]?.path);
  }

  const fetchChapters = async () => {

    let directoryItems: any[] = await fetchListing();
    const chapterNames: ItemType[] = [];
    directoryItems?.map((item, index) => {
      if (!item?.name?.endsWith('.png')) {
        chapterNames?.push({
          name: item?.name?.slice(0, -1)?.trim(),
          path: offlineCurrentDirectory + item?.link,
          id: index,
        })
      }
    })
    setOfflineChapters(chapterNames);
    setOfflineSelectedChapter(0);
    setDirectoryLevel(3);
    setOfflineCurrentDirectory(chapterNames[0]?.path);
  }

  const fetchSections = async () => {
    let directoryItems: any[] = await fetchListing();
    const sectionData: ItemType[] = [];
    directoryItems?.map((item, index) => {
      if (!item?.name?.endsWith('.png')) {
        sectionData?.push({
          name: item?.name?.slice(0, -1)?.trim(),
          path: offlineCurrentDirectory + item?.link,
          id: index,
        })
      }
    })
    setOfflineSections(sectionData);
    setOfflineSelectedSection(3);
    setDirectoryLevel(4);
    setOfflineCurrentDirectory(sectionData[3]?.path);
  }

  const fetchLectures = async () => {
    let directoryItems: any[] = await fetchListing();
    const lecturesData: ItemType2[] = [];
    directoryItems?.map((item, index) => {
      if (!item?.name?.endsWith('.png')) {
        const checkThumbnail = isThumbnailAvailable(directoryItems, item?.name?.slice(0, -4) + '.png');
        lecturesData?.push({
          name: item?.name?.slice(0, -4)?.trim(),
          path: offlineCurrentDirectory + item?.link,
          id: index,
          thumbnail: checkThumbnail ? offlineCurrentDirectory + item?.link?.slice(0, -4) + '.png' : '../assets/TV.png',
          defaultThumbnail: checkThumbnail
        })
      }
    })
    setOfflineLectures(lecturesData);
  }
  const fetchNotes = async () => {
    let directoryItems: any[] = await fetchListing();
    const notesData: ItemType2[] = [];
    directoryItems?.map((item, index) => {
      if (!item?.name?.endsWith('.png')) {
        const checkThumbnail = isThumbnailAvailable(directoryItems, item?.name?.slice(0, -4) + '.png');
        notesData?.push({
          name: item?.name?.slice(0, -4).trim(),
          path: offlineCurrentDirectory + item.link,
          id: index,
          thumbnail: checkThumbnail ? offlineCurrentDirectory + item?.link?.slice(0, -4) + '.png' : '../assets/TV.png',
          defaultThumbnail: checkThumbnail
        })
      }
    })
    setOfflineNotes(notesData);
  }
  const fetchDpp = async () => {

    let directoryItems: any[] = await fetchListing();
    const dppData: ItemType2[] = [];
    directoryItems?.map((item, index) => {
      if (!item?.name?.endsWith('.png')) {
        const checkThumbnail = isThumbnailAvailable(directoryItems, item?.name?.slice(0, -4) + '.png');
        dppData?.push({
          name: item?.name?.slice(0, -4)?.trim(),
          path: offlineCurrentDirectory + item?.link,
          id: index,
          thumbnail: checkThumbnail ? offlineCurrentDirectory + item?.link?.slice(0, -4) + '.png' : '../assets/TV.png',
          defaultThumbnail: checkThumbnail
        })
      }
    })
    setOfflineDpp(dppData);
  }
  const fetchDppPdf = async () => {
    

    let directoryItems: any[] = await fetchListing();
    const dppPdfData: ItemType2[] = [];
    directoryItems?.map((item, index) => {
      if (!item?.name?.endsWith('.png')) {
        const checkThumbnail = isThumbnailAvailable(directoryItems, item?.name?.slice(0, -4) + '.png');
        dppPdfData?.push({
          name: item?.name?.slice(0, -4)?.trim(),
          path: offlineCurrentDirectory + item.link,
          id: index,
          thumbnail: checkThumbnail ? offlineCurrentDirectory + item?.link?.slice(0, -4) + '.png' : '../assets/TV.png',
          defaultThumbnail: checkThumbnail
        })
      }
    })
    setOfflineDppPdf(dppPdfData);
    
  }
  const fetchDppVideos = async () => {
    
    let directoryItems: any[] = await fetchListing();
    const dppVideosData: ItemType2[] = [];
    directoryItems?.map((item, index) => {
      if (!item?.name?.endsWith('.png')) {
        const checkThumbnail = isThumbnailAvailable(directoryItems, item?.name?.slice(0, -4) + '.png');
        dppVideosData?.push({
          name: item?.name?.slice(0, -4)?.trim(),
          path: offlineCurrentDirectory + item?.link,
          id: index,
          thumbnail: checkThumbnail ? offlineCurrentDirectory + item?.link?.slice(0, -4) + '.png' : '../assets/TV.png',
          defaultThumbnail: checkThumbnail
        })
      }
    })
    setOfflineDppVideos(dppVideosData);
    
  }

  const fetchListing = async () => {
    try {
      const response = await axios.get(offlineCurrentDirectory);
      const directoryHtml = response?.data;
      const $ = cheerio.load(directoryHtml);
      let directoryItems = $('ul li a')
        .map((index, element) => ({
          name: $(element).text(),
          link: $(element).attr('href')
        }))
        .get();
      directoryItems = directoryItems.filter((item) => !item?.name?.startsWith('.'))
      setShowIpInput(false);
      return directoryItems;

    } catch (err: any) {
      console.error("error while fetching directory items", err);
      setShowIpInput(true);
      return [];
    }
  }

  const fetchDirectoryListing = async (directoryUrl: string) => {
    try {
      if (directoryLevel === 0) {
        await fetchBatches();
      } else if (directoryLevel === 1) {
        await fetchSubjects();
      } else if (directoryLevel === 2) {
        await fetchChapters();
      } else if (directoryLevel === 3) {
        await fetchSections();
      } else if (directoryLevel === 4) {
        if (offlineSelectedSection == 0) {
          await fetchDpp();
        } else if (offlineSelectedSection == 1) {
          await fetchDppPdf();
        } else if (offlineSelectedSection == 2) {
          await fetchDppVideos();
        } else if (offlineSelectedSection == 3) {
          await fetchLectures();
        } else {
          await fetchNotes();
        }
      }
    } catch (error) {
      console.error('Error fetching directory listing:', error);
    }
  };


  function isIPAddress(input: any) {
    
    // Regular expression to match IPv4 address format
    const ipv4Pattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

    // Regular expression to match IPv6 address format
    const ipv6Pattern = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

    // Check if input matches either IPv4 or IPv6 pattern
    return ipv4Pattern.test(input) || ipv6Pattern.test(input);
  }

  const handleIPChange = async() => {
    
    if (!isIPAddress(ipAddress?.split(':')[0])) {
      ToastAndroid.showWithGravity(
        'Enter an IP adress in correct format',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }
    setOfflineCurrentDirectory(`http://${ipAddress}/Batches/`);
    AsyncStorage.setItem("iP", ipAddress);
    fetchBatches();
    await getIP();
  }

  const getIP = async () => {
    const ip = await AsyncStorage.getItem("iP");
    setIpp(ip? ip : "");
  }

  useEffect(() => {
    getIP();
  }, [])

  useEffect(() => {
    setIpAddress(ipp)
  }, [ipp])

  return (
    <LinearGradient
    {...fromCSS(
      `linear-gradient(276.29deg, #2D3A41 6.47%, #2D3A41 47.75%, #000000 100%)`
    )}
    className=" flex-1">
      <Navbar />
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
        {showIpInput && <TextInput defaultValue={ipp} autoFocus={true} placeholder='Enter Ip' className=' rounded-lg pl-4 overflow-hidden ' onChangeText={(text) => { setIpAddress(text) }} style={{ backgroundColor: 'white', width: 200, marginRight: 20, padding: 4, }} />}
        {showIpInput &&
          <Pressable
            android_ripple={{
              color: "rgba(255,255,255,0.4)",
              borderless: false,
              radius: 1000,
              foreground: true
            }}

            onPress={() => {
               handleIPChange()
            }}
            className='bg-[#0569FF] w-40 h-10 overflow-hidden flex-row rounded-full px-4 items-center justify-start'>
            <Text className='text-white text-center w-full text-base'>Enter IP</Text>
          </Pressable>}
          {
          ipp &&
          <Pressable
            android_ripple={{
              color: "rgba(255,255,255,0.4)",
              borderless: false,
              radius: 1000,
              foreground: true
            }}

            onPress={() => {
              setShowIpInput(true);
              setIpp("");
              AsyncStorage.removeItem("iP");
            }}
            className='bg-[#0569FF] w-40 h-10 ml-2 overflow-hidden flex-row rounded-full px-4 items-center justify-start'>
            
            <Text className='text-white text-center w-full text-base'>Reset Ip</Text>
          </Pressable>
          }

      </View>
      <OfflineBatches />
    </LinearGradient>
  );
};