import React, { Dispatch, SetStateAction } from 'react';
import { View, Text, Image, FlatList, Pressable } from 'react-native';
import { NoteType } from '../../types/types';
import { useGlobalContext } from '../../context/MainContext';
import axios from 'axios';

type DPPPropType = {
  noteList: NoteType[] | null,
  setNoteList: Dispatch<SetStateAction<NoteType[] | null>>,
  loadMore: boolean,
  getPaidBatches: any
}

export const DppComponent = ({ }: DPPPropType) => {

  const { mainNavigation, setLogs, setTestData, dppList, setSelectedTestMapping, setTestSections, setSelectedDpp, headers, selectedBatch, } = useGlobalContext();



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
      console.log("Test Started", res?.data);
      setTestData(res?.data?.data);
      setTestSections(res?.data?.data?.sections)
      setSelectedTestMapping(res?.data?.data?.testStudentMapping?._id);
      mainNavigation.navigate('Tests');
    } catch (err: any) {
      console.log("Error while starting test!!", err?.response);
      setLogs((logs) => [...logs, "Error in START TEST API:" + JSON.stringify(err?.response)]);
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
          <Text className='text-white font-medium text-lg'>{item?.test?.name}</Text>
          <View className='flex-row'><Image source={require('../../assets/noteIcon.png')} className='w-5 h-5 mr-2' width={10} height={10} /><Text className='text-white font-normal text-sm'>{`${item?.test?.totalQuestions} Questions  |  ${item?.test?.totalMarks} Marks`}</Text></View>
        </View>
        <Image source={require('../../assets/goto.png')} className='w-10 h-10' width={10} height={10} />
      </View>
    </Pressable>
  );

  return (
    <View className='pt-5'>
      {dppList?.length === 0 && <Text className='text-white text-2xl self-center items-center' >No Tests available!!</Text>}
      {dppList && <FlatList
        data={dppList}
        renderItem={renderGridItem}
        keyExtractor={(item: any) => item?.test?._id}
        numColumns={1}
      />}
    </View>
  );
};
