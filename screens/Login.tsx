/// <reference types="nativewind/types" />

import { View, Text, Image, TextInput, ImageBackground, Pressable, TouchableOpacity, Alert, TouchableHighlight, ToastAndroid, ActivityIndicator, BackHandler, Button, ScrollView } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useGlobalContext } from '../context/MainContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Images } from '../images/images';

export default function Login({ navigation }: any) {

  const { setHeaders } = useGlobalContext();
  const [phone, setPhone] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpReSent, setOtpReSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [newUser, setNewUser] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [otpTimer, setOtpTimer] = useState<number>(30);
  const [showLoader, setShowLoader] = useState<boolean>(false);

  
  const [rememberMe, setRememberMe] = useState<boolean>(false); 
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', ''])          //new change here


  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);


  useEffect(() => {
    if (otpReSent || otpSent) {
      const interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev === 0) {
            setOtpReSent(false);
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpReSent, otpSent]);

  const handleOTPDigitChange = (value: string, index: number) => {    //new state manage changes here made
  if (value.length > 1) return; 
  
  const newOtpDigits = [...otpDigits];
  if (value === '') {
    newOtpDigits[index] = '';
    setOtpDigits(newOtpDigits);
    setOtp(newOtpDigits.join(''));
    if (index > 0) {
      const prevInput = otpInputRefs[index - 1];
      prevInput.current?.focus();
    }
    return;
  }
  
  newOtpDigits[index] = value;
  setOtpDigits(newOtpDigits);
  setOtp(newOtpDigits.join(''));
  if (value && index < 5) {
    const nextInput = otpInputRefs[index + 1];
    nextInput.current?.focus();
  }
}



  const handleTextChange = (newText: string) => {
    if (newText.length > 10) return;
    else setPhone(newText);
  }
  // const handleOTPChange = (newText: string) => {
  //   setOtp(newText);
  // }
  const handleNameChange = (newText: string) => {
    setName(newText);
  }

  const handleSentOTP = async () => {
    if (phone?.length !== 10) {
      ToastAndroid.showWithGravity(
        "Enter a Valid Mobile Number",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return
    }

    setShowLoader(true);
    try {
      const res = await axios.post("https://api.penpencil.co/v1/users/get-otp?smsType=0", {
        username: phone,
        countryCode: "+91",
        organizationId: "5eb393ee95fab7468a79d189",
        // "Client-Type": "WEB",
      })

      if (res?.data?.success) {
        setOtpSent(true);
      }

    }
    catch (err: any) {
      console.error("Error while sending otp! ", err?.res?.status);
      if (err?.res?.status === 429) {
        ToastAndroid.showWithGravity(
          "Too many OTP requests, Please try after sometime",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      } else if (err?.response?.status === 400) {
        setNewUser(true);
      }
      else {
        ToastAndroid.showWithGravity(
          "OTP not sent something went wrong! Please try again later.",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      }

    }
    setShowLoader(false);

  }

  const handleVerifyOTP = async () => {
    if (otp?.length <= 0) {
      ToastAndroid.showWithGravity(
        "Please enter a valid OTP",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
      return;
    }
    setShowLoader(true);
    try {
      const res = await axios.post("https://api.penpencil.co/v3/oauth/token", {
        username: phone,
        otp: otp,
        client_id: "system-admin",
        client_secret: "KjPXuAVfC5xbmgreETNMaL7z",
        grant_type: "password",
        organizationId: "5eb393ee95fab7468a79d189",
        latitude: 0,
        longitude: 0,
        // "Client-Type": "WEB",
      })

      if (res?.data?.success) {
        setHeaders({
          "Authorization": `Bearer ${res?.data?.data?.access_token}`
        })
        await AsyncStorage.setItem("token", res?.data?.data?.access_token);
        await AsyncStorage.setItem("phone", phone);
        axios.get(`https://pibox-backend.betterpw.live/v1/clicker/school/by-phone?phone=${phone}`).then(async (res) => {
          await AsyncStorage.setItem("schoolData", JSON.stringify(res.data.data));
        }).catch((err) => {
          console.error(err.response.data);
        });
        navigation.navigate('PendriveBatches');
      }
    }
    catch (err) {
      console.error(err);
      ToastAndroid.showWithGravity(
        "Please enter a correct OTP",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
    setShowLoader(false);
  }

  const handleRegisterUser = async () => {
    if (phone?.length !== 10) {
      Alert.alert("Please enter a valid mobile number");
    }
    if (name?.length <= 0) {
      Alert.alert("Please enter a valid name");
    }

    setShowLoader(true);
    const nameArray = name?.split(' ');
    const firstName = nameArray?.shift();
    const lastName = nameArray?.join(' ');

    try {
      const res = await axios.post("https://api.penpencil.co/v1/users/register/5eb393ee95fab7468a79d189", {
        mobile: phone,
        countryCode: "+91",
        firstName: firstName,
        lastName: lastName
      })

      if (res?.data?.success) {
        setOtpSent(true);
        setNewUser(false);
      }


    }
    catch (err) {
      console.error("err white register", err);
      ToastAndroid.showWithGravity(
        "Error while registering please try again later!",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
    setShowLoader(false);
  }

  const phoneInputRef = useRef<TextInput>(null);
  // const otpInputRef = useRef<TextInput>(null);
  const nameInputRef = useRef<TextInput>(null);

   const otpInputRefs = [                  //new change here
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];                                 
  
    useEffect(() => {
    const loadSavedData = async () => {                      //new change here
      try {
        const savedRememberMe = await AsyncStorage.getItem("rememberMe");
        const savedPhone = await AsyncStorage.getItem("savedPhone");
        
        if (savedRememberMe === "true" && savedPhone) {
          setPhone(savedPhone);
          setRememberMe(true);
        }
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    };
    
    loadSavedData();
  }, []);

  return (

    //------------------------------------- NEW  UI here ->
  
    //Background Layer
     <View className="flex-1">
                                        
    <Image 
      source={Images.LoginBg} 
      className='bg-[#fefaee]'                               //-->Color adjust Background ke liye
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'cover', 
      }}
    />

    {showLoader && (
      <View
        style={{ 
          position: 'absolute', 
          left: 0, 
          top: 0, 
          zIndex: 20, 
          height: '100%', 
          width: '100%', 
          alignContent: 'center', 
          flex: 1, 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
        className='bg-black/20'
      >
        <ActivityIndicator color={"#4F46E5"} size={80} />
      </View>
    )}
    
    
  <View className="flex-1 flex items-center justify-center p-8">
  <View 
    className="bg-white/95 rounded-3xl overflow-hidden border-b-[6px] border-r-[6px]"
    style={{
      width: '95%',
      maxWidth: 1200,            
      height: '90%',
      elevation: 5, 
      shadowColor: '#000000', 
    }}
  >
        <View className='flex flex-row w-full h-full'>
          
          <View className='flex-1 flex items-center justify-center px-10 bg-[#fffbe6] relative'>             
            
            <View className="mb-8 items-center">
              <Text className="text-gray-800 text-2xl font-normal text-center mb-2 mt-10">
                Welcome to
              </Text>
              <Text className="text-gray-900 text-2xl font-semibold text-center mb-1">
                PhysicsWallah AI-powered
              </Text>
              <View className="flex-row items-center justify-center ">
              <Text className="text-gray-900 text-2xl font-semibold mb-10 ml-48">
                Smart Classroom
              </Text>
              <Image source={Images.Vector75} className='w-[150px] h-[90px]' resizeMode='contain'/>  
              </View>
              
            </View>
            
            
            <View className="flex-1 flex items-center justify-center bottom-12">
              <Image
                source={Images.welcome}
                style={{
                  width: 400,
                  height: 400,
                  resizeMode: 'contain',
                }}
              /> 
            </View>
            <Image source={Images.chemistry} className='w-[50px] h-[90px] absolute left-10 top-[200px]' resizeMode='contain'/> 
            <Image source={Images.molecular} className='w-[150px] h-[90px] absolute right-0 bottom-10' resizeMode='contain'/> 
            <Image source={Images.nucleus} className='w-[80px] h-[80px] absolute left-10 bottom-6' resizeMode='contain'/> 
            
          </View>

          
          <View className='w-[600px] flex items-center justify-center px-10 bg-white'>
            
            <View className="mb-8">
              <View className='px-14 pb-5'>
                <Image source={Images.pwBlack} className='w-16 h-16' width={10} height={10} />
              </View>
              
              {/* PRESERVED: Dynamic Title */}
              <Text className="text-gray-900 text-2xl font-bold text-center">
                {otpSent ? "Enter OTP" : "Login to Continue"}
              </Text>
            </View>

            {/* PRESERVED: Login Form - ALL FUNCTIONALITY INTACT */}
            <View className="w-full max-w-sm">
              
              {/* PRESERVED: Phone Input */}
              {!otpSent && (
                <>
                  <Pressable
                    android_ripple={{
                      color: "rgba(0,0,0,0.1)",
                      borderless: false,
                      radius: 1000,
                      foreground: true
                    }}
                    onPress={() => phoneInputRef.current?.focus()}
                    className='bg-white w-full h-14 flex-row rounded-xl px-4 items-center justify-start overflow-hidden border border-gray-200 mb-4'
                  >
                    <TextInput 
                      ref={phoneInputRef}
                      hasTVPreferredFocus={true}
                      value={phone} 
                      onChangeText={newText => { handleTextChange(newText) }}  
                      className='w-full text-gray-800 text-lg' 
                      autoFocus={true} 
                      placeholderTextColor={"rgba(169, 169, 169, 1)"} 
                      placeholder='Enter Mobile No.' 
                      keyboardType="phone-pad"
                    />
                  </Pressable>
                </>
              )}

              
              {otpSent && (
                <>
                  
                  <View className="bg-white w-full h-14 flex-row rounded-xl px-4 items-center justify-center mb-6 border border-black">
                    <Text className="text-gray-600 text-lg font-medium">{phone}</Text>
                  </View>
                  
                  
                  <View className="flex-row justify-between mb-6">
                    {otpDigits.map((digit, index) => (
                      <Pressable
                        key={index}
                        onPress={() => otpInputRefs[index].current?.focus()}
                        className={`w-12 h-12 bg-white border rounded-lg flex items-center justify-center ${digit ? 'border-gray-400' : 'border-purple-400'}`}>
                        <TextInput
                          ref={otpInputRefs[index]}
                          value={digit}
                          onChangeText={(value) => handleOTPDigitChange(value, index)}
                          className="text-center text-lg font-bold text-black"
                          keyboardType="numeric"
                          maxLength={1}
                          hasTVPreferredFocus={index === 0}
                        />
                      </Pressable>
                    ))}
                  </View>
                </>
              )}

              {newUser && (
                <Pressable
                  android_ripple={{
                    color: "rgba(0,0,0,0.1)",
                    borderless: false,
                    radius: 1000,
                    foreground: true
                  }}
                  onPress={() => nameInputRef.current?.focus()} 
                  className='bg-white w-full overflow-hidden h-14 mb-4 flex-row rounded-xl px-4 items-center justify-start border border-gray-200'
                >
                  <TextInput 
                    ref={nameInputRef} 
                    hasTVPreferredFocus={true} 
                    value={name} 
                    onChangeText={newText => { handleNameChange(newText) }}
                    className='w-full text-gray-800 text-lg' 
                    autoFocus={true} 
                    placeholderTextColor={"rgba(169, 169, 169, 1)"} 
                    placeholder='Enter Name' 
                  />
                </Pressable>
              )}

              
              {otpSent && (
                <Pressable
                  onPress={() => setRememberMe(!rememberMe)}
                  className="flex-row items-center mb-6"
                >
                  <View className={`w-5 h-5 border-2 rounded ${rememberMe ? 'bg-black border-gray-500' : 'border-gray-500'} flex items-center justify-center mr-3`}>
                    {rememberMe && (
                      <Text className="text-white text-xs font-bold">✓</Text>
                    )}
                  </View>
                  <Text className="text-gray-800 text-base">Remember me</Text>
                </Pressable>
              )}

              
              {otpSent && (
                <Pressable
                  android_ripple={{
                    color: "rgba(0,0,0,0.1)",
                    borderless: false,
                    radius: 1000,
                    foreground: true
                  }}
                  disabled={otpTimer > 0}
                  onPress={() => {
                    handleSentOTP()
                    setOtpTimer(30);
                    setOtpReSent(true);
                  }} 
                  className='mb-4 px-4 rounded-full overflow-hidden'
                >
                  <Text className='w-full text-blue-600 text-sm text-center '>
                    {otpTimer > 0 ? ( otpTimer < 10? ("00:0" + otpTimer): ("00:" + otpTimer)) : "Resend OTP"}
                  </Text>
                </Pressable>
              )}

              
              <Pressable
                android_ripple={{
                  color: "rgba(255,255,255,0.2)",
                  borderless: false,
                  radius: 1000,
                  foreground: true
                }}
                onPress={() => {
                  setShowLoader(true);
                  newUser ? handleRegisterUser() :
                    otpSent ? handleVerifyOTP() : handleSentOTP()
                }}
                className={`${
                  phone.length !== 10 && !otpSent ? 'bg-gray-300' : 'bg-black'
                } w-full h-14 mb-6 flex-row rounded-xl px-4 items-center justify-center border-b-[6px] border-[#a6aab1]`}
                style={{ elevation: 5 }}
              >
                <Text className='text-white text-center w-full text-base font-semibold'>
                  {newUser ? "Register" : otpSent ? "Login to Continue" : "Get OTP"}
                </Text>
              </Pressable>

              {/* PRESERVED: Terms & Privacy Notice */}
              <Text className="text-black text-sm text-center leading-5">
                By logging into PW AI School, you agree to our{' '}
                <Text className="text-black ">Terms of use</Text>
                {' '}and{' '}
                <Text className="text-black ">Privacy Policy</Text>.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  </View>
);
}
function uuidv4() {
  throw new Error('Function not implemented.');
}

