import axios from "axios";
import { useGlobalContext } from "../context/MainContext"
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, TouchableHighlight, Text, View, BackHandler } from "react-native";
import { useNavigation } from "@react-navigation/native";
import sendGoogleAnalytics from "../utils/sendGoogleAnalytics";
import { Images } from "../images/images";

export const DppQuizResult = () => {
  const { testData, headers, selectedBatch, fetchDetailTrigger, setTestData, setTestSections, setSelectedTestMapping, selectedDpp } = useGlobalContext();
  const [result, setResult] = useState<any>(null);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const navigation = useNavigation<any>();

  const fetchResult = async () => {
    try {
      setShowLoader(true);
      const testId = testData?.test?._id;
      const batchId = selectedBatch?._id;
      const options = {
        headers
      }
      const res = await axios.get(`https://api.penpencil.co/v3/test-service/tests/${testId}/my-result?batchId=${batchId}&batchScheduleId`, options);
      const data = res?.data?.data;
      
      setResult(data);
      sendGoogleAnalytics("dpp_quiz_submitted", {
        test_name: testData?.test?.name,
        test_id: testData?.test?._id,
        batch_name: selectedBatch?.name,
        subject_name: selectedBatch?.name,
        correct_questions: data?.yourPerformance?.correctQuestions,
        incorrect_questions: data?.yourPerformance?.inCorrectQuestions,
        skipped_questions: data?.yourPerformance?.unAttemptedQuestions,
        accuracy: data?.yourPerformance?.accuracy,
    });

    } catch (err: any) {
      console.error("Error while fetching test result data: ", err?.resposne);
    }
    setShowLoader(false);
  }

  const restartQuiz = async () => {
    try {
      const options = {
        headers
      };
      const item = selectedDpp;
      
      const res = await axios.get(`https://api.penpencil.co/v3/test-service/tests/${item?.test?._id}/start-test?testId=${item?.test?._id}&testSource=BATCH_QUIZ&type=Reattempt&batchId=${selectedBatch?._id}&batchScheduleId=${item?.scheduleId}`, options);
      
      setTestData(res?.data?.data);
      setTestSections(res?.data?.data?.sections);
      setSelectedTestMapping(res?.data?.data?.testStudentMapping?._id);
      navigation.navigate('DppQuiz');
    } catch (err: any) {
      console.error("Error while restarting Quiz: ", err?.response);
    }
  }

  const formatTime = (seconds: any) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  useEffect(() => {
    fetchResult();
    const backAction = () => {
      navigation.navigate('BatchDetails');
      fetchDetailTrigger();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  return (
    <View className="bg-[#111111] h-full">
      {showLoader && <View
        style={{ position: 'absolute', left: 0, top: 0, zIndex: 10, height: '100%', width: '100%', alignContent: 'center', flex: 1, alignItems: 'center', justifyContent: 'center' }}
        className='bg-white/10 '
      >
        <ActivityIndicator color={"#FFFFFF"} size={80} />
      </View>}

      <View className='flex-row justify-between items-center p-8 pb-0'>
        <View>
          <TouchableHighlight  
            onPress={() => {
              navigation.navigate('BatchDetails');
              fetchDetailTrigger();
            }}
            className="overflow-hidden rounded-full p-2"
          >
            <View className='flex-row'>
              <Image source={Images.back} className='w-8 h-8' width={10} height={10} />
            </View>
          </TouchableHighlight>
        </View>
        <View
          className='flex-row opacity-0 justify-center overflow-hidden rounded-full items-center p-2'>
          <Image source={Images.dp} className='w-10 h-10' width={10} height={10} />
        </View>
      </View>
      <View className="bg-white/5 p-12 py-8 my-12 w-[80%] self-center rounded-xl">
        <View>
          <Text className="text-xl text-white text-center font-extrabold">
            {testData?.test?.name}
          </Text>
        </View>
        <View className="flex flex-row items-center my-8">
          <View className="flex flex-row justify-center items-center w-[33%]">
            <Image
              source={Images.correct}
              width={50}
              height={50}
              className="mr-2"
            />
            <View className="flex flex-col justify-between gap-1">
              <Text className="text-[#ECECEC] text-xs">Correct</Text>
              <Text className="text-white text-base font-bold">{result?.yourPerformance?.correctQuestions}</Text>
            </View>
          </View>
          <View className="flex flex-row items-center w-[33%] justify-center border-l border-r border-[#525252]">
            <Image
              source={Images.incorrect}
              width={50}
              height={50}
              className="mr-2"
            />
            <View className="flex flex-col justify-between gap-1">
              <Text className="text-[#ECECEC] text-xs">Incorrect</Text>
              <Text className="text-white text-base font-bold">{result?.yourPerformance?.inCorrectQuestions}</Text>
            </View>
          </View>
          <View className="flex flex-row items-center  w-[33%] justify-center">
            <Image
              source={Images.skipped}
              width={50}
              height={50}
              className="mr-2"
            />
            <View className="flex flex-col justify-between gap-1">
              <Text className="text-[#ECECEC] text-xs">Skipped</Text>
              <Text className="text-white text-base font-bold">{result?.yourPerformance?.unAttemptedQuestions}</Text>
            </View>
          </View>
        </View>
        <View className="py-[0.5px] bg-[#525252]"></View>
        <View className="flex flex-row justify-around items-center my-8">
          <View className="flex flex-row items-center  w-[33%] justify-center">
            <Image
              source={Images.accuracy}
              width={50}
              height={50}
              className="mr-2"
            />
            <View className="flex flex-col justify-between gap-1">
              <Text className="text-[#ECECEC] text-xs">Accuracy</Text>
              <Text className="text-white text-base font-bold">{result?.yourPerformance?.accuracy}%</Text>
            </View>
          </View>
          <View className="flex flex-row items-center  w-[33%] justify-center border-l border-r border-[#525252]">
            <Image
              source={Images.completed}
              width={50}
              height={50}
              className="mr-2"
            />
            <View className="flex flex-col justify-between gap-1">
              <Text className="text-[#ECECEC] text-xs">Completed</Text>
              <Text className="text-white text-base font-bold">{result?.yourPerformance?.completed}%</Text>
            </View>
          </View>
          <View className="flex flex-row items-center  w-[33%] justify-center">
            <Image
              source={Images.time}
              width={50}
              height={50}
              className="mr-2"
            />
            <View className="flex flex-col justify-between gap-1">
              <Text className="text-[#ECECEC] text-xs">Time-Taken</Text>
              <Text className="text-white text-base font-bold">{formatTime(result?.yourPerformance?.timeTaken)}</Text>
            </View>
          </View>
        </View>
      </View>
      <View className="flex flex-row justify-between px-20 mt-10">
        <TouchableHighlight
          
          className="overflow-hidden py-2 px-16 self-center bg-[#0569FF] rounded-lg"
          onPress={() => restartQuiz()}
        >
          <Text className="text-white text-lg font-bold ">
            Re-Attempt
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          
          className="overflow-hidden py-2 px-16 self-center  bg-[#0569FF] rounded-lg"
          onPress={() => navigation.navigate('DppQuizSolution')}
        >
          <Text className="text-white text-lg font-bold">
            View Solution
          </Text>
        </TouchableHighlight>
      </View>
    </View>
  )

}