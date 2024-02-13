import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Button, ToastAndroid, Pressable } from 'react-native';
import axios from 'axios';
import cheerio from 'cheerio';
import Pdf from 'react-native-pdf';
import { useNavigation } from '@react-navigation/native';
import Navbar from '../components/Navbar';
import { useGlobalContext } from '../context/MainContext';
import { ItemType, ItemType2 } from '../types/types';
import OfflineBatches from '../components/Offline/OfflineBatches';
import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';

// import Video from 'react-native-video';


export const Offline = () => {

  const { setDirectoryLevel, showIpInput, setShowIpInput, setOfflineSections, setOfflineSelectedSubject, setOfflineSelectedSection, setOfflineSelectedChapter, setOfflineLectures, setOfflineDpp, setOfflineNotes, setOfflineDppPdf, setOfflineDppVideos, offlineSelectedSection, directoryLevel, offlineCurrentDirectory, setOfflineCurrentDirectory, setOfflineBatches, setOfflineSubjects, setOfflineChapters } = useGlobalContext();
  const [ipAddress, setIpAddress] = useState("");
  const [pdfOpen, setPdfOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  // const [batches, setBatches] = useState<string[]>([]);

  const navigation = useNavigation();


  useEffect(() => {

    // const fetchIPAddress = async () => {
    //   NetworkInfo.getIPAddress()
    //     .then((res) => {
    //       console.log("IP", res)
    //       // setIpAddress(res);
    //       setOfflineCurrentDirectory(`http://${res}:6969/`)
    //     })
    //     .catch((err) => console.log("error while fetching IP.", err))
    // }
    // fetchIPAddress();

    fetchDirectoryListing(offlineCurrentDirectory);
  }, [offlineCurrentDirectory]);


  const isThumbnailAvailable = (directoryItems: any[], toFind: string) => {
    // console.log("Check area: ", directoryItems, " ::::: \n", `->${toFind}`);
    for (let i = 0; i < directoryItems.length; i++) {
      if (directoryItems[i].name === toFind) {
        return true;
      }
    }
    return false;
  }

  const fetchBatches = async () => {
    console.log("fetch Batches");
    let directoryItems: any[] = await fetchListing();
    directoryItems = directoryItems.filter((item) => item.name.startsWith('PW'));
    const batchNames: ItemType2[] = [];
    directoryItems.map((item, index) => {
      if (!item.name.endsWith('.png')) {
        const checkThumbnail = isThumbnailAvailable(directoryItems, item.link.slice(0, -1) + '.png');
        batchNames.push({
          name: item.name.slice(3, -1).trim(),
          path: offlineCurrentDirectory + item.link,
          id: index,
          thumbnail: checkThumbnail ? offlineCurrentDirectory + item.link.slice(0, -1) + '.png' : '../assets/icon.png',
          defaultThumbnail: checkThumbnail
        })
      }
    })
    console.log("Batches: ", batchNames);
    setOfflineBatches(batchNames);
  }

  const fetchSubjects = async () => {
    console.log("fetch Subjects");
    let directoryItems: any[] = await fetchListing();
    const subjectNames: ItemType[] = [];
    directoryItems.map((item, index) => {
      if (!item.name.endsWith('.png')) {
        subjectNames.push({
          name: item.name.slice(0, -1).trim(),
          path: offlineCurrentDirectory + item.link,
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
    console.log("fetch Chapters");

    let directoryItems: any[] = await fetchListing();
    const chapterNames: ItemType[] = [];
    directoryItems.map((item, index) => {
      if (!item.name.endsWith('.png')) {
        chapterNames.push({
          name: item.name.slice(0, -1).trim(),
          path: offlineCurrentDirectory + item.link,
          id: index,
        })
      }
    })
    setOfflineChapters(chapterNames);
    setOfflineSelectedChapter(0);
    setDirectoryLevel(3);
    setOfflineCurrentDirectory(chapterNames[0]?.path);
    // console.log("Chapter Names:  ", chapterNames);
  }

  const fetchSections = async () => {
    console.log("fetch Sections");
    let directoryItems: any[] = await fetchListing();
    const sectionData: ItemType[] = [];
    directoryItems.map((item, index) => {
      if (!item.name.endsWith('.png')) {
        sectionData.push({
          name: item.name.slice(0, -1).trim(),
          path: offlineCurrentDirectory + item.link,
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
    console.log("fetch Lectures");
    let directoryItems: any[] = await fetchListing();
    const lecturesData: ItemType2[] = [];
    directoryItems.map((item, index) => {
      if (!item.name.endsWith('.png')) {
        const checkThumbnail = isThumbnailAvailable(directoryItems, item.name.slice(0, -4) + '.png');
        lecturesData.push({
          name: item.name.slice(0, -4).trim(),
          path: offlineCurrentDirectory + item.link,
          id: index,
          thumbnail: checkThumbnail ? offlineCurrentDirectory + item.link.slice(0, -4) + '.png' : '../assets/icon.png',
          defaultThumbnail: checkThumbnail
        })
      }
    })
    // console.log(lecturesData)
    setOfflineLectures(lecturesData);
    console.log("Lectures Data:  ", lecturesData);
  }
  const fetchNotes = async () => {
    console.log("fetch Notes");
    let directoryItems: any[] = await fetchListing();
    const notesData: ItemType2[] = [];
    directoryItems.map((item, index) => {
      if (!item.name.endsWith('.png')) {
        const checkThumbnail = isThumbnailAvailable(directoryItems, item.name.slice(0, -4) + '.png');
        notesData.push({
          name: item.name.slice(0, -4).trim(),
          path: offlineCurrentDirectory + item.link,
          id: index,
          thumbnail: checkThumbnail ? offlineCurrentDirectory + item.link.slice(0, -4) + '.png' : '../assets/icon.png',
          defaultThumbnail: checkThumbnail
        })
      }
    })
    setOfflineNotes(notesData);
    console.log("Notes Data:  ", notesData);
  }
  const fetchDpp = async () => {
    console.log("fetch Dpp");

    let directoryItems: any[] = await fetchListing();
    const dppData: ItemType2[] = [];
    directoryItems.map((item, index) => {
      if (!item.name.endsWith('.png')) {
        const checkThumbnail = isThumbnailAvailable(directoryItems, item.name.slice(0, -4) + '.png');
        dppData.push({
          name: item.name.slice(0, -4).trim(),
          path: offlineCurrentDirectory + item.link,
          id: index,
          thumbnail: checkThumbnail ? offlineCurrentDirectory + item.link.slice(0, -4) + '.png' : '../assets/icon.png',
          defaultThumbnail: checkThumbnail
        })
      }
    })
    setOfflineDpp(dppData);
    console.log("DPP Data:  ", dppData);
  }
  const fetchDppPdf = async () => {
    console.log("fetch Dpp Pdf");

    let directoryItems: any[] = await fetchListing();
    const dppPdfData: ItemType2[] = [];
    directoryItems.map((item, index) => {
      if (!item.name.endsWith('.png')) {
        const checkThumbnail = isThumbnailAvailable(directoryItems, item.name.slice(0, -4) + '.png');
        dppPdfData.push({
          name: item.name.slice(0, -4).trim(),
          path: offlineCurrentDirectory + item.link,
          id: index,
          thumbnail: checkThumbnail ? offlineCurrentDirectory + item.link.slice(0, -4) + '.png' : '../assets/icon.png',
          defaultThumbnail: checkThumbnail
        })
      }
    })
    setOfflineDppPdf(dppPdfData);
    console.log("DPP PDF Data:  ", dppPdfData);
  }
  const fetchDppVideos = async () => {
    console.log("fetch Dpp Videos");
    let directoryItems: any[] = await fetchListing();
    const dppVideosData: ItemType2[] = [];
    directoryItems.map((item, index) => {
      if (!item.name.endsWith('.png')) {
        const checkThumbnail = isThumbnailAvailable(directoryItems, item.name.slice(0, -4) + '.png');
        dppVideosData.push({
          name: item.name.slice(0, -4).trim(),
          path: offlineCurrentDirectory + item.link,
          id: index,
          thumbnail: checkThumbnail ? offlineCurrentDirectory + item.link.slice(0, -4) + '.png' : '../assets/icon.png',
          defaultThumbnail: checkThumbnail
        })
      }
    })
    setOfflineDppVideos(dppVideosData);
    console.log("DPP Videos Data:  ", dppVideosData);
  }

  const fetchListing = async () => {
    console.log("Current Directory : ", offlineCurrentDirectory);
    try {
      const response = await axios.get(offlineCurrentDirectory);
      const directoryHtml = response.data;
      const $ = cheerio.load(directoryHtml);
      let directoryItems = $('ul li a')
        .map((index, element) => ({
          name: $(element).text(),
          link: $(element).attr('href')
        }))
        .get();
      directoryItems = directoryItems.filter((item) => !item.name.startsWith('.'))
      setShowIpInput(false);
      return directoryItems;

    } catch (err: any) {
      console.log("error while fetching directory items", err);
      // await analytics().logEvent("Axios Error: ", { err })
      ToastAndroid.showWithGravity(
        err.message,
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
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

  const handleDirectoryItemPress = (link: string) => {
    if (link.endsWith('.pdf')) {
      // @ts-expect-error
      navigation.navigate('PDFViewer', { pdfUrl: offlineCurrentDirectory + link });
    } else if (link.endsWith('.mp4')) {
      console.log('.mp4');
      // @ts-expect-error
      navigation.navigate('MP4Player', { videoUrl: offlineCurrentDirectory + link });
      // setVideoOpen(true);
      // setVideoUrl(link);
    } else {
      // Navigate to the selected directory
      const newDirectoryUrl = offlineCurrentDirectory + link;
      setOfflineCurrentDirectory(newDirectoryUrl);
    }
  };

  const handleBackPress = () => {
    // Navigate back to the parent directory
    const segments = offlineCurrentDirectory.split('/');
    segments.pop(); // Remove the last segment (current directory)
    segments.pop(); // Remove the previous segment (directory name)
    const parentDirectoryUrl = segments.join('/') + '/';
    setOfflineCurrentDirectory(parentDirectoryUrl);
  };

  function isIPAddress(input: any) {
    console.log("Check Input : ", input);
    // Regular expression to match IPv4 address format
    const ipv4Pattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

    // Regular expression to match IPv6 address format
    const ipv6Pattern = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;

    // Check if input matches either IPv4 or IPv6 pattern
    return ipv4Pattern.test(input) || ipv6Pattern.test(input);
  }

  const handleIPChange = () => {
    console.log("Hi");
    ToastAndroid.showWithGravity(
      'Checking Ip',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    if (!isIPAddress(ipAddress)) {
      ToastAndroid.showWithGravity(
        'Enter an IP adress in correct format',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }
    console.log(`http://${ipAddress}:6969/Desktop/`)
    ToastAndroid.showWithGravity(
      'Ip checked!!',
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
    setOfflineCurrentDirectory(`http://${ipAddress}:6969/Desktop/`);
    AsyncStorage.setItem("iP", ipAddress);
    fetchBatches();
  }

  return (
    <View style={{ flex: 1 }} className='bg-[#1A1A1A]'>
      <Navbar />
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 10 }}>
        {/* <TouchableOpacity onPress={handleBackPress}>
          <Text style={{ color: 'yellow', marginRight: 20 }}>Back</Text>
        </TouchableOpacity>
        <Text style={{ marginLeft: 10 }} className='text-white'>Current Directory: {offlineCurrentDirectory}</Text> */}
        {showIpInput && <TextInput autoFocus={true} placeholder='Enter Ip' className=' rounded-lg pl-4 overflow-hidden ' onChangeText={(text) => { setIpAddress(text) }} style={{ backgroundColor: 'white', width: 200, marginRight: 20, padding: 4, }} />}
        {showIpInput &&
          <Pressable
            android_ripple={{
              color: "rgba(255,255,255,0.4)",
              borderless: false,
              radius: 1000,
              foreground: true
            }}

            // onPress={() => {
            //   handleIPChange()
            // }}
            className='bg-[#8E89BA] w-40 h-10 overflow-hidden flex-row rounded-full px-4 items-center justify-start'>
            <TouchableOpacity onPress={() => {
              console.log("Hi");
              handleIPChange()
            }}
            >

              <Text className='text-white text-center w-full text-base'>Enter IP</Text>
            </TouchableOpacity>
          </Pressable>}

      </View>
      {/* 
      <TouchableOpacity onPress={() => console.log("Hiiiiiiii")}>
        Testing
      </TouchableOpacity> */}
      <OfflineBatches />
      {/* <FlatList
        data={directoryListing}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleDirectoryItemPress(item.link)}>
            <Text style={{ padding: 10, backgroundColor: '#efefef', margin: 7, borderRadius: 5 }}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      /> */}
      {/* <WebView
        source={{ uri: 'https://bamlab.github.io/react-tv-space-navigation/' }}
        style={{ flex: 1 }}
      /> */}

      {/* {videoOpen && (
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => setVideoOpen(false)}>
            <Text style={{ color: 'blue' }}>Close Video</Text>
          </TouchableOpacity>
          <Video
            source={{ uri: videoUrl }}
            style={{ flex: 1 }}
            controls={true}
          />
        </View>
      )} */}
    </View>
  );
};