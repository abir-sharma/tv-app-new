/// <reference types="nativewind/types" />

import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import NavbarDetails from '../components/NavbarDetails';
import Batches from '../components/Batches';
import Recent from '../components/Recent';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '../context/MainContext';
import { NoteType, VideoType } from '../types/types';
import Chapters from '../components/Chapters';
import axios from 'axios';
import OfflineNavbarDetails from '../components/Offline/OfflineNavbarDetails';
import { VideoComponent } from '../components/Options/VideoComponent';
import { NoteComponent } from '../components/Options/NoteComponent';
import { OfflineVideoComponent } from '../components/Offline/OfflineVideoComponent';
import { OfflineNoteComponent } from '../components/Offline/OfflineNoteComponent';
import OfflineChapters from '../components/Offline/OfflineChapters';

export default function OfflineDetails({ navigation }: any) {

  const { offlineLectures, offlineNotes, offlineDpp, offlineDppPdf, offlineDppVideos, setMainNavigation, offlineSelectedSection, batchDetails, selectSubjectSlug, selectedSubject, selectedBatch, headers, selectedChapter, topicList } = useGlobalContext();

  const [showLoader, setshowLoader] = useState<boolean>(false);

  useEffect(() => {
    setshowLoader(true);
    if (offlineLectures) {
      setshowLoader(false);
    }
  }, [offlineLectures])



  return (
    <View className="bg-[#1A1A1A] flex-1">
      <OfflineNavbarDetails />

      <View className='flex-1 flex-row'>
        {showLoader && <View
          style={{ position: 'absolute', left: 0, top: 0, zIndex: 10, height: '100%', width: '100%', alignContent: 'center', flex: 1, alignItems: 'center', justifyContent: 'center' }}
          className='bg-white/10 '
        >
          <ActivityIndicator color={"#FFFFFF"} size={80} />
        </View>}

        <View className='flex-1 '>
          <OfflineChapters />
        </View>
        <ScrollView className=' flex-[3] pt-5'>
          {offlineSelectedSection == 0 && <OfflineNoteComponent noteList={offlineDpp} />}
          {offlineSelectedSection == 1 && <OfflineNoteComponent noteList={offlineDppPdf} />}
          {offlineSelectedSection == 2 && <OfflineVideoComponent videoList={offlineDppVideos} />}
          {offlineSelectedSection == 3 && <OfflineVideoComponent videoList={offlineLectures} />}
          {offlineSelectedSection == 4 && <OfflineNoteComponent noteList={offlineNotes} />}
        </ScrollView>

      </View>
    </View>
  );
}
