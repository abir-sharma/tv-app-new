/// <reference types="nativewind/types" />

import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import NavbarDetails from '../components/NavbarDetails';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '../context/MainContext';
import { NoteType, VideoType } from '../types/types';
import Chapters from '../components/Chapters';
import axios from 'axios';
import { VideoComponent } from '../components/Options/VideoComponent';
import { NoteComponent } from '../components/Options/NoteComponent';
import { DppComponent } from '../components/Options/DppComponent';

export default function Details({ navigation }: any) {

  const { setMainNavigation, setLogs, fetchDetails, setDppList, batchDetails, selectSubjectSlug, selectedSubject, selectedBatch, headers, selectedChapter } = useGlobalContext();


  const [contentType, setContentType] = useState<string>('videos');
  const [selectedMenu, setSelectedMenu] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showLoader, setShowLoader] = useState<boolean>(true);


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

  useEffect(()=>{
    console.log("fetching details on command");
    getDetails();
  }, [fetchDetails])

  const getDetails = async () => {

    console.log("req:", batchDetails?.slug, selectSubjectSlug, currentPage, contentType, selectedChapter?.slug, selectedMenu);
    setShowLoader(true);
    try {
      const res = await axios.get(`https://api.penpencil.co/v2/batches/${batchDetails?.slug}/subject/${selectSubjectSlug}/contents?page=${currentPage}&contentType=${contentType}&tag=${selectedChapter?.slug}`, { headers });

      const resDpp = await axios.get(`https://api.penpencil.co/v3/test-service/tests/dpp?page=1&limit=50&batchId=${selectedBatch?._id}&batchSubjectId=${selectedSubject?._id}&isSubjective=false&chapterId=${selectedChapter?._id}`, { headers });

      if (selectedMenu === 0) {
        setVideoList((prev: any) => ((currentPage > 1 && prev !== null) ? [...prev, ...res?.data?.data] : res?.data?.data));
        if (res?.data?.data?.length <= 0) {
          setShowLoadMoreVideos(false);
        }
      }
      else if (selectedMenu === 1) {
        setNoteList((prev: any) => ((currentPage > 1 && prev !== null) ? [...prev, ...res?.data?.data] : res?.data?.data));
        if (res?.data?.data?.length <= 0) {
          setShowLoadMoreNotes(false);
        }
      }
      else if (selectedMenu === 2) {
        const data = resDpp?.data?.data;
        console.log("DPP List: ", data);
        setDppList(data);
      }
      else if (selectedMenu === 3) {
        setDppNoteList((prev: any) => ((currentPage > 1 && prev !== null) ? [...prev, ...res?.data?.data] : res?.data?.data));
        if (res?.data?.data?.length <= 0) {
          setShowLoadMoreDppNotes(false);
        }
      }
      else if (selectedMenu === 4) {
        setDppVideoList((prev: any) => ((currentPage > 1 && prev !== null) ? [...prev, ...res?.data?.data] : res?.data?.data));
        if (res?.data?.data?.length <= 0) {
          setShowLoadMoreDppVideos(false);
        }
      }
      else {
        console.log("hehehh");
      }


    }
    catch (err: any) {
      // console.log("error:", err);
      setLogs((logs) => [...logs, "Error in DETAILS PAGE API:" + JSON.stringify(err?.response)]);

    }
    setShowLoader(false);
  }

  useEffect(() => {

    getDetails();

  }, [selectedChapter, currentPage, selectedMenu])

  return (
    <View className="bg-[#1B2124] flex-1">
      <NavbarDetails selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} setContentType={setContentType} setCurrentPage={setCurrentPage} />

      <View className='flex-1 flex-row'>

        {showLoader && <View
          style={{ position: 'absolute', left: 0, top: 0, zIndex: 10, height: '100%', width: '100%', alignContent: 'center', flex: 1, alignItems: 'center', justifyContent: 'center' }}
          className='bg-[#1B2124] '
        >
          <ActivityIndicator color={"#FFFFFF"} size={80} />
        </View>}
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
    </View>
  );
}
