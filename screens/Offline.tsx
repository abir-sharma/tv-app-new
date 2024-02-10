import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal } from 'react-native';
import axios from 'axios';
import cheerio from 'cheerio';
import Pdf from 'react-native-pdf';
import { useNavigation } from '@react-navigation/native';
import Navbar from '../components/Navbar';
// import Video from 'react-native-video';


export const Offline = () => {
  const navigation = useNavigation();

  // states
  const [directoryListing, setDirectoryListing] = useState<any>([]);
  const [currentDirectory, setCurrentDirectory] = useState<any>('http://192.168.1.3:6969/');
  const [pdfOpen, setPdfOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  useEffect(() => {
    fetchDirectoryListing(currentDirectory);
  }, [currentDirectory]);

  const fetchDirectoryListing = async (directoryUrl: string) => {
    try {
      const response = await axios.get(directoryUrl);
      const directoryHtml = response.data;

      const $ = cheerio.load(directoryHtml);

      const directoryItems = $('ul li a')
        .map((index, element) => ({
          name: $(element).text(),
          link: $(element).attr('href')
        }))
        .get();
      setDirectoryListing(directoryItems);
    } catch (error) {
      console.error('Error fetching directory listing:', error);
    }
  };

  const handleDirectoryItemPress = (link: string) => {
    if (link.endsWith('.pdf')) {
      // @ts-expect-error
      navigation.navigate('PDFViewer', { pdfUrl: currentDirectory + link });
    } else if (link.endsWith('.mp4')) {
      console.log('.mp4');
      // @ts-expect-error
      navigation.navigate('MP4Player', { videoUrl: currentDirectory + link });
      // setVideoOpen(true);
      // setVideoUrl(link);
    } else {
      // Navigate to the selected directory
      const newDirectoryUrl = currentDirectory + link;
      setCurrentDirectory(newDirectoryUrl);
    }
  };

  const handleBackPress = () => {
    // Navigate back to the parent directory
    const segments = currentDirectory.split('/');
    segments.pop(); // Remove the last segment (current directory)
    segments.pop(); // Remove the previous segment (directory name)
    const parentDirectoryUrl = segments.join('/') + '/';
    setCurrentDirectory(parentDirectoryUrl);
  };


  return (
    <View style={{ flex: 1 }} className='bg-[#1A1A1A]'>
      <Navbar />
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
        <TouchableOpacity onPress={handleBackPress}>
          <Text style={{ color: 'yellow', marginRight: 20 }}>Back</Text>
        </TouchableOpacity>
        <Text style={{ marginLeft: 10 }} className='text-white'>Current Directory: {currentDirectory}</Text>
      </View>
      <FlatList
        data={directoryListing}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleDirectoryItemPress(item.link)}>
            <Text style={{ padding: 10, backgroundColor: '#efefef', margin: 7, borderRadius: 5 }}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
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