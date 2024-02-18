import React, { useState, Dispatch, SetStateAction, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { NoteType, QuizItemType, VideoType } from '../../types/types';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../../context/MainContext';
import axios from 'axios';

type DPPPropType = {
  noteList: NoteType[] | null,
  setNoteList: Dispatch<SetStateAction<NoteType[] | null>>,
  loadMore: boolean,
  getPaidBatches: any
}

export const DppComponent = ({ noteList, setNoteList, loadMore, getPaidBatches }: DPPPropType) => {

  const { mainNavigation, setTestData, selectedTestMapping, setSelectedTestMapping, batchDetails, setTestSections, setSelectedDpp, headers, selectedBatch, selectedChapter, selectedSubject } = useGlobalContext();
  const navigation = useNavigation();

  const [dppList, setDppList] = useState<QuizItemType[]>([]);

  const getDPP = async () => {
    try {
      const options = {
        headers
      }
      console.log(selectedBatch);
      console.log(selectedSubject);
      console.log(selectedChapter);
      console.log(headers);
      console.log("ALL DPP TEST LINK: ", `https://api.penpencil.co/v3/test-service/tests/dpp?page=1&limit=50&batchId=${selectedBatch?.batch?._id}&batchSubjectId=${selectedSubject?._id}&isSubjective=false&chapterId=${selectedChapter?._id}`)
      const res = await axios.get(`https://api.penpencil.co/v3/test-service/tests/dpp?page=1&limit=50&batchId=${selectedBatch?.batch?._id}&batchSubjectId=${selectedSubject?._id}&isSubjective=false&chapterId=${selectedChapter?._id}`, options);
      const list: any[] = [];
      const data = res.data.data;
      console.log("DPP List: ", data);
      setDppList(data);
    }
    catch (err) {
      console.log("Error in getDPP:", err);
    }
  }
  useEffect(() => {
    getDPP();
  }, [])

  const handleDppClick = async (item: any) => {
    console.log("Selected quiz", item);
    setSelectedDpp(item);
    try {
      const options = {
        headers
      }
      console.log(headers)
      console.log(`https://api.penpencil.co/v3/test-service/tests/${item?.test?._id}/start-test?testId=${item?.test?._id}&testSource=BATCH_QUIZ&type=${item?.tag}&batchId=${selectedBatch?.batch?._id}&batchScheduleId=${item?.scheduleId}`)
      const res = await axios.get(`https://api.penpencil.co/v3/test-service/tests/${item?.test?._id}/start-test?testId=${item?.test?._id}&testSource=BATCH_QUIZ&type=${item?.tag}&batchId=${selectedBatch?.batch?._id}&batchScheduleId=${item?.scheduleId}`, options);
      console.log("Test Started", res.data);
      setTestData(res.data.data);
      setTestSections(res.data.data.sections)
      setSelectedTestMapping(res.data.data.testStudentMapping._id);
      mainNavigation.navigate('Tests');
    } catch (err: any) {
      console.log("Error while starting test!!", err?.response);
    }
  }


  const renderGridItem = ({ item }: any) => (
    <Pressable
      style={{ flex: 1 / 4 }}
      className=' my-1 mr-5 overflow-hidden h-20 rounded-xl bg-white/5'
      android_ripple={{
        color: "rgba(255,255,255,0.4)",
        borderless: false,
        radius: 1000,
        foreground: true
      }}
      hasTVPreferredFocus
      onPress={() => { handleDppClick(item) }}>
      <View className='w-full h-full flex-row justify-between items-center px-5'>
        <View>
          <Text className='text-white font-medium text-lg'>{item.test.name}</Text>
          <View className='flex-row'><Image source={require('../../assets/noteIcon.png')} className='w-5 h-5 mr-2' width={10} height={10} /><Text className='text-white font-normal text-sm'>{`${item.test.totalQuestions} Questions  |  ${item.test.totalMarks} Marks`}</Text></View>
        </View>
        <Image source={require('../../assets/goto.png')} className='w-10 h-10' width={10} height={10} />
      </View>
    </Pressable>
  );

  return (
    <View className='pt-5'>
      <FlatList
        data={dppList}
        renderItem={renderGridItem}
        keyExtractor={(item: any) => item.test._id}
        numColumns={1}
      // onEndReached={()=>{loadMore && getPaidBatches()}}
      // contentContainerStyle={styles.container}
      />
    </View>
  );
};
