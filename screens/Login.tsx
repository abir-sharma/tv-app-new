/// <reference types="nativewind/types" />

import { View, Text, Image, TextInput, Pressable, TouchableOpacity, Alert, TouchableHighlight, ToastAndroid, ActivityIndicator } from 'react-native';
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


  //Use effect counter that will update a state and count till 30 sec
  useEffect(() => {
    if (otpReSent || otpSent) {
      const interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev === 0) {
            setOtpReSent(false);
            // return 30;
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
    if (phone.length !== 10) {
      // Alert.alert("Please enter a valid mobile number");
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
        organizationId: "5eb393ee95fab7468a79d189"
      })

      console.log("success", res.data);

      if (res.data.success) {
        setOtpSent(true);
      }


    }
    catch (err: any) {
      console.log("Error while sending otp! ", err.res.status);
      if (err.res.status === 429) {
        ToastAndroid.showWithGravity(
          "Too many OTP requests, Please try after sometime",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      } else {
        setNewUser(true);
      }

    }
    setShowLoader(false);

  }

  const handleVerifyOTP = async () => {
    if (otp.length <= 0) {
      // Alert.alert("Please enter a valid OTP");
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
        longitude: 0
      })

      console.log("success: ", res.data.data);


      if (res.data.success) {
        setHeaders({
          "Authorization": `Bearer ${res.data.data.access_token}`
        })
        await AsyncStorage.setItem("token", res.data.data.access_token);
        navigation.navigate('Home');
      }
    }
    catch (err) {
      console.log(err);
      // Alert.alert("Please enter a valid OTP");
      ToastAndroid.showWithGravity(
        "Please enter a correct OTP",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
    setShowLoader(false);
  }

  const handleRegisterUser = async () => {
    if (phone.length !== 10) {
      Alert.alert("Please enter a valid mobile number");
    }
    if (name.length <= 0) {
      Alert.alert("Please enter a valid name");
    }

    setShowLoader(true);
    const nameArray = name.split(' ');
    const firstName = nameArray.shift(); // Remove and return the first element
    const lastName = nameArray.join(' '); // Join the rest with space

    console.log(firstName, " ---- ", lastName);


    try {
      const res = await axios.post("https://api.penpencil.co/v1/users/register/5eb393ee95fab7468a79d189", {
        mobile: phone,
        countryCode: "+91",
        firstName: firstName,
        lastName: lastName
      })

      console.log("success", res.data);

      if (res.data.success) {
        setOtpSent(true);
        setNewUser(false);
      }


    }
    catch (err) {
      console.log(err);
    }
    setShowLoader(false);
  }

  const phoneInputRef = useRef<TextInput>(null);
  const otpInputRef = useRef<TextInput>(null);
  const nameInputRef = useRef<TextInput>(null);

  return (
    <View className="bg-[#1A1A1A] w-full flex-1 items-center justify-center">
      {showLoader && <View
        style={{ position: 'absolute', left: 0, top: 0, zIndex: 10, height: '100%', width: '100%', alignContent: 'center', flex: 1, alignItems: 'center', justifyContent: 'center' }}
        className='bg-white/10 '
      >
        <ActivityIndicator color={"#FFFFFF"} size={80} />
      </View>}
      {/* <Image source= {require('../assets/loginBackdrop.png')} className='w-full h-full absolute top-0 left-0 z-0' width={1920} height={1080} /> */}
      <View className='flex-col items-center relative z-[2]'>
        <Image source={require('../assets/pw-logo.png')} className='w-16 h-16' width={10} height={10} />
        <Text className="text-white text-lg font-normal mt-5"> Welcome to</Text>
        <Text className="text-white text-2xl font-medium mt-2"> Physics Wallah </Text>
        <Text className="text-white text-sm font-normal mt-6"> Please enter your mobile no. to Login  / Register </Text>
        <Pressable
          android_ripple={{
            color: "rgba(255,255,255,0.4)",
            borderless: false,
            radius: 1000,
            foreground: true
          }}
          onPress={() => phoneInputRef.current?.focus()}
          className='bg-black w-80 h-12 mt-3 flex-row rounded-md px-4 items-center justify-start overflow-hidden'

        >
          <View className='flex-row items-center justify-start'>
            <Image source={require('../assets/india.png')} className='w-6 h-6' width={10} height={10} />
            <Text className="text-white text-lg font-semibold mx-2" > +91 </Text>
          </View>
          <TextInput ref={phoneInputRef} hasTVPreferredFocus={true} value={phone} onChangeText={newText => { handleTextChange(newText) }} onFocus={(e) => { console.log("Focused") }}
            className='w-full text-white text-lg' autoFocus={true} placeholderTextColor={"rgba(255,255,255,0.7)"} placeholder='Enter Mobile No.' /></Pressable>


        {newUser && <Pressable
          android_ripple={{
            color: "rgba(255,255,255,0.4)",
            borderless: false,
            radius: 1000,
            foreground: true
          }}
          onPress={() => nameInputRef.current?.focus()} className='bg-black w-80 overflow-hidden h-12 mt-3 flex-row rounded-md px-4 items-center justify-start'>

          <TextInput ref={nameInputRef} hasTVPreferredFocus={true} value={name} onChangeText={newText => { handleNameChange(newText) }}
            className='w-full text-white text-lg' autoFocus={true} placeholderTextColor={"rgba(255,255,255,0.7)"} placeholder='Enter Name' />
        </Pressable>}

        {otpSent && <Pressable
          android_ripple={{
            color: "rgba(255,255,255,0.4)",
            borderless: false,
            radius: 1000,
            foreground: true
          }}
          onPress={() => otpInputRef.current?.focus()} className='bg-black w-80 overflow-hidden h-12 mt-3 flex-row rounded-md px-4 items-center justify-start'>

          <TextInput ref={otpInputRef} hasTVPreferredFocus={true} value={otp} onChangeText={newText => { handleOTPChange(newText) }}
            className='w-full text-white text-lg' autoFocus={true} placeholderTextColor={"rgba(255,255,255,0.7)"} placeholder='Enter Correct OTP' />
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

          <Text className='w-full text-purple-300 text-base '>Resend OTP {otpTimer > 0 && ("in " + otpTimer + "s")}</Text>
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
          className='bg-black w-80 h-12 overflow-hidden mt-3 flex-row rounded-full px-4 items-center justify-start'>
          <Text className='text-white/60 text-center w-full text-base'>{newUser ? "Register" : otpSent ? "Verify OTP" : "Get OTP"}</Text>
        </Pressable>
      </View>
    </View>
  );
}
