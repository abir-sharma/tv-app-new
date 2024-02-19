import React, { useEffect, useState } from 'react'
import { View, Text, Image, Pressable, ScrollView, ToastAndroid, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useGlobalContext } from '../context/MainContext';
import { useNavigation } from '@react-navigation/native';
import axios, { all } from 'axios';
import { ResizeMode, Video } from 'expo-av';
import { cookieSplitter } from '../components/video-player/cookie-splitter';

const TestSolutions = ({ route }: any) => {

    const { headers, selectedTestMapping, mainNavigation } = useGlobalContext();
    const [solutionData, setSolutionData] = useState<any>();
    const [originalSolutionData, setOriginalSolutionData] = useState<any>();
    const [questionsData, setQuestionsData] = useState<any>();
    const [originalQuestionData, setOriginalQuestionData] = useState<any>();
    const [currentQuestion, setCurrentQuestion] = useState<any>();
    const [correctAnswers, setCorrectAnswers] = useState<any>();
    const [incorrectAnswers, setIncorrectAnswers] = useState<any>();
    const [skippedAnswers, setSkippedAnswers] = useState<any>();
    const [correctOptions, setCorrectOptions] = useState<any>();
    const [markedOptions, setMarkedOptions] = useState<any>();
    const [renderVideo, setRenderVideo] = useState<boolean>(false);

    const [cookieParams, setCookieParams] = useState<any>(undefined);
    const [selectedFilter, setSelectedFilter] = useState<any>('all');
    const [showLoader, setShowLoader] = useState<boolean>(true);
    const [questionType, setQuestionType] = useState<string>('Single');



    useEffect(() => {
        fetchSolutionData();
    }, [])

    const fetchSolutionData = async () => {
        setShowLoader(true);
        try {
            const options = {
                headers
            }
            const res = await axios.get(`https://api.penpencil.co/v3/test-service/tests/mapping/${selectedTestMapping}/preview-test`, options);
            console.log("Test Solution Data: ", res?.data?.data?.questions)
            console.log("DING DING");
            // console.log("DING DING", res.data.data.questions[0].solutionDescription[0].videoDetails.videoUrl);
            // sendAnalyticsData(res.data.data.questions[0].solutionDescription[0].videoDetails.videoUrl)
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
            console.log("Errow while fetching Solution Data: ", err?.response);
        }
        setShowLoader(false);

    }

    const handleFilter = (filter: string) => {
        const allData = [...originalQuestionData];
        if (filter === 'all') {
            setQuestionsData(allData)
            if (allData?.length > 0) {
                setCurrentQuestion(allData[0]);
                setCorrectOptions(allData[0]?.question?.solutions);
                setMarkedOptions(allData[0]?.yourResult?.markedSolutions);
            }
        } else if (filter === 'correct') {
            const data = allData?.filter((question: any) => question?.yourResult?.status === "CORRECT")
            setQuestionsData(data)
            if (data?.length > 0) {
                setCurrentQuestion(data[0]);
                setCorrectOptions(data[0]?.question?.solutions);
                setMarkedOptions(data[0]?.yourResult?.markedSolutions);
            }
        } else if (filter === 'incorrect') {
            const data = allData?.filter((question: any) => question?.yourResult?.status === "WRONG")
            setQuestionsData(data);
            if (data?.length > 0) {
                setCurrentQuestion(data[0]);
                setCorrectOptions(data[0]?.question?.solutions);
                setMarkedOptions(data[0]?.yourResult?.markedSolutions);
            }
        } else {
            const data = allData?.filter((question: any) => question?.yourResult?.status === "UnAttempted")
            setQuestionsData(data);
            if (data?.length > 0) {
                setCurrentQuestion(data[0]);
                setCorrectOptions(data[0]?.question?.solutions);
                setMarkedOptions(data[0]?.yourResult?.markedSolutions);
            }
        }
    }

    async function sendAnalyticsData(uri: string) {
        console.log("Inside send analytics: ", uri)
        const newHeaders = {
            'Content-Type': 'application/json',
            Authorization: headers.Authorization,
            'Client-Type': 'WEB',
        };
        const data = {
            url: uri,
        };
        console.log('uri --->', uri);
        axios.post("https://api.penpencil.co/v3/files/send-analytics-data", data, { headers: newHeaders })
            .then((response) => {
                setCookieParams(cookieSplitter(response?.data?.data));
                setRenderVideo(true);
            })
            .catch((error) => {
                console.error('analytics failed --->', error?.response?.data);
            });
    }


    const handleNextClick = () => {
        const curr = questionsData.indexOf(currentQuestion);
        if (curr < questionsData?.length - 1) {
            setCurrentQuestion(questionsData[curr + 1]);
            setCorrectOptions(questionsData[curr + 1]?.question?.solutions);
            setMarkedOptions(questionsData[curr + 1]?.yourResult?.markedSolutions);
            setQuestionType(questionsData[curr + 1]?.question?.type);
        } else {
            ToastAndroid.showWithGravity(
                "No next Question!!",
                ToastAndroid.SHORT,
                ToastAndroid.TOP,
            );
            return;
        }
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


    return (
        <View className='bg-[#1A1A1A] min-h-screen p-5'>
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
                            mainNavigation.navigate('Home')
                        }}
                        className="overflow-hidden rounded-full p-2"
                    >
                        <View className='flex-row'>
                            <Image source={require('../assets/back.png')} className='w-8 h-8' width={10} height={10} />
                        </View>
                    </Pressable>
                </View>
                <Text className='text-white text-xl font-medium' >{solutionData?.test?.name}</Text>
                <Pressable
                    android_ripple={{
                        color: "rgba(255,255,255,0.5)",
                        borderless: false,
                        radius: 1000,
                        foreground: true
                    }}
                    className='flex-row justify-center overflow-hidden rounded-full items-center p-2'>
                    <Image source={require('../assets/dp.png')} className='w-10 h-10' width={10} height={10} />
                    {/* <Text className='bg-white/10 overflow-hidden rounded-xm text-white px-5 py-3'>Logout</Text> */}
                </Pressable>
            </View>

            <View className='flex-1 flex-row w-full rounded-xl mt-5 gap-x-5'>
                <View className='flex-[2] rounded-xl items-start justify-start px-5 py-0'>
                    <Text className='text-white text-sm ml-auto text-center'>Video solution for Question {currentQuestion?.question?.questionNumber}</Text>
                    <View className='h-52 bg-gray-600 rounded-lg w-full mt-1'>
                    </View>
                    <View className='flex-row mt-3 gap-x-2'>
                        <Pressable
                            hasTVPreferredFocus={true}
                            android_ripple={{
                                color: "rgba(255,255,255,0.5)",
                                borderless: false,
                                radius: 1000,
                                foreground: true
                            }}
                            onPress={() => { setSelectedFilter('all'); handleFilter('all'); }}
                            className={`overflow-hidden ${selectedFilter === 'all' ? 'bg-[#DEDAFF]' : ''} px-5 py-1 text-center flex-1 rounded`}
                        >
                            <Text className={`overflow-hidden ${selectedFilter === 'all' ? 'text-[#5A4BDA]' : 'text-white'} text-base`}>All</Text>
                        </Pressable>
                        <Pressable
                            hasTVPreferredFocus={true}
                            android_ripple={{
                                color: "rgba(255,255,255,0.5)",
                                borderless: false,
                                radius: 1000,
                                foreground: true
                            }}
                            onPress={() => { setSelectedFilter('incorrect'); handleFilter('incorrect') }}
                            className={`overflow-hidden ${selectedFilter === 'incorrect' ? 'bg-[#DEDAFF]' : ''} px-5 py-1 text-center flex-1 rounded`}
                        >
                            <Text className={`overflow-hidden ${selectedFilter === 'incorrect' ? 'text-[#5A4BDA]' : 'text-white'} text-base`}>Incorrect</Text>
                        </Pressable>
                        <Pressable
                            hasTVPreferredFocus={true}
                            android_ripple={{
                                color: "rgba(255,255,255,0.5)",
                                borderless: false,
                                radius: 1000,
                                foreground: true
                            }}
                            onPress={() => { setSelectedFilter('correct'); handleFilter('correct') }}
                            className={`overflow-hidden ${selectedFilter === 'correct' ? 'bg-[#DEDAFF]' : ''} px-5 py-1 text-center flex-1 rounded`}
                        >
                            <Text className={`overflow-hidden ${selectedFilter === 'correct' ? 'text-[#5A4BDA]' : 'text-white'} text-base`}>Correct</Text>
                        </Pressable>
                        <Pressable
                            hasTVPreferredFocus={true}
                            android_ripple={{
                                color: "rgba(255,255,255,0.5)",
                                borderless: false,
                                radius: 1000,
                                foreground: true
                            }}
                            onPress={() => { setSelectedFilter('skipped'); handleFilter('skipped') }}
                            className={`overflow-hidden ${selectedFilter === 'skipped' ? 'bg-[#DEDAFF]' : ''} px-5 py-1 text-center flex-1 rounded`}
                        >
                            <Text className={`overflow-hidden ${selectedFilter === 'skipped' ? 'text-[#5A4BDA]' : 'text-white'} text-base`}>Skipped</Text>
                        </Pressable>
                    </View>
                    <View className='flex-row flex-wrap py-4 gap-2 overflow-scroll'>
                        {
                            questionsData && questionsData.map(
                                (question: any, index: number) => (
                                    <View key={index} className={`w-16 h-16 bg-white/10 rounded items-center justify-center ${currentQuestion?.question?.questionNumber === question?.question?.questionNumber ? 'bg-[#8E89BA]' : ''}`}>
                                        <Text className=' text-lg text-white font-medium '>{question?.question?.questionNumber}</Text>
                                    </View>
                                )
                            )
                        }
                    </View>
                    <View className='flex-row mt-3 justify-between items-center '>
                        <View className='flex-row flex-1 items-center justify-start gap-x-2'>
                            <View className='w-2 h-2 rounded-full bg-green-400'></View>
                            <Text className='text-white text-base text-center'>Correct</Text>
                        </View>
                        <View className='flex-row flex-1 items-center justify-start gap-x-2'>
                            <View className='w-2 h-2 rounded-full bg-red-400'></View>
                            <Text className='text-white text-base text-center'>Incorrect</Text>
                        </View>
                        <View className='flex-row flex-1 items-center justify-start gap-x-2'>
                            <View className='w-2 h-2 rounded-full bg-gray-400'></View>
                            <Text className='text-white text-base text-center'>Skipped</Text>
                        </View>
                    </View>
                    <View className=' flex-row justify-between items-center mt-5 w-full'>
                        <Pressable
                            hasTVPreferredFocus={true}
                            android_ripple={{
                                color: "rgba(255,255,255,0.5)",
                                borderless: false,
                                radius: 1000,
                                foreground: true
                            }}
                            onPress={() => handlePreviousClick()}
                            className='bg-[#A79EEB] rounded-xl w-40 text-center items-center py-2 overflow-hidden'
                        >
                            <Text className='text-white text-lg'>Previous</Text>
                        </Pressable>
                        <Pressable
                            hasTVPreferredFocus={true}
                            android_ripple={{
                                color: "rgba(255,255,255,0.5)",
                                borderless: false,
                                radius: 1000,
                                foreground: true
                            }}
                            onPress={() => handleNextClick()}
                            className='bg-[#A79EEB] rounded-xl w-40 text-center items-center py-2 overflow-hidden'
                        >
                            <Text className='text-white text-lg'>Next</Text>
                        </Pressable>
                    </View>
                </View>
                <View className='flex-[3] h-[550]'>
                    <View className='flex-1 bg-white/5 rounded-xl p-5'>
                        <View className='h-[220] bg-white/5 w-full rounded-lg items-center justify-center'>
                            <Image
                                source={{ uri: `${currentQuestion?.question?.imageIds?.en?.baseUrl}${currentQuestion?.question?.imageIds?.en?.key}` }}
                                width={600}
                                height={220}
                                resizeMode='contain'
                                alt='Question'
                            />
                        </View>
                        {questionType === 'Numeric' && <View className='gap-y-2 mt-5 w-[60%]'>
                            {currentQuestion?.yourResult?.markedSolutionText && currentQuestion?.yourResult?.markedSolutionText !== '' && <View className={`bg-white/5 px-5 py-5 rounded-lg flex flex-row justify-between ${currentQuestion?.question?.solutionText === currentQuestion?.yourResult?.markedSolutionText ? 'bg-green-400' : 'bg-red-400'}`}>
                                <Text className='text-white font-bold'> {currentQuestion?.yourResult?.markedSolutionText} </Text>
                                <Text className='text-white font-bold'> {currentQuestion?.question?.solutionText === currentQuestion?.yourResult?.markedSolutionText ? 'Correct Answer (marked by you)' : 'Incorrect Answer (marked by you)'}</Text>
                            </View>}
                            {currentQuestion?.question?.solutionText !== currentQuestion?.yourResult?.markedSolutionText && <View className={`bg-white/5 px-5 py-5 rounded-lg flex flex-row justify-between bg-green-400`}>
                                <Text className='text-white font-bold'> {currentQuestion?.question?.solutionText} </Text>
                                <Text className='text-white font-bold'> Correct Answer </Text>
                            </View>}
                        </View>}
                        {questionType !== 'Numeric' && <View className='gap-y-2 mt-5 w-[60%]'>
                            {currentQuestion?.question?.options && <View className={`bg-white/5 px-5 py-5 rounded-lg flex flex-row justify-between ${markedOptions?.includes(currentQuestion?.question?.options[0]?._id) ? correctOptions?.includes(currentQuestion?.question?.options[0]?._id) ? 'bg-green-400' : 'bg-red-400' : correctOptions?.includes(currentQuestion?.question?.options[0]?._id) ? 'bg-green-400' : ''}`}>
                                <Text className='text-white font-bold'> {currentQuestion?.question?.options[0]?.texts?.en} </Text>
                                <Text className='text-white font-bold'>{correctOptions?.includes(currentQuestion?.question?.options[0]?._id) ? 'Correct Answer' : ''} {markedOptions?.includes(currentQuestion?.question?.options[0]?._id) ? !correctOptions?.includes(currentQuestion?.question?.options[0]?._id) ? 'Incorrect (marked by you)' : '(marked by you)' : ''}</Text>
                            </View>}
                            {currentQuestion?.question?.options && <View className={`bg-white/5 px-5 py-5 rounded-lg flex flex-row justify-between ${markedOptions?.includes(currentQuestion?.question?.options[1]?._id) ? correctOptions?.includes(currentQuestion?.question?.options[1]?._id) ? 'bg-green-400' : 'bg-red-400' : correctOptions?.includes(currentQuestion?.question?.options[1]?._id) ? 'bg-green-400' : ''}`}>
                                <Text className='text-white font-bold'> {currentQuestion?.question?.options[1]?.texts?.en}</Text>
                                <Text className='text-white font-bold'>{correctOptions?.includes(currentQuestion?.question?.options[1]?._id) ? 'Correct Answer' : ''} {markedOptions?.includes(currentQuestion?.question?.options[1]?._id) ? !correctOptions?.includes(currentQuestion?.question?.options[1]?._id) ? 'Incorrect (marked by you)' : '(marked by you)' : ''}</Text>
                            </View>}
                            {currentQuestion?.question?.options && <View className={`bg-white/5 px-5 py-5 rounded-lg flex flex-row justify-between ${markedOptions?.includes(currentQuestion?.question?.options[2]?._id) ? correctOptions?.includes(currentQuestion?.question?.options[2]?._id) ? 'bg-green-400' : 'bg-red-400' : correctOptions?.includes(currentQuestion?.question?.options[2]?._id) ? 'bg-green-400' : ''}`}>
                                <Text className='text-white font-bold'> {currentQuestion?.question?.options[2]?.texts?.en}</Text>
                                <Text className='text-white font-bold'>{correctOptions?.includes(currentQuestion?.question?.options[2]?._id) ? 'Correct Answer' : ''} {markedOptions?.includes(currentQuestion?.question?.options[2]?._id) ? !correctOptions?.includes(currentQuestion?.question?.options[2]?._id) ? 'Incorrect (marked by you)' : '(marked by you)' : ''}</Text>
                            </View>}
                            {currentQuestion?.question?.options && <View className={`bg-white/5 px-5 py-5 rounded-lg flex flex-row justify-between ${markedOptions?.includes(currentQuestion?.question?.options[3]?._id) ? correctOptions?.includes(currentQuestion?.question?.options[3]?._id) ? 'bg-green-400' : 'bg-red-400' : correctOptions?.includes(currentQuestion?.question?.options[3]?._id) ? 'bg-green-400' : ''}`}>
                                <Text className='text-white font-bold'> {currentQuestion?.question?.options[3]?.texts?.en}</Text>
                                <Text className='text-white font-bold'>{correctOptions?.includes(currentQuestion?.question?.options[3]?._id) ? 'Correct Answer' : ''} {markedOptions?.includes(currentQuestion?.question?.options[3]?._id) ? !correctOptions?.includes(currentQuestion?.question?.options[3]?._id) ? 'Incorrect (marked by you)' : '(marked by you)' : ''}</Text>
                            </View>}

                        </View>}
                    </View>
                </View>


            </View>
        </View>
    )
}

export default TestSolutions
