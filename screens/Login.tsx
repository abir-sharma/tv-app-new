/// <reference types="nativewind/types" />

import { View, Text, Image, TextInput, ImageBackground, Pressable, TouchableOpacity, Alert, TouchableHighlight, ToastAndroid, ActivityIndicator, BackHandler } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useGlobalContext } from '../context/MainContext';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Login({ navigation }: any) {

  const { setMainNavigation, headers, setHeaders } = useGlobalContext();
  const [phone, setPhone] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpReSent, setOtpReSent] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [newUser, setNewUser] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [otpTimer, setOtpTimer] = useState<number>(30);
  const [showLoader, setShowLoader] = useState<boolean>(false);

  // useEffect(
  //   () =>
  //     navigation.addListener('beforeRemove', (e:any) => {
  //       e.preventDefault();
  //       //close the app
  //       BackHandler.exitApp();
  //     }),
  //   [navigation]
  // );

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      // Return true to prevent default behavior (closing the app)
      // Return false to allow default behavior
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


  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    setMainNavigation(navigation);
  }, [])

  const handleTextChange = (newText: string) => {
    if (newText.length > 10) return;
    else setPhone(newText);
  }
  const handleOTPChange = (newText: string) => {
    setOtp(newText);
  }
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

      console.log("success", res?.data);

      if (res?.data?.success) {
        setOtpSent(true);
      }

    }
    catch (err: any) {
      console.log("Error while sending otp! ", err?.res?.status);
      if (err?.res?.status === 429) {
        ToastAndroid.showWithGravity(
          "Too many OTP requests, Please try after sometime",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      } else if (err?.response?.status === 400) {
        // console.log("New user error: ", err?.response?.status);
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

      console.log("success: ", res?.data?.data);

      console.log("Token: ", res?.data?.data?.access_token);

      if (res?.data?.success) {
        setHeaders({
          "Authorization": `Bearer ${res?.data?.data?.access_token}`
        })
        await AsyncStorage.setItem("token", res?.data?.data?.access_token);
        navigation.navigate('Intro');
      }
    }
    catch (err) {
      console.log(err);
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

    console.log(firstName, " ---- ", lastName);


    try {
      const res = await axios.post("https://api.penpencil.co/v1/users/register/5eb393ee95fab7468a79d189", {
        mobile: phone,
        countryCode: "+91",
        firstName: firstName,
        lastName: lastName
      })

      console.log("success", res?.data);

      if (res?.data?.success) {
        setOtpSent(true);
        setNewUser(false);
      }


    }
    catch (err) {
      console.log("err white register", err);
      ToastAndroid.showWithGravity(
        "Error while registering please try again later!",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
    setShowLoader(false);
  }

  const phoneInputRef = useRef<TextInput>(null);
  const otpInputRef = useRef<TextInput>(null);
  const nameInputRef = useRef<TextInput>(null);

  return (

    
    <ImageBackground
      source={require('../assets/bg.png')}
      style={{ 
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {showLoader && <View
        style={{ position: 'absolute', left: 0, top: 0, zIndex: 10, height: '100%', width: '100%', alignContent: 'center', flex: 1, alignItems: 'center', justifyContent: 'center' }}
        className='bg-white/10 '
      >
        <ActivityIndicator color={"#FFFFFF"} size={80} />
      </View>}

      <View className='flex flex-row w-full pl-40 items-center justify-between gap-10'>
        <View className='flex-col items-start relative z-[2]'>
          {!otpSent && <Image source={require('../assets/pw-logo.png')} className='w-16 h-16' width={10} height={10} />}

          {otpSent && <Pressable
            android_ripple={{
              color: "rgba(255,255,255,0.4)",
              borderless: false,
              radius: 1000,
              foreground: true
            }}
            onPress={()=>{setOtpSent(false)}}
            className='bg-[#1B2124] w-16 h-12 rounded-xl overflow-hidden flex items-center justify-center'
            ><Image source={require('../assets/back2.png')} className='w-5 h-5' width={10} height={10} /></Pressable>}

          <Text className="text-white text-lg font-normal mt-5"> Welcome to</Text>
          <Text className="text-white text-2xl font-medium mt-2">PhysicsWallah AI-powered </Text>
          <Text className="text-white text-2xl font-medium mt-2">Smart Classroom </Text>
          {!otpSent ?
          <Text className="text-white text-sm font-normal mt-6"> Please enter your mobile no. to Login  / Register </Text>:
          <Text className="text-white text-sm font-normal mt-6"> A 6 Digit OTP has been sent to {phone} </Text>}
          {!otpSent && <Pressable
            android_ripple={{
              color: "rgba(255,255,255,0.4)",
              borderless: false,
              radius: 1000,
              foreground: true
            }}
            onPress={() => phoneInputRef.current?.focus()}
            className='bg-white w-96 h-12 mt-3 flex-row rounded-md px-4 items-center justify-start overflow-hidden'
          >
            <View className='flex-row items-center justify-start'>
              <Image source={require('../assets/india.png')} className='w-6 h-6' width={10} height={10} />
              <Text className="text-gray-600 text-lg font-semibold mx-2" > +91 </Text>
            </View>
            <TextInput 
              ref={phoneInputRef}
              hasTVPreferredFocus={true}
              value={phone} onChangeText={newText => { handleTextChange(newText) }}  
              className='w-full text-black text-lg' autoFocus={true} placeholderTextColor={"rgba(169, 169, 169, 1)"} placeholder='Enter Mobile No.' /></Pressable>}


          {newUser && <Pressable
            android_ripple={{
              color: "rgba(255,255,255,0.4)",
              borderless: false,
              radius: 1000,
              foreground: true
            }}
            onPress={() => nameInputRef.current?.focus()} className='bg-white w-80 overflow-hidden h-12 mt-3 flex-row rounded-md px-4 items-center justify-start'>

            <TextInput ref={nameInputRef} hasTVPreferredFocus={true} value={name} onChangeText={newText => { handleNameChange(newText) }}
              className='w-full text-black text-lg' autoFocus={true} placeholderTextColor={"rgba(169, 169, 169, 1)"} placeholder='Enter Name' />
          </Pressable>}

          {otpSent && <Pressable
            android_ripple={{
              color: "rgba(255,255,255,0.4)",
              borderless: false,
              radius: 1000,
              foreground: true
            }}
            onPress={() => otpInputRef.current?.focus()} className='bg-white w-96 overflow-hidden h-12 mt-3 flex-row rounded-md px-4 items-center justify-start'>

            <TextInput ref={otpInputRef} hasTVPreferredFocus={true} value={otp} onChangeText={newText => { handleOTPChange(newText) }}
              className='w-full text-black text-lg' autoFocus={true} placeholderTextColor={"rgba(169, 169, 169, 1)"} placeholder='Enter Correct OTP' />
          </Pressable>}

          {otpSent && <Pressable
            android_ripple={{
              color: "rgba(255,255,255,0.4)",
              borderless: false,
              radius: 1000,
              foreground: true
            }}
            disabled={otpTimer > 0}
            onPress={() => {
              handleSentOTP()
              setOtpTimer(30);
              setOtpReSent(true);
            }} className='mt-2 px-4 rounded-full overflow-hidden'>

            <Text className='w-full text-white text-sm '>{otpTimer > 0 ? ( otpTimer < 10? ("00:0" + otpTimer): ("00:" + otpTimer)) : "Resend OTP"}</Text>
          </Pressable>}


          <Pressable
            android_ripple={{
              color: "rgba(255,255,255,0.4)",
              borderless: false,
              radius: 1000,
              foreground: true
            }}

            onPress={() => {
              setShowLoader(true);
              newUser ? handleRegisterUser() :
                otpSent ? handleVerifyOTP() : handleSentOTP()
            }}
            className='bg-[#5A4BDA] w-96 h-12 overflow-hidden mt-3 flex-row rounded-lg px-4 items-center justify-start'>
            <Text className='text-white text-center w-full text-base'>{newUser ? "Register" : otpSent ? "Verify OTP" : "Get OTP"}</Text>
          </Pressable>
        </View>
        <View className='w-[60%] flex items-center justify-center'>
          <Image
          className=' w-full h-full'
            source={require('../assets/otpIllustration.png')}
          />
        </View>
      </View>
    </ImageBackground>
  );
}
