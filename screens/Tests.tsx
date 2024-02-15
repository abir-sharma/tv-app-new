import React, { useEffect, useState } from 'react'
import { View, Text, Image, Pressable, ToastAndroid } from 'react-native'
import { useGlobalContext } from '../context/MainContext'
import axios from 'axios';

const Tests = ({ navigation, route }: any) => {
    const { testData, testSections, selectedBatch, headers, selectedTestMapping } = useGlobalContext();
    const [totalQuestions, setTotalQuestions] = useState<number>(0);
    const [currentQuestion, setCurrentQuestion] = useState<any>();
    const [responses, setResponses] = useState<any>(0);
    const [selectedAnswers, setSelectedAnswers] = useState<any>([]);


    useEffect(() => {
        if (testData && testData.sections && testData.sections[0].questions) {
            const len = testData.sections[0]?.questions?.length;
            setTotalQuestions(testData.sections[0]?.questions?.length);
            setCurrentQuestion(testData.sections[0]?.questions[0]);
            const response = [];
            for (let i = 0; i < len; i++) {
                const obj = {
                    "markedSolutions": [],
                    "markedSolutionText": "",
                    "status": "UnAttempted",
                    "isBookmarked": false,
                    "timeTaken": 95,
                    "questionId": testData.sections[0]?.questions[i]._id,
                    "notes": ""
                }
                response.push(obj);
            }
            setResponses(response);
        }
    }, [testData])

    const handleOptionClick = async (option: any) => {
        const questionType = currentQuestion.type;
        const id = currentQuestion._id;
        if (questionType === "Single") {
            console.log("Single Option:", [option]);
            if (selectedAnswers.includes(option)) {
                setSelectedAnswers([]);
            } else {
                setSelectedAnswers([option]);
            }
        } else if (questionType === "Multiple") {
            if (selectedAnswers.includes(option)) {
                console.log("Includes value :", selectedAnswers.filter((ans: any) => ans !== option));
                setSelectedAnswers(selectedAnswers.filter((ans: any) => ans !== option));
            } else {
                console.log("Does not include value :", [...selectedAnswers, option].sort());
                setSelectedAnswers([...selectedAnswers, option].sort());
            }
        }
    }


    const handleSubmitTest = async () => {
        try {
            const options = {
                headers
            }
            const body = {
                "questionsResponses": responses,
                "lastVisitedQuestionId": currentQuestion?._id,
                "type": "Submit",
                "submittedBy": "user",
                "batchId": selectedBatch?.batch?._id,
            }
            console.log("Submit Test Body: ", body);
            console.log(options);
            console.log("Mapping Id: ", selectedTestMapping);
            console.log(`https://api.penpencil.co/v3/test-service/tests/mapping/${selectedTestMapping}/submit-test`);
            const res = await axios.post(`https://api.penpencil.co/v3/test-service/tests/mapping/${selectedTestMapping}/submit-test`, body, options);
            console.log("Submit Test Response: ", res.data);
            navigation.navigate('TestSolutions')

        } catch (err) {
            console.log("Error while submitting test!!", err);
        }
    }

    const handleNextClick = async () => {
        const curr = currentQuestion.questionNumber - 1;
        if (curr < totalQuestions - 1) {
            const obj = {
                "markedSolutions": selectedAnswers,
                "status": selectedAnswers.length > 0 ? "Attempted" : "UnAttempted",
                "timeTaken": 95,
                "questionId": currentQuestion._id,
                "markedSolutionText": "",
                "isBookmarked": false,
                "notes": ""
            }
            const newResponses = responses;
            newResponses[curr] = obj;
            setResponses(newResponses);
            setSelectedAnswers(responses[curr + 1].markedSolutions)
            setCurrentQuestion(testData.sections[0]?.questions[curr + 1])
        } else {
            ToastAndroid.showWithGravity(
                "No next Question!!",
                ToastAndroid.SHORT,
                ToastAndroid.TOP,
            );
            return;
        }
    }

    const handlePreviousClick = async () => {
        const curr = currentQuestion.questionNumber - 1;
        if (curr > 0) {
            const obj = {
                "markedSolutions": selectedAnswers,
                "status": selectedAnswers.length > 0 ? "Attempted" : "UnAttempted",
                "timeTaken": 95,
                "questionId": currentQuestion._id,
                "markedSolutionText": "",
                "isBookmarked": false,
                "notes": ""
            }
            const newResponses = responses;
            newResponses[curr] = obj;
            setResponses(newResponses);
            setSelectedAnswers(responses[curr - 1].markedSolutions)
            setCurrentQuestion(testData.sections[0]?.questions[curr - 1])
        } else {
            ToastAndroid.showWithGravity(
                "No Previous Question",
                ToastAndroid.SHORT,
                ToastAndroid.TOP,
            );
            return;
        }
    }

    // const handleInstructionClick = async () => {

    // }



    return (
        <View className='bg-[#1A1A1A] min-h-screen p-5'>
            <View className='flex-row justify-between items-center'>
                <View>
                    {testData && <Text className='text-white text-xl font-medium'>{testData?.test?.name}</Text>}
                    <View className='flex-row mt-2'>
                        <Image source={require('../assets/clock.png')} className='w-5 h-5' width={10} height={10} />
                        <Text className='text-white ml-2'>{"03:18:52"}</Text>
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
                            handleSubmitTest()
                        }}
                    >
                        <Text className='text-white text-lg'>Submit Test</Text>
                    </Pressable>
                </View>
            </View>
            <View className='mt-10 justify-center'>
                <View className='bg-white/5 px-4 py-2 mr-auto rounded-lg'>
                    <Text className='text-white text-center'>{currentQuestion?.topicId.name}</Text>
                </View>
                <View className='flex flex-row mt-4'>
                    <View className='bg-[#8E89BA] px-4 py-2 rounded-lg'>
                        <Text className='text-white text-center'>{currentQuestion?.questionNumber}</Text>
                    </View>
                    <View className='bg-white/10 w-[2px] h-full mx-3'></View>
                    <View className='bg-white/10 px-4 py-2 mr-3 rounded-lg'>
                        <Text className='text-white text-center'>{"Marks"} <Text className='text-green-500'> {currentQuestion?.positiveMarksStr} </Text> <Text className='text-red-500'> -{currentQuestion?.negativeMarksStr} </Text> </Text>
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
                        <Text className='text-white text-lg'>Options: </Text>
                        <Pressable
                            hasTVPreferredFocus={true}
                            android_ripple={{
                                color: "rgba(255,255,255,0.5)",
                                borderless: false,
                                radius: 2000,
                                foreground: true
                            }}
                            onPress={() => { handleOptionClick(currentQuestion?.options[0]?._id) }}
                            className={`bg-white/5 px-5 py-3 rounded-xl my-4 overflow-hidden ${selectedAnswers.includes(currentQuestion?.options[0]?._id) ? 'bg-[#A79EEB]' : ''}`}
                        >
                            {currentQuestion && <Text className='text-white font-bold'> {"a.    "} {currentQuestion?.options[0]?.texts?.en} </Text>}
                        </Pressable>
                        <Pressable
                            hasTVPreferredFocus={true}
                            android_ripple={{
                                color: "rgba(255,255,255,0.5)",
                                borderless: false,
                                radius: 2000,
                                foreground: true
                            }}
                            onPress={() => { handleOptionClick(currentQuestion?.options[1]?._id) }}
                            className={`bg-white/5 px-5 py-3 rounded-xl my-4 overflow-hidden ${selectedAnswers.includes(currentQuestion?.options[1]?._id) ? 'bg-[#A79EEB]' : ''}`}

                        >
                            {currentQuestion && <Text className='text-white font-bold'> {"a.    "} {currentQuestion?.options[1]?.texts?.en} </Text>}
                        </Pressable>
                        <Pressable
                            hasTVPreferredFocus={true}
                            android_ripple={{
                                color: "rgba(255,255,255,0.5)",
                                borderless: false,
                                radius: 2000,
                                foreground: true
                            }}
                            onPress={() => { handleOptionClick(currentQuestion?.options[2]?._id) }}
                            className={`bg-white/5 px-5 py-3 rounded-xl my-4 overflow-hidden ${selectedAnswers.includes(currentQuestion?.options[2]?._id) ? 'bg-[#A79EEB]' : ''}`}

                        >
                            {currentQuestion && <Text className='text-white font-bold'> {"a.    "} {currentQuestion?.options[2]?.texts?.en} </Text>}

                        </Pressable>
                        <Pressable
                            hasTVPreferredFocus={true}
                            android_ripple={{
                                color: "rgba(255,255,255,0.5)",
                                borderless: false,
                                radius: 2000,
                                foreground: true
                            }}
                            onPress={() => { handleOptionClick(currentQuestion?.options[3]?._id) }}
                            className={`bg-white/5 px-5 py-3 rounded-xl my-4 overflow-hidden ${selectedAnswers.includes(currentQuestion?.options[3]?._id) ? 'bg-[#A79EEB]' : ''}`}

                        >
                            {currentQuestion && <Text className='text-white font-bold'> {"a.    "} {currentQuestion?.options[3]?.texts?.en} </Text>}
                        </Pressable>
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
        </View>
    )
}

export default Tests
