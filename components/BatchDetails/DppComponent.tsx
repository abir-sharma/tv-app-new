//L1 Used
import React from 'react';
import { View, Text, Image, FlatList, Pressable } from 'react-native';
import { useGlobalContext } from '../../context/MainContext';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { fromCSS } from '@bacons/css-to-expo-linear-gradient';
import sendGoogleAnalytics from '../../utils/sendGoogleAnalytics';
import { useNavigation } from '@react-navigation/native';
import { Images } from '../../images/images';
import sendMongoAnalytics from '../../utils/sendMongoAnalytics';

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
      navigation.navigate('DppQuiz');
    } catch (err: any) {
      setLogs((logs) => [...logs, "Error in START TEST API:" + JSON.stringify(err?.response)]);
    }
  }

  const renderGridItem = ({ item }: any) => (
    <View
      className='w-[25%] px-2 py-2'
      >
    <Pressable
      className='overflow-hidden rounded-xl border-[1px] border-black bg-[#fbfaef]'
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
          subject_name: selectedSubject?.subject,
        });
        sendMongoAnalytics("dpp_quiz_opened", {
          dppName: item?.test?.name,
          dppId: item?.test?._id,
          batchName: selectedBatch?.name,
          subjectName: selectedSubject?.subject,
          batchId: selectedBatch?._id,
        });
      }}>
        {/* @ts-expect-error */}
        <LinearGradient {...fromCSS(`linear-gradient(179deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.08) 100%)`)}
          className='rounded-xl overflow-hidden'>
      <View style={{padding: 16}}>
        <Text className='text-sm text-black font-semibold'>{item?.test?.name?.length >= 35 ? `${item?.test?.name?.substring(0, 35)}...` : item?.test?.name}</Text>
        <Text className='text-[#757575] font-normal text-xs'>{`${item?.test?.totalQuestions} Questions  |  ${item?.test?.totalMarks} Marks`}</Text>
        {/* @ts-expect-error */}
          <LinearGradient {...fromCSS(`linear-gradient(179deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 100%))`)}
                             className='overflow-hidden rounded-xl flex-row justify-between items-center px-3 py-2 mt-2 border border-b-[4px]'>

            <View className='flex-row justify-center gap-x-2 overflow-hidden rounded-xl w-fit items-center '>
              <Image source={Images.notesVector} className='w-5 h-5 top-1'  width={10} height={10} />
              <Text className=' overflow-hidden rounded-xl text-black'>Quiz</Text>
            </View>
               <Image source={Images.arrowRight} className='w-2 h-2' width={40} height={40} />
          </LinearGradient>        
      </View>
      </LinearGradient>
    </Pressable>
    </View>
  );

  return (
    <View className='p-5'>
      {dppList?.length === 0 && <Text className='text-black text-2xl self-center items-center'>No DPP Quiz Available!</Text>}
      {dppList && <FlatList
        data={dppList}
        renderItem={renderGridItem}
        keyExtractor={(item: any) => item?.test?._id}
        numColumns={4}
      />}
    </View>
  );
};
