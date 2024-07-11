import React, { useEffect, useState } from 'react'
import { View, Text, Image, Pressable, ToastAndroid, ActivityIndicator, ScrollView } from 'react-native'
import { useGlobalContext } from '../context/MainContext';
import axios from 'axios';
import VideoPlayer from '../components/Global/video-player/player';
import { useNavigation } from '@react-navigation/native';

const DppQuizSolution = ({ route }: any) => {
    const navigation = useNavigation();
    const { headers, selectedTestMapping } = useGlobalContext();
    const [solutionData, setSolutionData] = useState<any>();
    const [questionsData, setQuestionsData] = useState<any>();
    const [originalQuestionData, setOriginalQuestionData] = useState<any>();
    const [currentQuestion, setCurrentQuestion] = useState<any>();
    const [correctOptions, setCorrectOptions] = useState<any>();
    const [markedOptions, setMarkedOptions] = useState<any>();
    const [showLoader, setShowLoader] = useState<boolean>(true);
    const [questionType, setQuestionType] = useState<string>('Single');
    const [smallPlayer, setSmallPlayer] = useState(1);

    useEffect(() => {
        fetchSolutionData();
    }, [])

    const fetchSolutionData = async () => {
        setShowLoader(true);
        try {
              const options = {headers}
              const res = await axios.get(`https://api.penpencil.co/v3/test-service/tests/mapping/${selectedTestMapping}/preview-test`, options);
              setQuestionsData(res?.data?.data?.questions);
              setOriginalQuestionData([...res?.data?.data?.questions]);
              setSolutionData(res?.data?.data);
              setCurrentQuestion(res?.data?.data?.questions[0]);
              setCorrectOptions(res?.data?.data?.questions[0]?.question?.solutions);
              setMarkedOptions(res?.data?.data?.questions[0]?.yourResult?.markedSolutions);
              setQuestionType(res?.data?.data?.questions[0]?.question?.type);
              const questions = res?.data?.data?.questions;
              const correct = [];
              const incorrect = [];
              const skipped = [];
              for (let i = 0; i < questions?.length; i++) {
                const question = questions[i];
                if (question?.yourResult?.status === "WRONG") {
                    incorrect?.push(question?.question?.questionNumber);
                } else if (question?.yourResult?.status === "CORRECT") {
                    correct?.push(question?.question?.questionNumber);
                } else {
                    skipped?.push(question?.question?.questionNumber);
              }
            }
          } catch (err: any) {
            console.error("Errow while fetching Solution Data: ", err?.response);
        }
        setShowLoader(false);
    }

    const handleNumberClick = (index: number) => {
        setCurrentQuestion(questionsData[index]);
        setCorrectOptions(questionsData[index]?.question?.solutions);
        setMarkedOptions(questionsData[index]?.yourResult?.markedSolutions);
        setQuestionType(questionsData[index]?.question?.type);

    };

    const handlePreviousClick = () => {
        const curr = questionsData?.indexOf(currentQuestion);
        if (curr > 0) {
            setCurrentQuestion(questionsData[curr - 1]);
            setCorrectOptions(questionsData[curr - 1]?.question?.solutions);
            setMarkedOptions(questionsData[curr - 1]?.yourResult?.markedSolutions);
            setQuestionType(questionsData[curr - 1]?.question?.type);

        } else {
            ToastAndroid.showWithGravity(
                "No Previous Question",
                ToastAndroid.SHORT,
                ToastAndroid.TOP,
            );
            return;
        }
    }
    const getBorderColor = (status:string) => {
        switch (status) {
          case 'WRONG':
            return 'red-500';
          case 'CORRECT':
            return 'green-500';
          case 'UnAttempted':
            return 'gray-400';
          default:
            return 'white';
        }
      };

      const getColoredDot = (status:string) => {
        switch (status) {
          case 'WRONG':
            return <View className='w-2 h-2 rounded-full bg-red-400'></View>;
          case 'CORRECT':
            return <View className='w-2 h-2 rounded-full bg-green-400'></View>;
          case 'UnAttempted':
            return <View className='w-2 h-2 rounded-full bg-gray-400'></View>;
          default:
            return <View className='w-2 h-2 rounded-full bg-white'></View>;
        }
      };

    return (
        <View className='bg-[#111111] h-full p-5'>
            {showLoader && <View
                style={{ position: 'absolute', left: 0, top: 0, zIndex: 10, height: '100%', width: '100%', alignContent: 'center', flex: 1, alignItems: 'center', justifyContent: 'center' }}
                className='bg-white/10 '
            >
                <ActivityIndicator color={"#FFFFFF"} size={80} />
            </View>}
            <View className='flex-row justify-between items-center'>
                <View>
                    <Pressable
                        android_ripple={{
                            color: "rgba(255,255,255,0.5)",
                            borderless: false,
                            radius: 1000,
                            foreground: true
                        }}
                        onPress={() => {
                            navigation.goBack();
                        }}
                        className="overflow-hidden rounded-full p-2"
                    >
                        <View className='flex-row'>
                            <Image source={require('../assets/back.png')} className='w-8 h-8' width={10} height={10} />
                        </View>
                    </Pressable>
                </View>
                <Text className='text-white text-xl font-medium' >{solutionData?.test?.name}</Text>
                <View
                    className='flex-row justify-center opacity-0 overflow-hidden rounded-full items-center p-2'>
                    <Image source={require('../assets/dp.png')} className='w-10 h-10' width={10} height={10} />
                </View>
            </View>

            <View className='flex-1 flex-row w-full rounded-xl mt-5 gap-x-5'>
                <View className='flex-[2] rounded-xl items-start justify-start pl-5 py-0'>
                    <View className='flex-row mt-3 justify-between items-center '>
                        <View className='flex-row flex-1 items-center justify-start gap-x-2'>
                            <View className='w-2 h-2 rounded-full bg-green-400'></View>
                            <Text className='text-white text-sm text-center'>Correct</Text>
                        </View>
                        <View className='flex-row flex-1 items-center justify-start gap-x-2'>
                            <View className='w-2 h-2 rounded-full bg-red-400'></View>
                            <Text className='text-white text-sm text-center'>Incorrect</Text>
                        </View>
                        <View className='flex-row flex-1 items-center justify-start gap-x-2 ml-1'>
                            <View className='w-2 h-2 rounded-full bg-gray-400'></View>
                            <Text className='text-white text-sm text-center'>Skipped</Text>
                        </View>
                    </View>
                    <ScrollView>
                    <View className='flex-row flex-wrap py-4 gap-4 justify-start overflow-scroll'>
                        {
                          questionsData && questionsData.map(
                            (question: any, index: number) => (
                                <Pressable
                                    onPress={() => handleNumberClick(index)}
                                    >
                                    <View
                                      key={index}
                                      className={`w-16 h-16 flex flex-col bg-[#1B2124] rounded-lg items-center justify-center ${
                                      currentQuestion?.question?.questionNumber === question?.question?.questionNumber ? 'bg-[#0569FF]' : ''} ${"border-" + getBorderColor(question?.yourResult.status)} border-[1px]`}
                                    >
                                      <Text className=" text-lg text-white font-medium ">
                                      {question?.question?.questionNumber}
                                      </Text>
                                      {getColoredDot(question?.yourResult.status)}
                                    </View>
                                </Pressable>
                            )
                          )
                        }
                    </View>
                    </ScrollView>
                </View>
                <View className='flex-[4.5]'>
                    <View className='flex-1 bg-[#1B2124] rounded-xl p-5'>
                        <View className='flex flex-row gap-3 mb-4'>
                            <View className='rounded-full overflow-hidden bg-[#12448e] w-10 h-10 flex items-center justify-center'>
                                <Text className='text-white text-xl font-semibold'>
                                    {currentQuestion?.question?.questionNumber}
                                </Text>
                            </View>
                            <View className='bg-white h-[70%] w-[1px] rounded-sm items-center justify-center'></View>
                            <View className='rounded-full overflow-hidden bg-white flex items-center justify-center'>
                                <Text className='text-black text-base px-4 font-semibold'>
                                    Type: {questionType}
                                </Text>
                            </View>
                        </View>
                        <View className='w-full bg-white rounded-lg overflow-hidden items-center justify-center reltaive'>
                            <Image
                                source={{ uri: `${currentQuestion?.question?.imageIds?.en?.baseUrl}${currentQuestion?.question?.imageIds?.en?.key}` }}
                                width={550}
                                height={200}
                                alt='Question'
                                resizeMode='contain'
                                className=' w-full  '
                            />
                        </View>
                        {questionType === 'Numeric' && <View className='gap-y-2 mt-5 w-[100%]'>
                            {
                              currentQuestion?.yourResult?.markedSolutionText && currentQuestion?.yourResult?.markedSolutionText !== '' &&
                              <View className={`bg-white/5 px-5 py-5 rounded-lg flex flex-row justify-between ${currentQuestion?.question?.solutionText === currentQuestion?.yourResult?.markedSolutionText ? 'bg-green-400' : 'bg-red-400'}`}>
                                <Text className='text-white font-bold'> {currentQuestion?.yourResult?.markedSolutionText} </Text>
                                <Text className='text-white font-bold'> {currentQuestion?.question?.solutionText === currentQuestion?.yourResult?.markedSolutionText ? 'Correct Answer (marked by you)' : 'Incorrect Answer (marked by you)'}</Text>
                              </View>
                            }
                            {
                              currentQuestion?.question?.solutionText !== currentQuestion?.yourResult?.markedSolutionText &&
                              <View className={`bg-white/5 px-5 py-5 rounded-lg flex flex-row justify-between bg-green-400`}>
                                <Text className='text-white font-bold'> {currentQuestion?.question?.solutionText} </Text>
                                <Text className='text-white font-bold'> Correct Answer </Text>
                              </View>
                            }
                        </View>}
                        {questionType !== 'Numeric' && <View className='gap-y-2 mt-5 w-[100%]'>
                            {
                              currentQuestion?.question?.options &&
                              <View className={`bg-white/5 px-5 py-5 rounded-lg flex flex-row justify-between ${markedOptions?.includes(currentQuestion?.question?.options[0]?._id) ? correctOptions?.includes(currentQuestion?.question?.options[0]?._id) ? 'bg-green-400' : 'bg-red-400' : correctOptions?.includes(currentQuestion?.question?.options[0]?._id) ? 'bg-green-400' : ''}`}>
                                <Text className='text-white font-bold'> {currentQuestion?.question?.options[0]?.texts?.en} </Text>
                                <Text className='text-white font-bold'>{correctOptions?.includes(currentQuestion?.question?.options[0]?._id) ? 'Correct Answer' : ''} {markedOptions?.includes(currentQuestion?.question?.options[0]?._id) ? !correctOptions?.includes(currentQuestion?.question?.options[0]?._id) ? 'Incorrect (marked by you)' : '(marked by you)' : ''}</Text>
                              </View>}
                            {
                              currentQuestion?.question?.options &&
                              <View className={`bg-white/5 px-5 py-5 rounded-lg flex flex-row justify-between ${markedOptions?.includes(currentQuestion?.question?.options[1]?._id) ? correctOptions?.includes(currentQuestion?.question?.options[1]?._id) ? 'bg-green-400' : 'bg-red-400' : correctOptions?.includes(currentQuestion?.question?.options[1]?._id) ? 'bg-green-400' : ''}`}>
                                <Text className='text-white font-bold'> {currentQuestion?.question?.options[1]?.texts?.en}</Text>
                                <Text className='text-white font-bold'>{correctOptions?.includes(currentQuestion?.question?.options[1]?._id) ? 'Correct Answer' : ''} {markedOptions?.includes(currentQuestion?.question?.options[1]?._id) ? !correctOptions?.includes(currentQuestion?.question?.options[1]?._id) ? 'Incorrect (marked by you)' : '(marked by you)' : ''}</Text>
                              </View>
                            }
                            {
                              currentQuestion?.question?.options &&
                              <View className={`bg-white/5 px-5 py-5 rounded-lg flex flex-row justify-between ${markedOptions?.includes(currentQuestion?.question?.options[2]?._id) ? correctOptions?.includes(currentQuestion?.question?.options[2]?._id) ? 'bg-green-400' : 'bg-red-400' : correctOptions?.includes(currentQuestion?.question?.options[2]?._id) ? 'bg-green-400' : ''}`}>
                                <Text className='text-white font-bold'> {currentQuestion?.question?.options[2]?.texts?.en}</Text>
                                <Text className='text-white font-bold'>{correctOptions?.includes(currentQuestion?.question?.options[2]?._id) ? 'Correct Answer' : ''} {markedOptions?.includes(currentQuestion?.question?.options[2]?._id) ? !correctOptions?.includes(currentQuestion?.question?.options[2]?._id) ? 'Incorrect (marked by you)' : '(marked by you)' : ''}</Text>
                              </View>
                            }
                            {
                              currentQuestion?.question?.options &&
                              <View className={`bg-white/5 px-5 py-5 rounded-lg flex flex-row justify-between ${markedOptions?.includes(currentQuestion?.question?.options[3]?._id) ? correctOptions?.includes(currentQuestion?.question?.options[3]?._id) ? 'bg-green-400' : 'bg-red-400' : correctOptions?.includes(currentQuestion?.question?.options[3]?._id) ? 'bg-green-400' : ''}`}>
                                <Text className='text-white font-bold'> {currentQuestion?.question?.options[3]?.texts?.en}</Text>
                                <Text className='text-white font-bold'>{correctOptions?.includes(currentQuestion?.question?.options[3]?._id) ? 'Correct Answer' : ''} {markedOptions?.includes(currentQuestion?.question?.options[3]?._id) ? !correctOptions?.includes(currentQuestion?.question?.options[3]?._id) ? 'Incorrect (marked by you)' : '(marked by you)' : ''}</Text>
                              </View>
                            }
                        </View>}
                    </View>
                </View>
                <View className='flex-[4.5]  w-80 h-80 items-start justify-between'>
                    <View className='w-full flex flex-row items-center justify-between mb-5'>
                    <Text className='text-white text-2xl font-medium'> Solution</Text>
                    </View>
                    {
                      currentQuestion && smallPlayer &&
                      <View className=' w-full h-[100%] rounded-lg overflow-hidden'>
                          <VideoPlayer smallPlayer={smallPlayer} setSmallPlayer={setSmallPlayer} lectureDetails={currentQuestion?.question?.solutionDescription[0]?.videoDetails} scheduleDetails={{lectureDetails: currentQuestion?.question?.solutionDescription[0]?.videoDetails}} isLive={false}/>
                      </View>
                    }

                </View>
            </View>
            {
              currentQuestion && !smallPlayer &&
              <View className='w-screen h-[100%] absolute top-0 left-0 z-50 rounded-lg overflow-hidden'>
                  <VideoPlayer smallPlayer={smallPlayer} setSmallPlayer={setSmallPlayer} lectureDetails={currentQuestion?.question?.solutionDescription[0]?.videoDetails} scheduleDetails={{lectureDetails: currentQuestion?.question?.solutionDescription[0]?.videoDetails}} isLive={false}/>
              </View>
            }
        </View>
    )
}

export default DppQuizSolution
