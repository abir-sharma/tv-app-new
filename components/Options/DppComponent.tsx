import React, { Dispatch, SetStateAction } from 'react';
import { View, Text, Image, FlatList, Pressable } from 'react-native';
import { NoteType } from '../../types/types';
import { useGlobalContext } from '../../context/MainContext';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { fromCSS } from '@bacons/css-to-expo-linear-gradient';
import sendGoogleAnalytics from '../../hooks/sendGoogleAnalytics';
import { useNavigation } from '@react-navigation/native';

type DPPPropType = {
  noteList: NoteType[] | null,
  setNoteList: Dispatch<SetStateAction<NoteType[] | null>>,
  loadMore: boolean,
  getPaidBatches: any
}

export const DppComponent = ({ }: DPPPropType) => {
  const navigation = useNavigation();
  const { setLogs, setTestData, dppList, setSelectedTestMapping, setTestSections, setSelectedDpp, headers, selectedBatch, selectedSubject } = useGlobalContext();

  const handleDppClick = async (item: any) => {
    setSelectedDpp(item);
    try {
      const options = {
        headers
      }
      const res = await axios.get(`https://api.penpencil.co/v3/test-service/tests/${item?.test?._id}/start-test?testId=${item?.test?._id}&testSource=BATCH_QUIZ&type=${item?.tag}&batchId=${selectedBatch?._id}&batchScheduleId=${item?.scheduleId}`, options);
      setTestData(res?.data?.data);
      setTestSections(res?.data?.data?.sections)
      setSelectedTestMapping(res?.data?.data?.testStudentMapping?._id);
      // @ts-expect-error
      navigation.navigate('Tests');
    } catch (err: any) {
      setLogs((logs) => [...logs, "Error in START TEST API:" + JSON.stringify(err?.response)]);
    }
  }

  const renderGridItem = ({ item }: any) => (
    <Pressable
      style={{ flex: 1 / 2 }}
      className=' my-1 mr-5 overflow-hidden h-24 rounded-xl bg-[#111111] border-[1px] border-white/30'
      android_ripple={{
        color: "rgba(255,255,255,0.4)",
        borderless: false,
        radius: 1000,
        foreground: true
      }}
      hasTVPreferredFocus
      onPress={() => { 
        handleDppClick(item)
        sendGoogleAnalytics("dpp_quiz_opened", {
          dpp_name: item?.test?.name,
          dpp_id: item?.test?._id,
          batch_name: selectedBatch?.name,
          subject_name: selectedBatch?.name,
        });
      }}>
        <LinearGradient {...fromCSS(`linear-gradient(179deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.08) 100%)`)}
          className='rounded-xl overflow-hidden'>
      <View className='w-full h-full flex-row justify-between items-center px-5'>
        <View>
          <Text className='text-white font-medium text-lg'>{item?.test?.name?.length >= 35 ? `${item?.test?.name?.substring(0, 35)}...` : item?.test?.name}</Text>
          <View className='flex-row mt-2'><Image source={require('../../assets/noteIcon.png')} className='w-5 h-5 mr-2' width={10} height={10} /><Text className='text-white font-normal text-sm'>{`${item?.test?.totalQuestions} Questions  |  ${item?.test?.totalMarks} Marks`}</Text></View>
        </View>
        <Image source={require('../../assets/goto.png')} className='w-7 h-7' width={40} height={40} />
      </View>
      </LinearGradient>
    </Pressable>
  );

  return (
    <View className='p-5'>
      {dppList?.length === 0 && <Text className='text-white text-2xl self-center items-center'>No DPP Quiz Available!</Text>}
      {dppList && <FlatList
        data={dppList}
        renderItem={renderGridItem}
        keyExtractor={(item: any) => item?.test?._id}
        numColumns={2}
      />}
    </View>
  );
};
