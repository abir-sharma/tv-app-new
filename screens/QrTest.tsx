import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useGlobalContext } from "../context/MainContext";
import useUdpServer from "../hooks/useUdpServer";

export default function QRCodeGenerator({ navigation, setIsQrModalVisible }: any) {
  const { setMainNavigation } = useGlobalContext();
  const { message, ipAddress, sendMessageToClient } = useUdpServer();
  const [showNetworkMessage, setShowNetworkMessage] = useState(false);

  useEffect(() => {
    // navigation.setOptions({ headerShown: false });
    setMainNavigation(navigation);
  }, []);

  useEffect(() => {
      setTimeout(() => {
        setShowNetworkMessage(true);
      }, 15000);
  }, [showNetworkMessage]);



  useEffect(() => {
	// try {
	// 	if (message && JSON.parse(message)?.type == "qrscan") {
	// 		AsyncStorage.setItem("token", JSON.parse(message)?.token);
	// 		navigation.navigate("Home");
	// 	}
	// } catch (err) {
	// 	console.log("err while parsing", err);
	// }
  }, [message]);

  return (
    <View className="flex-1 justify-center items-center bg-[#111111]">
      <TouchableHighlight
            onPress={() => {
              // setIsQrModalVisible(false);
              navigation.goBack();
            }}
            className="overflow-hidden rounded-full p-2 absolute top-4 left-4"
          >
            <View className='flex-row'>
              <Image source={require('../assets/back.png')} className='w-8 h-8' width={10} height={10} />
            </View>
          </TouchableHighlight>
      <View className="bg-white/5 p-5 rounded-xl">
		<Text className="text-white text-center">{ipAddress}</Text>
		{/* <Text className="text-white text-center">{message}</Text> */}

        {/* <Text className="border-[1px] text-xl border-white/50 text-center rounded-xl px-5 py-2 text-white mb-5 w-80">
          {ipAddress}
        </Text> */}

        {/* <TouchableOpacity
          style={styles.button}
          onPress={() => {
            generateQRCode(ipAddress);
            console.log("ipAddress", ipAddress);
          }}
        >
          <Text style={styles.buttonText}>Generate QR Code</Text>
        </TouchableOpacity> */}

        {ipAddress && (
          <>
            <Text style={styles.description}>Scan QR Code in your app</Text>

            <View className="bg-white p-5 w-fit mx-auto rounded-xl flex items-center justify-center">
              <QRCode
                value={ipAddress}
                size={200}
                color="black"
                backgroundColor="white"
              />
            </View>
          </>
        )}
      </View>
      {showNetworkMessage && <Text className="text-center mx-auto text-red-500 text-base mt-10 bg-red-400/10 rounded-lg px-4 py-2">* Make sure you are connected to the same WiFi network</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    maxWidth: 300,
    backgroundColor: "#fff",
    borderRadius: 7,
    padding: 20,
    shadowColor: "rgba(0, 0, 0, 0.1)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 30,
  },
  title: {
    fontSize: 21,
    fontWeight: "500",
    marginBottom: 10,
  },
  description: {
    color: "#575757",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    fontSize: 18,
    padding: 17,
    borderWidth: 1,
    borderColor: "#999",
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#7363FC",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  qrCode: {
    marginTop: 20,
    alignItems: "center",
  },
});
