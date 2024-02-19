import React, { useEffect, useRef, useState } from 'react'
import { View, Text, Image, Pressable, ToastAndroid, ActivityIndicator, TextInput } from 'react-native'
import { useGlobalContext } from '../context/MainContext'
import axios from 'axios';
import { ReviewOrSubmitModal } from '../components/modals/ReviewOrSubmit';

const Tests = ({ navigation, route }: any) => {
    const { testData, testSections, selectedBatch, headers, selectedTestMapping } = useGlobalContext();
    const [maxTries, setMaxTries] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState<number>(0);
    const [currentQuestion, setCurrentQuestion] = useState<any>();
    const [responses, setResponses] = useState<any>(0);
    const [selectedAnswers, setSelectedAnswers] = useState<any>([]);
    const [correctOptions, setCorrectOptions] = useState<any>();
    const [markedOptions, setMarkedOptions] = useState<any>([]);
    const [questionType, setQuestionType] = useState<any>("Single");
    const [showModal, setShowModal] = useState<boolean>(false);
    const [seconds, setSeconds] = useState(0);
    const [lastTimeStamp, setLastTimeStamp] = useState(0);
    const [showLoader, setShowLoader] = useState<boolean>(true);
    const [inputInteger, setInputInteger] = useState<any>(null);

    useEffect(() => {
        if (testData && testData?.sections && testData?.sections[0]?.questions) {
            const len = testData?.sections[0]?.questions?.length;
            setTotalQuestions(testData?.sections[0]?.questions?.length);
            setCurrentQuestion(testData?.sections[0]?.questions[0]);
            setCorrectOptions(testData?.sections[0]?.questions[0]?.solutions);
            setMaxTries(testData?.sections[0]?.questions[0]?.solutions?.length);
            setQuestionType(testData?.sections[0]?.questions[0]?.type);
            const response = [];
            for (let i = 0; i < len; i++) {
                const obj = {
                    "markedSolutions": [],
                    "markedSolutionText": "",
                    "status": "UnAttempted",
                    "isBookmarked": false,
                    "timeTaken": 0,
                    "questionId": testData?.sections[0]?.questions[i]?._id,
                    "notes": ""
                }
                response?.push(obj);
            }
            setResponses(response);
            setShowLoader(false);
        }
    }, [testData])

    useEffect(() => {
        let interval = setInterval(() => {
            setSeconds((prevSeconds) => prevSeconds + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setMarkedOptions([]);
        setSelectedAnswers([]);
        setSeconds(0);
    }, []);

    const handleOptionClick = async (option: any) => {
        const questionType = currentQuestion?.type;
        const curr = currentQuestion?.questionNumber - 1;
        const id = currentQuestion?._id;
        if (questionType === "Single") {
            if (selectedAnswers?.length > 0) {
                return;
            } else {
                setSelectedAnswers([option]);
                setMarkedOptions([option]);
                const timeDiff = seconds - lastTimeStamp;
                const obj = {
                    "markedSolutions": [option],
                    "status": [option]?.length > 0 ? "Attempted" : "UnAttempted",
                    "timeTaken": responses[curr]?.timeTaken + timeDiff,
                    "questionId": currentQuestion?._id,
                    "markedSolutionText": "",
                    "isBookmarked": false,
                    "notes": ""
                }
                setLastTimeStamp(seconds);
                const newResponses = responses;
                newResponses[curr] = obj;
                setResponses(newResponses);
                console.log("Final Responses: ", newResponses)
            }
        } else if (questionType === "Multiple") {
            if (selectedAnswers?.includes(option)) {
                return;
            } else {
                setSelectedAnswers([...selectedAnswers, option]?.sort());
                setMarkedOptions([...selectedAnswers, option]?.sort());
                const timeDiff = seconds - lastTimeStamp;
                const obj = {
                    "markedSolutions": [...selectedAnswers, option]?.sort(),
                    "status": [...selectedAnswers, option]?.sort()?.length > 0 ? "Attempted" : "UnAttempted",
                    "timeTaken": responses[curr]?.timeTaken + timeDiff,
                    "questionId": currentQuestion?._id,
                    "markedSolutionText": "",
                    "isBookmarked": false,
                    "notes": ""
                }
                setLastTimeStamp(seconds);
                const newResponses = responses;
                newResponses[curr] = obj;
                setResponses(newResponses);
                console.log("Final Responses: ", newResponses);
            }
        } else if (questionType === "Numeric") {
            if (selectedAnswers?.length > 0) {
                return;
            } else {
                setSelectedAnswers([]);
                const timeDiff = seconds - lastTimeStamp;
                const obj = {
                    "markedSolutions": [],
                    "status": "Attempted",
                    "timeTaken": responses[curr]?.timeTaken + timeDiff,
                    "questionId": currentQuestion?._id,
                    "markedSolutionText": inputInteger,
                    "isBookmarked": false,
                    "notes": ""
                }
                setLastTimeStamp(seconds);
                const newResponses = responses;
                newResponses[curr] = obj;
                setResponses(newResponses);
                console.log("Final Responses: ", newResponses);
                ToastAndroid.showWithGravity(
                    "Submitted integer value!!",
                    ToastAndroid.SHORT,
                    ToastAndroid.TOP,
                );
            }
        }
    }


    const handleSubmitTest = async () => {
        try {
            const curr = currentQuestion?.questionNumber - 1;
            const timeDiff = seconds - lastTimeStamp;
            let obj;
            if (questionType === 'Numeric') {
                obj = {
                    "markedSolutions": [],
                    "status": inputInteger ? "Attempted" : "UnAttempted",
                    "timeTaken": responses[curr]?.timeTaken + timeDiff,
                    "questionId": currentQuestion?._id,
                    "markedSolutionText": inputInteger,
                    "isBookmarked": false,
                    "notes": ""
                }
            } else {
                obj = {
                    "markedSolutions": selectedAnswers,
                    "status": selectedAnswers?.length > 0 ? "Attempted" : "UnAttempted",
                    "timeTaken": responses[curr]?.timeTaken + timeDiff,
                    "questionId": currentQuestion?._id,
                    "markedSolutionText": "",
                    "isBookmarked": false,
                    "notes": ""
                }
            }
            setLastTimeStamp(seconds);
            const newResponses = responses;
            newResponses[curr] = obj;
            setResponses(newResponses);
            const options = {
                headers
            }
            const body = {
                "questionsResponses": newResponses,
                "lastVisitedQuestionId": currentQuestion?._id,
                "type": "Submit",
                "submittedBy": "user",
                "batchId": selectedBatch?.batch?._id,
            }
            console.log("Submit Test Body: ", body);
            console.log(options);
            console.log("Mapping Id: ", selectedTestMapping);
            console.log("Batch Id: ", selectedBatch);
            console.log(`https://api.penpencil.co/v3/test-service/tests/mapping/${selectedTestMapping}/submit-test`);
            const res = await axios.post(`https://api.penpencil.co/v3/test-service/tests/mapping/${selectedTestMapping}/submit-test`, body, options);
            console.log("Submit Test Response: ", res?.data);
            setShowModal(false);
            navigation.navigate('TestResult')

        } catch (err) {
            console.log("Error while submitting test!!", err);
        }
    }

    const handleNextClick = async () => {
        const curr = currentQuestion?.questionNumber - 1;
        if (curr < totalQuestions - 1) {
            const timeDiff = seconds - lastTimeStamp;
            let obj;
            if (questionType === 'Numeric') {
                obj = {
                    "markedSolutions": [],
                    "status": inputInteger ? "Attempted" : "UnAttempted",
                    "timeTaken": responses[curr]?.timeTaken + timeDiff,
                    "questionId": currentQuestion?._id,
                    "markedSolutionText": inputInteger,
                    "isBookmarked": false,
                    "notes": ""
                }
            } else {
                obj = {
                    "markedSolutions": selectedAnswers,
                    "status": selectedAnswers?.length > 0 ? "Attempted" : "UnAttempted",
                    "timeTaken": responses[curr]?.timeTaken + timeDiff,
                    "questionId": currentQuestion?._id,
                    "markedSolutionText": "",
                    "isBookmarked": false,
                    "notes": ""
                }
            }
            setLastTimeStamp(seconds);
            const newResponses = responses;
            newResponses[curr] = obj;
            setResponses(newResponses);
            setSelectedAnswers(responses[curr + 1]?.markedSolutions)
            setCurrentQuestion(testData?.sections[0]?.questions[curr + 1])
            setCorrectOptions(testData?.sections[0]?.questions[curr + 1]?.solutions);
            setMarkedOptions(responses[curr + 1]?.markedSolutions);
            setQuestionType(testData?.sections[0]?.questions[curr + 1]?.type);

        } else {
            setShowModal(true);
            return;
        }
    }

    const handlePreviousClick = async () => {
        const curr = currentQuestion?.questionNumber - 1;
        if (curr > 0) {
            const timeDiff = seconds - lastTimeStamp;
            let obj;
            if (questionType === 'Numeric') {
                obj = {
                    "markedSolutions": [],
                    "status": inputInteger ? "Attempted" : "UnAttempted",
                    "timeTaken": responses[curr]?.timeTaken + timeDiff,
                    "questionId": currentQuestion?._id,
                    "markedSolutionText": inputInteger,
                    "isBookmarked": false,
                    "notes": ""
                }
            } else {
                obj = {
                    "markedSolutions": selectedAnswers,
                    "status": selectedAnswers?.length > 0 ? "Attempted" : "UnAttempted",
                    "timeTaken": responses[curr]?.timeTaken + timeDiff,
                    "questionId": currentQuestion?._id,
                    "markedSolutionText": "",
                    "isBookmarked": false,
                    "notes": ""
                }
            }
            setLastTimeStamp(seconds);
            const newResponses = responses;
            newResponses[curr] = obj;
            setResponses(newResponses);
            setSelectedAnswers(responses[curr - 1]?.markedSolutions)
            setCurrentQuestion(testData?.sections[0]?.questions[curr - 1])
            setCorrectOptions(testData?.sections[0]?.questions[curr - 1]?.solutions);
            setMarkedOptions(responses[curr - 1]?.markedSolutions);
            setQuestionType(testData?.sections[0]?.questions[curr - 1]?.type);
        } else {
            ToastAndroid.showWithGravity(
                "No Previous Question",
                ToastAndroid.SHORT,
                ToastAndroid.TOP,
            );
            return;
        }
    }

    const formatTime = () => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');

        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    };


    const IntegerInputRef = useRef<TextInput>(null);


    return (
        <View className='bg-[#1A1A1A] min-h-screen p-5'>
            {showLoader && <View
                style={{ position: 'absolute', left: 0, top: 0, zIndex: 10, height: '100%', width: '100%', alignContent: 'center', flex: 1, alignItems: 'center', justifyContent: 'center' }}
                className='bg-white/10 '
            >
                <ActivityIndicator color={"#FFFFFF"} size={80} />
            </View>}
            <ReviewOrSubmitModal showModal={showModal} seconds={seconds} setShowModal={setShowModal} responses={responses} handleSubmitTest={handleSubmitTest} />
            <View className='flex-row justify-between items-center'>
                <View>
                    {testData && <Text className='text-white text-xl font-medium'>{testData?.test?.name}</Text>}
                    <View className='flex-row mt-2'>
                        <Image source={require('../assets/clock.png')} className='w-5 h-5' width={10} height={10} />
                        <Text className='text-white ml-2'>{formatTime()}</Text>
                    </View>
                </View>
                <View className='flex-row'>
                    <Pressable
                        hasTVPreferredFocus={true}
                        android_ripple={{
                            color: "rgba(255,255,255,0.5)",
                            borderless: false,
                            radius: 1000,
                            foreground: true
                        }} className='bg-white/20 rounded-xl px-5 py-2 overflow-hidden'>
                        <Text className='text-white text-lg'>View Instructions</Text>
                    </Pressable>
                    <Pressable
                        hasTVPreferredFocus={true}
                        android_ripple={{
                            color: "rgba(255,255,255,0.5)",
                            borderless: false,
                            radius: 1000,
                            foreground: true
                        }}
                        className='bg-[#5A4BDA] rounded-xl px-5 py-2 ml-4 overflow-hidden'
                        onPress={() => {
                            setShowModal(true);
                            // handleSubmitTest()
                        }}
                    >
                        <Text className='text-white text-lg'>Submit Test</Text>
                    </Pressable>
                </View>
            </View>
            <View className='mt-10 justify-center'>
                {currentQuestion?.topicId?.name && <View className='bg-white/5 px-4 py-2 mr-auto rounded-lg'>
                    <Text className='text-white text-center'>{currentQuestion?.topicId?.name}</Text>
                </View>}
                <View className='flex flex-row mt-4'>
                    <View className='bg-[#8E89BA] px-4 py-2 rounded-lg'>
                        <Text className='text-white text-center'>{currentQuestion?.questionNumber}</Text>
                    </View>
                    <View className='bg-white/10 w-[2px] h-full mx-3'></View>
                    <View className='bg-white/10 px-4 py-2 mr-3 rounded-lg'>
                        <Text className='text-white text-center'>{"Marks"} <Text className='text-green-500'> +{currentQuestion?.positiveMarksStr} </Text>for CORRECT answer <Text className='text-red-500'> -{currentQuestion?.negativeMarksStr} </Text>for WRONG answer </Text>
                    </View>
                    <View className='bg-white/10 px-4 py-2 mr-auto rounded-lg'>
                        <Text className='text-white text-center'>{`Type: ${currentQuestion?.type}`} </Text>
                    </View>
                </View>
                <View className='flex justify-between mt-10' style={{ display: 'flex', flexDirection: 'row' }}>
                    <View className='flex flex-col w-7/12 '>
                        <View className='h-[340] bg-white/5 rounded-xl items-center'>
                            <Image
                                source={{ uri: `${currentQuestion?.imageIds?.en?.baseUrl}${currentQuestion?.imageIds?.en?.key}` }}
                                width={700}
                                height={340}
                                resizeMode='contain'
                                className='rounded-xl overflow-hidden'
                            />
                        </View>
                    </View>
                    <View className='flex flex-col w-5/12 rounded-xl px-8'>
                        <Text className='text-white text-lg'>{questionType === 'Numeric' ? 'Type your answer:' : 'Options:'}</Text>
                        {questionType === 'Numeric' && <Pressable
                            android_ripple={{
                                color: "rgba(255,255,255,0.4)",
                                borderless: false,
                                radius: 1000,
                                foreground: true
                            }}
                            onPress={() => IntegerInputRef.current?.focus()} className='bg-white rounded-lg  overflow-hidden w-[200] my-10 p-2 text-lg self-center'>

                            <TextInput ref={IntegerInputRef} hasTVPreferredFocus={true} value={inputInteger} onChangeText={newText => { setInputInteger(newText) }}
                                className='text-black bg-white text-base self-center' autoFocus={true} placeholder='Enter an integer' />
                        </Pressable>}
                        {questionType === 'Numeric' && <Pressable
                            hasTVPreferredFocus={true}
                            android_ripple={{
                                color: "rgba(255,255,255,0.5)",
                                borderless: false,
                                radius: 2000,
                                foreground: true
                            }}
                            onPress={() => { handleOptionClick("") }}
                            className='mb-8 text-white bg-[#5A4BDA] rounded-xl py-3 px-6 text-center self-center overflow-hidden'
                        >
                            <Text className='text-white font-bold'>
                                Submit
                            </Text>
                        </Pressable>}
                        {currentQuestion && questionType === 'Single' && <Pressable
                            hasTVPreferredFocus={true}
                            android_ripple={{
                                color: "rgba(255,255,255,0.5)",
                                borderless: false,
                                radius: 2000,
                                foreground: true
                            }}
                            //65cdde8fc2f511239983b526
                            onPress={() => { handleOptionClick(currentQuestion?.options[0]?._id) }}
                            className={`bg-white/5 px-5 py-3 rounded-xl my-4 overflow-hidden ${markedOptions?.length > 0 ? markedOptions?.includes(currentQuestion?.options[0]?._id) ? correctOptions?.includes(currentQuestion?.options[0]?._id) ? 'bg-green-400' : 'bg-red-400' : correctOptions?.includes(currentQuestion?.options[0]?._id) ? 'bg-green-400' : '' : ''}`}
                        >
                            <View className={`flex flex-row justify-between`}>
                                <Text className='text-white font-bold'> {currentQuestion?.options[0]?.texts?.en} </Text>
                                <Text className='text-white font-bold'>{markedOptions?.length > 0 ? correctOptions?.includes(currentQuestion?.options[0]?._id) ? 'Correct Answer' : '' : ''} {markedOptions?.length > 0 ? markedOptions?.includes(currentQuestion?.options[0]?._id) ? !correctOptions?.includes(currentQuestion?.options[0]?._id) ? 'Incorrect (marked by you)' : '(marked by you)' : '' : ''}</Text>
                            </View>
                        </Pressable>}
                        {currentQuestion && questionType === 'Multiple' && <Pressable
                            hasTVPreferredFocus={true}
                            android_ripple={{
                                color: "rgba(255,255,255,0.5)",
                                borderless: false,
                                radius: 2000,
                                foreground: true
                            }}
                            onPress={() => { handleOptionClick(currentQuestion?.options[0]?._id) }}
                            className={`bg-white/5 px-5 py-3 rounded-xl my-4 overflow-hidden ${markedOptions?.length > 0 ? markedOptions?.includes(currentQuestion?.options[0]?._id) ? correctOptions?.includes(currentQuestion?.options[0]?._id) ? 'bg-green-400' : 'bg-red-400' : '' : ''}`}
                        >
                            <View className={`flex flex-row justify-between`}>
                                <Text className='text-white font-bold'> {currentQuestion?.options[0]?.texts?.en} </Text>
                                <Text className='text-white font-bold'>{markedOptions?.length > 0 ? markedOptions?.includes(currentQuestion?.options[0]?._id) && correctOptions?.includes(currentQuestion?.options[0]?._id) ? 'Correct Answer' : '' : ''} {markedOptions?.length > 0 ? markedOptions?.includes(currentQuestion?.options[0]?._id) ? !correctOptions?.includes(currentQuestion?.options[0]?._id) ? 'Incorrect (marked by you)' : '(marked by you)' : '' : ''}</Text>
                            </View>
                        </Pressable>}

                        {currentQuestion && questionType === 'Single' && <Pressable
                            hasTVPreferredFocus={true}
                            android_ripple={{
                                color: "rgba(255,255,255,0.5)",
                                borderless: false,
                                radius: 2000,
                                foreground: true
                            }}
                            onPress={() => { handleOptionClick(currentQuestion?.options[1]?._id) }}
                            className={`bg-white/5 px-5 py-3 rounded-xl my-4 overflow-hidden ${markedOptions?.length > 0 ? markedOptions?.includes(currentQuestion?.options[1]?._id) ? correctOptions?.includes(currentQuestion?.options[1]?._id) ? 'bg-green-400' : 'bg-red-400' : correctOptions?.includes(currentQuestion?.options[1]?._id) ? 'bg-green-400' : '' : ''}`}

                        >
                            <View className={`flex flex-row justify-between `}>
                                <Text className='text-white font-bold'> {currentQuestion?.options[1]?.texts?.en} </Text>
                                <Text className='text-white font-bold'>{markedOptions?.length > 0 ? correctOptions?.includes(currentQuestion?.options[1]?._id) ? 'Correct Answer' : '' : ''} {markedOptions?.length > 0 ? markedOptions?.includes(currentQuestion?.options[1]?._id) ? !correctOptions?.includes(currentQuestion?.options[1]?._id) ? 'Incorrect (marked by you)' : '(marked by you)' : '' : ''}</Text>
                            </View>
                        </Pressable>}
                        {currentQuestion && questionType === 'Multiple' && <Pressable
                            hasTVPreferredFocus={true}
                            android_ripple={{
                                color: "rgba(255,255,255,0.5)",
                                borderless: false,
                                radius: 2000,
                                foreground: true
                            }}
                            onPress={() => { handleOptionClick(currentQuestion?.options[1]?._id) }}
                            className={`bg-white/5 px-5 py-3 rounded-xl my-4 overflow-hidden ${markedOptions?.length > 0 ? markedOptions?.includes(currentQuestion?.options[1]?._id) ? correctOptions?.includes(currentQuestion?.options[1]?._id) ? 'bg-green-400' : 'bg-red-400' : '' : ''}`}
                        >
                            <View className={`flex flex-row justify-between`}>
                                <Text className='text-white font-bold'> {currentQuestion?.options[1]?.texts?.en} </Text>
                                <Text className='text-white font-bold'>{markedOptions?.length > 0 ? markedOptions?.includes(currentQuestion?.options[1]?._id) && correctOptions?.includes(currentQuestion?.options[1]?._id) ? 'Correct Answer' : '' : ''} {markedOptions?.length > 0 ? markedOptions?.includes(currentQuestion?.options[1]?._id) ? !correctOptions?.includes(currentQuestion?.options[1]?._id) ? 'Incorrect (marked by you)' : '(marked by you)' : '' : ''}</Text>
                            </View>
                        </Pressable>}
                        {currentQuestion && questionType === 'Single' && <Pressable
                            hasTVPreferredFocus={true}
                            android_ripple={{
                                color: "rgba(255,255,255,0.5)",
                                borderless: false,
                                radius: 2000,
                                foreground: true
                            }}
                            onPress={() => { handleOptionClick(currentQuestion?.options[2]?._id) }}
                            className={`bg-white/5 px-5 py-3 rounded-xl my-4 overflow-hidden ${markedOptions?.length > 0 ? markedOptions?.includes(currentQuestion?.options[2]?._id) ? correctOptions?.includes(currentQuestion?.options[2]?._id) ? 'bg-green-400' : 'bg-red-400' : correctOptions?.includes(currentQuestion?.options[2]?._id) ? 'bg-green-400' : '' : ''}`}
                        >
                            <View className={`flex flex-row justify-between `}>
                                <Text className='text-white font-bold'>{currentQuestion?.options[2]?.texts?.en} </Text>
                                <Text className='text-white font-bold'>{markedOptions?.length > 0 ? correctOptions?.includes(currentQuestion?.options[2]?._id) ? 'Correct Answer' : '' : ''} {markedOptions?.length > 0 ? markedOptions?.includes(currentQuestion?.options[2]?._id) ? !correctOptions?.includes(currentQuestion?.options[2]?._id) ? 'Incorrect (marked by you)' : '(marked by you)' : '' : ''}</Text>
                            </View>
                        </Pressable>}
                        {currentQuestion && questionType === 'Multiple' && <Pressable
                            hasTVPreferredFocus={true}
                            android_ripple={{
                                color: "rgba(255,255,255,0.5)",
                                borderless: false,
                                radius: 2000,
                                foreground: true
                            }}
                            onPress={() => { handleOptionClick(currentQuestion?.options[2]?._id) }}
                            className={`bg-white/5 px-5 py-3 rounded-xl my-4 overflow-hidden ${markedOptions?.length > 0 ? markedOptions?.includes(currentQuestion?.options[2]?._id) ? correctOptions?.includes(currentQuestion?.options[2]?._id) ? 'bg-green-400' : 'bg-red-400' : '' : ''}`}
                        >
                            <View className={`flex flex-row justify-between`}>
                                <Text className='text-white font-bold'> {currentQuestion?.options[2]?.texts?.en} </Text>
                                <Text className='text-white font-bold'>{markedOptions?.length > 0 ? markedOptions?.includes(currentQuestion?.options[2]?._id) && correctOptions?.includes(currentQuestion?.options[2]?._id) ? 'Correct Answer' : '' : ''} {markedOptions?.length > 0 ? markedOptions?.includes(currentQuestion?.options[2]?._id) ? !correctOptions?.includes(currentQuestion?.options[2]?._id) ? 'Incorrect (marked by you)' : '(marked by you)' : '' : ''}</Text>
                            </View>
                        </Pressable>}
                        {currentQuestion && questionType === 'Single' && <Pressable
                            hasTVPreferredFocus={true}
                            android_ripple={{
                                color: "rgba(255,255,255,0.5)",
                                borderless: false,
                                radius: 2000,
                                foreground: true
                            }}
                            onPress={() => { handleOptionClick(currentQuestion?.options[3]?._id) }}
                            className={`bg-white/5 px-5 py-3 rounded-xl my-4 overflow-hidden ${markedOptions?.length > 0 ? markedOptions?.includes(currentQuestion?.options[3]?._id) ? correctOptions?.includes(currentQuestion?.options[3]?._id) ? 'bg-green-400' : 'bg-red-400' : correctOptions?.includes(currentQuestion?.options[3]?._id) ? 'bg-green-400' : '' : ''}`}

                        >
                            <View className={`flex flex-row justify-between `}>
                                <Text className='text-white font-bold'> {currentQuestion?.options[3]?.texts?.en} </Text>
                                <Text className='text-white font-bold'>{markedOptions?.length > 0 ? correctOptions?.includes(currentQuestion?.options[3]?._id) ? 'Correct Answer' : '' : ''} {markedOptions?.length > 0 ? markedOptions?.includes(currentQuestion?.options[3]?._id) ? !correctOptions?.includes(currentQuestion?.options[3]?._id) ? 'Incorrect (marked by you)' : '(marked by you)' : '' : ''}</Text>
                            </View>
                        </Pressable>}
                        {currentQuestion && questionType === 'Multiple' && <Pressable
                            hasTVPreferredFocus={true}
                            android_ripple={{
                                color: "rgba(255,255,255,0.5)",
                                borderless: false,
                                radius: 2000,
                                foreground: true
                            }}
                            onPress={() => { handleOptionClick(currentQuestion?.options[3]?._id) }}
                            className={`bg-white/5 px-5 py-3 rounded-xl my-4 overflow-hidden ${markedOptions?.length > 0 ? markedOptions?.includes(currentQuestion?.options[3]?._id) ? correctOptions?.includes(currentQuestion?.options[3]?._id) ? 'bg-green-400' : 'bg-red-400' : '' : ''}`}
                        >
                            <View className={`flex flex-row justify-between`}>
                                <Text className='text-white font-bold'>  {currentQuestion?.options[3]?.texts?.en} </Text>
                                <Text className='text-white font-bold'>{markedOptions?.length > 0 ? markedOptions?.includes(currentQuestion?.options[3]?._id) && correctOptions?.includes(currentQuestion?.options[3]?._id) ? 'Correct Answer' : '' : ''} {markedOptions?.length > 0 ? markedOptions?.includes(currentQuestion?.options[3]?._id) ? !correctOptions?.includes(currentQuestion?.options[3]?._id) ? 'Incorrect (marked by you)' : '(marked by you)' : '' : ''}</Text>
                            </View>
                        </Pressable>}
                    </View>
                </View>
                <View className='flex flex-row justify-center mt-4'>
                    <Pressable
                        hasTVPreferredFocus={true}
                        android_ripple={{
                            color: "rgba(255,255,255,0.5)",
                            borderless: false,
                            radius: 1000,
                            foreground: true
                        }}
                        onPress={() => handlePreviousClick()}
                        className='bg-[#A79EEB] rounded-xl px-5 mt-2 mx-4 py-2 overflow-hidden'
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
                        className='bg-[#A79EEB] rounded-xl px-5 mt-2 mx-4 py-2 overflow-hidden'
                    >
                        <Text className='text-white text-lg'>Next</Text>
                    </Pressable>
                </View>
            </View>
        </View >
    )
}

export default Tests
