/// <reference types="nativewind/types" />

import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '../context/MainContext';
import PendriveChapters from '../components/Pendrive/PendriveChapters';
import PendriveNavbarDetails from '../components/Pendrive/PendriveNavbarDetails/PendriveNavbarDetails';
import { PendriveNoteComponent } from '../components/Pendrive/PendriveNoteComponent';
import { PendriveVideoComponent } from '../components/Pendrive/PendriveVideoComponent';

export default function PendriveBatchDetails({ navigation, route }: any) {
  const { offlineLectures, offlineNotes, offlineDpp, offlineDppPdf, offlineDppVideos, offlineSelectedSection } = useGlobalContext();
  const [showLoader, setshowLoader] = useState<boolean>(false);

  useEffect(() => {
    setshowLoader(true);
    if (offlineLectures) {
      setshowLoader(false);
    }
  }, [offlineLectures])

  return (
    <View className="bg-[#1B2124] flex-1">
      <PendriveNavbarDetails />

      <View className='flex-1 flex-row'>
        {showLoader && <View
          style={{ position: 'absolute', left: 0, top: 0, zIndex: 10, height: '100%', width: '100%', alignContent: 'center', flex: 1, alignItems: 'center', justifyContent: 'center' }}
          className='bg-white/10 '
        >
          <ActivityIndicator color={"#FFFFFF"} size={80} />
        </View>}

        <View className='flex-1 '>
          <PendriveChapters />
        </View>
        <View className=' flex-[3] pt-5'>
          {offlineSelectedSection == 0 && <PendriveNoteComponent noteList={offlineDpp} />}
          {offlineSelectedSection == 1 && <PendriveNoteComponent noteList={offlineDppPdf} />}
          {offlineSelectedSection == 2 && <PendriveVideoComponent videoList={offlineDppVideos} />}
          {offlineSelectedSection == 3 && <PendriveVideoComponent videoList={offlineLectures} />}
          {offlineSelectedSection == 4 && <PendriveNoteComponent noteList={offlineNotes} />}
        </View>

      </View>
    </View>
  );
}
