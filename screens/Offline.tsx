import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';
import cheerio from 'cheerio';
import Pdf from 'react-native-pdf';
import { useNavigation } from '@react-navigation/native';
import Navbar from '../components/Navbar';
import { NetworkInfo } from 'react-native-network-info';
import { useGlobalContext } from '../context/MainContext';
import { ItemType } from '../types/types';
import OfflineBatches from '../components/Offline/OfflineBatches';
// import Video from 'react-native-video';


export const Offline = () => {

  const { setDirectoryLevel, setOfflineSections, setOfflineSelectedSubject, setOfflineSelectedSection, setOfflineSelectedChapter, setOfflineLectures, setOfflineDpp, setOfflineNotes, setOfflineDppPdf, setOfflineDppVideos, offlineSelectedSection, directoryLevel, offlineCurrentDirectory, setOfflineCurrentDirectory, setOfflineBatches, setOfflineSubjects, setOfflineChapters } = useGlobalContext();
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


  const fetchBatches = async () => {
    console.log("fetch Batches");
    let directoryItems: any[] = await fetchListing();
    directoryItems = directoryItems.filter((item) => item.name.startsWith('PW'));
    const batchNames: ItemType[] = [];
    directoryItems.map((item, index) => {
      batchNames.push({
        name: item.name.slice(3, -1).trim(),
        path: offlineCurrentDirectory + item.link,
        id: index,
      })
    })
    setOfflineBatches(batchNames);
  }

  const fetchSubjects = async () => {
    console.log("fetch Subjects");
    let directoryItems: any[] = await fetchListing();
    const subjectNames: ItemType[] = [];
    directoryItems.map((item, index) => {
      subjectNames.push({
        name: item.name.slice(0, -1).trim(),
        path: offlineCurrentDirectory + item.link,
        id: index,
      })
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
      chapterNames.push({
        name: item.name.slice(0, -1).trim(),
        path: offlineCurrentDirectory + item.link,
        id: index,
      })
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
      sectionData.push({
        name: item.name.slice(0, -1).trim(),
        path: offlineCurrentDirectory + item.link,
        id: index,
      })
    })
    setOfflineSections(sectionData);
    setOfflineSelectedSection(3);
    setDirectoryLevel(4);
    setOfflineCurrentDirectory(sectionData[3]?.path);
  }

  const fetchLectures = async () => {
    console.log("fetch Lectures");
    let directoryItems: any[] = await fetchListing();
    const lecturesData: ItemType[] = [];
    directoryItems.map((item, index) => {
      lecturesData.push({
        name: item.name.trim(),
        path: offlineCurrentDirectory + item.link,
        id: index,
      })
    })
    setOfflineLectures(lecturesData);
    // console.log("Lectures Data:  ", lecturesData);
  }
  const fetchNotes = async () => {
    console.log("fetch Notes");

    let directoryItems: any[] = await fetchListing();
    const notesData: ItemType[] = [];
    directoryItems.map((item, index) => {
      notesData.push({
        name: item.name.trim(),
        path: offlineCurrentDirectory + item.link,
        id: index,
      })
    })
    setOfflineNotes(notesData);
    // console.log("Notes Data:  ", notesData);
  }
  const fetchDpp = async () => {
    console.log("fetch Dpp");

    let directoryItems: any[] = await fetchListing();
    const dppData: ItemType[] = [];
    directoryItems.map((item, index) => {
      dppData.push({
        name: item.name.trim(),
        path: offlineCurrentDirectory + item.link,
        id: index,
      })
    })
    setOfflineDpp(dppData);
    // console.log("DPP Data:  ", dppData);
  }
  const fetchDppPdf = async () => {
    console.log("fetch Dpp Pdf");

    let directoryItems: any[] = await fetchListing();
    const dppPdfData: ItemType[] = [];
    directoryItems.map((item, index) => {
      dppPdfData.push({
        name: item.name.trim(),
        path: offlineCurrentDirectory + item.link,
        id: index,
      })
    })
    setOfflineDppPdf(dppPdfData);
    // console.log("DPP PDF Data:  ", dppPdfData);
  }
  const fetchDppVideos = async () => {
    console.log("fetch Dpp Videos");
    let directoryItems: any[] = await fetchListing();
    const dppVideosData: ItemType[] = [];
    directoryItems.map((item, index) => {
      dppVideosData.push({
        name: item.name.trim(),
        path: offlineCurrentDirectory + item.link,
        id: index,
      })
    })
    setOfflineDppVideos(dppVideosData);
    // console.log("DPP Videos Data:  ", dppVideosData);
  }

  const fetchListing = async () => {
    console.log("Current Directory : ", offlineCurrentDirectory);
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
    return directoryItems;
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


  return (
    <View style={{ flex: 1 }} className='bg-[#1A1A1A]'>
      <Navbar />
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
        <TouchableOpacity onPress={handleBackPress}>
          <Text style={{ color: 'yellow', marginRight: 20 }}>Back</Text>
        </TouchableOpacity>
        <Text style={{ marginLeft: 10 }} className='text-white'>Current Directory: {offlineCurrentDirectory}</Text>
      </View>
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