/// <reference types="nativewind/types" />

import { ScrollView, Text, View } from 'react-native';
import NavbarDetails from '../components/NavbarDetails';
import Batches from '../components/Batches';
import Recent from '../components/Recent';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '../context/MainContext';
import { NoteType, VideoType } from '../types/types';
import Chapters from '../components/Chapters';
import axios from 'axios';
import { VideoComponent } from '../components/Options/VideoComponent';
import { NoteComponent } from '../components/Options/NoteComponent';
import { DppComponent } from '../components/Options/DppComponent';

export default function Details({ navigation }: any) {

  const { setMainNavigation, batchDetails, selectSubjectSlug, selectedSubject, selectedBatch, headers, selectedChapter, topicList } = useGlobalContext();

  const [contentType, setContentType] = useState<string>('videos');
  const [selectedMenu, setSelectedMenu] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [videoList, setVideoList] = useState<VideoType[] | null>(null);
  const [noteList, setNoteList] = useState<NoteType[] | null>(null);
  const [dppNoteList, setDppNoteList] = useState<NoteType[] | null>(null);
  const [dppVideoList, setDppVideoList] = useState<VideoType[] | null>(null);

  const [showLoadMoreVideos, setShowLoadMoreVideos] = useState<boolean>(true);
  const [showLoadMoreNotes, setShowLoadMoreNotes] = useState<boolean>(true);
  const [showLoadMoreDppNotes, setShowLoadMoreDppNotes] = useState<boolean>(true);
  const [showLoadMoreDppVideos, setShowLoadMoreDppVideos] = useState<boolean>(true);

  useEffect(() => {
    setVideoList(null);
    setNoteList(null);
    setDppNoteList(null);
    setDppVideoList(null);
    setCurrentPage(1);
    setShowLoadMoreVideos(true);
    setShowLoadMoreNotes(true);
    setShowLoadMoreDppNotes(true);
    setShowLoadMoreDppVideos(true);

  }, [batchDetails, selectSubjectSlug, selectedSubject, selectedBatch])

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    setMainNavigation(navigation);
  }, [])

  const getDetails = async () => {

    console.log("req:", batchDetails?.slug, selectSubjectSlug, currentPage, contentType, selectedChapter?.slug, selectedMenu);
    try {
      const res = await axios.get(`https://api.penpencil.co/v2/batches/${batchDetails?.slug}/subject/${selectSubjectSlug}/contents?page=${currentPage}&contentType=${contentType}&tag=${selectedChapter?.slug}`, { headers });
      // console.log("gg:", res.data.data);

      // setCurrentPage(prev=>prev+1)
      if (selectedMenu === 0) {
        setVideoList((prev: any) => ((currentPage > 1 && prev !== null) ? [...prev, ...res.data.data] : res.data.data));
        if (res?.data?.data?.length <= 0) {
          setShowLoadMoreVideos(false);
        }
      }
      else if (selectedMenu === 1) {
        setNoteList((prev: any) => ((currentPage > 1 && prev !== null) ? [...prev, ...res.data.data] : res.data.data));
        if (res?.data?.data?.length <= 0) {
          setShowLoadMoreNotes(false);
        }
      }
      else if (selectedMenu === 3) {
        setDppNoteList((prev: any) => ((currentPage > 1 && prev !== null) ? [...prev, ...res.data.data] : res.data.data));
        if (res?.data?.data?.length <= 0) {
          setShowLoadMoreDppNotes(false);
        }
      }
      else if (selectedMenu === 4) {
        setDppVideoList((prev: any) => ((currentPage > 1 && prev !== null) ? [...prev, ...res.data.data] : res.data.data));
        if (res?.data?.data?.length <= 0) {
          setShowLoadMoreDppVideos(false);
        }
      }
      else {
        console.log("hehehh");
      }


    }
    catch (err) {
      console.log("error:", err);
    }
  }

  useEffect(() => {

    getDetails();

  }, [selectedChapter, currentPage, selectedMenu])

  return (
    <View className="bg-[#1A1A1A] flex-1">
      <NavbarDetails selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} setContentType={setContentType} setCurrentPage={setCurrentPage} />

      <View className='flex-1 flex-row'>

        <View className='flex-1 '>
          <Chapters />
        </View>

        <ScrollView className=' flex-[3] pt-5'>
          <View>
            {selectedMenu == 0 && <VideoComponent videoList={videoList} setVideoList={setVideoList} getPaidBatches={getDetails} loadMore={showLoadMoreVideos} />}
            {selectedMenu == 1 && <NoteComponent noteList={noteList} setNoteList={setNoteList} getPaidBatches={getDetails} loadMore={showLoadMoreNotes} />}
            {selectedMenu == 2 && <DppComponent noteList={noteList} setNoteList={setNoteList} getPaidBatches={getDetails} loadMore={showLoadMoreNotes} />}
            {selectedMenu == 3 && <NoteComponent noteList={dppNoteList} setNoteList={setDppNoteList} getPaidBatches={getDetails} loadMore={showLoadMoreDppNotes} />}
            {selectedMenu == 4 && <VideoComponent videoList={dppVideoList} setVideoList={setDppVideoList} getPaidBatches={getDetails} loadMore={showLoadMoreDppVideos} />}
          </View>
        </ScrollView>

      </View>

      {/* <ScrollView className=' flex-[3] pt-5'>
          {selectedMenu == 0 && <VideoComponent videoList={videoList} setVideoList={setVideoList} getPaidBatches={getPaidBatches} loadMore={showLoadMoreVideos} />}
          {selectedMenu == 1 && <NoteComponent noteList={noteList} setNoteList={setNoteList} getPaidBatches={getPaidBatches} loadMore={showLoadMoreNotes} />}
          {selectedMenu == 3 && <NoteComponent noteList={dppNoteList} setNoteList={setDppNoteList} getPaidBatches={getPaidBatches} loadMore={showLoadMoreDppNotes} />}
          {selectedMenu == 4 && <VideoComponent videoList={dppVideoList} setVideoList={setDppVideoList} getPaidBatches={getPaidBatches} loadMore={showLoadMoreDppVideos} />}
        </ScrollView> */}

    </View>
  );
}
