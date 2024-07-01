import React, { useState, useEffect } from 'react';
import { useKeepAwake } from 'expo-keep-awake';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import VideoPlayer from '../components/video-player/player';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VideoType } from '../types/types';

const RecentVideos = ({ route }: any) => {
  useKeepAwake();
  const [recentVideos, setRecentVideos] = useState<{ [key: string]: VideoType[] } | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentVideos, setCurrentVideos] = useState<VideoType[]>([]);
  const [playingVideo, setPlayingVideo] = useState<VideoType | null>(null);

  const subject = route?.params?.subject;

  useEffect(() => {
    const loadRecentVideos = async () => {
      try {
        const recentVideosStr = await AsyncStorage.getItem('recentVideos');
        const videos: { [key: string]: VideoType[] } = recentVideosStr ? JSON.parse(recentVideosStr) : {};

        if (videos[subject]) {
          setCurrentVideos(videos[subject]);
          setRecentVideos(videos);
          setPlayingVideo(videos[subject][0])
        }
      } catch (error) {
        console.error('Error loading recent videos:', error);
      }
    };

    loadRecentVideos();
  }, [subject]);

  const handleNext = () => {
    if (currentIndex < currentVideos.length - 1) {
      console.log("playing next video", currentVideos[currentIndex+1]?.videoDetails);
      setCurrentIndex(prev=>prev+1);
      setPlayingVideo(currentVideos[currentIndex+1])
    }
    else{
      console.log("no next video");
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      console.log("playing prev video:", currentVideos[currentIndex-1]?.videoDetails);
      setCurrentIndex(prev=>prev-1);
      setPlayingVideo(currentVideos[currentIndex-1])

    }
    else{
      console.log("no prev video");
    }
  };

  return (
    <View>
      {playingVideo && <VideoPlayer currentIndex={currentIndex} currentVideos={currentVideos} handlePrevious={handlePrevious} handleNext={handleNext} lectureDetails={playingVideo?.videoDetails} scheduleDetails={playingVideo} isLive={false} />}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 5,
  },
  button: {
    backgroundColor: 'black',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default RecentVideos;