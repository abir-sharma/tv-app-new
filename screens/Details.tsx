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

export default function Details({navigation}: any) {
    
  const {setMainNavigation, batchDetails, selectSubjectSlug, selectedSubject, selectedBatch, headers, selectedChapter, topicList} = useGlobalContext();

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

  useEffect(()=>{
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
  
  useEffect(()=>{
    navigation.setOptions({headerShown: false});
    setMainNavigation(navigation);
  }, [])

  const getPaidBatches = async  () => {

    console.log("req:", batchDetails?.slug, selectSubjectSlug, currentPage, contentType, selectedChapter?.slug, selectedMenu);
    try{        
      const res = await axios.get(`https://api.penpencil.co/v2/batches/${batchDetails?.slug}/subject/${selectSubjectSlug}/contents?page=${currentPage}&contentType=${contentType}&tag=${selectedChapter?.slug}`, {headers});
      console.log("gg:", res.data.data);
      
      // setCurrentPage(prev=>prev+1)
      if(selectedMenu===0){
        setVideoList((prev:any) => ( (currentPage>1 && prev!==null) ? [...prev, ...res.data.data] : res.data.data));
        if(res?.data?.data?.length<=0){
          setShowLoadMoreVideos(false);
        }
      }
      else if (selectedMenu === 1){          
        setNoteList((prev:any) => ( (currentPage>1 && prev!==null) ? [...prev, ...res.data.data] : res.data.data));
        if(res?.data?.data?.length<=0){
          setShowLoadMoreNotes(false);
        }
      }
      else if (selectedMenu === 3){          
        setDppNoteList((prev:any) => ( (currentPage>1 && prev!==null) ? [...prev, ...res.data.data] : res.data.data));
        if(res?.data?.data?.length<=0){
          setShowLoadMoreDppNotes(false);
        }
      }
      else if (selectedMenu === 4){          
        setDppVideoList((prev:any) => ( (currentPage>1 && prev!==null) ? [...prev, ...res.data.data] : res.data.data));
        if(res?.data?.data?.length<=0){
          setShowLoadMoreDppVideos(false);
        }
      }
      else{
        console.log("hehehh");
      }
      
      
    }
    catch(err){
      console.log("error:", err);
    }
  }

  useEffect(()=>{

    getPaidBatches();
    
  }, [selectedChapter, currentPage, selectedMenu])

  return (
    <View className="bg-[#1A1A1A] flex-1">
      <NavbarDetails selectedMenu={selectedMenu} setSelectedMenu={setSelectedMenu} setContentType={setContentType} setCurrentPage={setCurrentPage}/>
      
      <View className='flex-1 flex-row'>

            <View className='flex-1 '>
              <Chapters/>
            </View>

            <ScrollView className=' flex-[3]'>
              {selectedMenu==0 && <VideoComponent videoList={videoList} setVideoList={setVideoList} getPaidBatches={getPaidBatches} loadMore={showLoadMoreVideos}/>}
            </ScrollView>

        </View>
    </View>
  );
}
