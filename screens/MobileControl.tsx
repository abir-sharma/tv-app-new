import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { useGlobalContext } from "../context/MainContext";
import useUdpServer from "../hooks/useUdpServer";
import { useNavigation } from "@react-navigation/native";
import sendGoogleAnalytics from "../utils/sendGoogleAnalytics";

export default function MobileControl({ setIsQrModalVisible }: any) {
  const { messageFromRemote } = useGlobalContext();
  const { ipAddress } = useUdpServer();

  const navigation = useNavigation();
  useEffect(() => {
    try {
      if (messageFromRemote && JSON.parse(messageFromRemote)?.type == "qrscan") {
        navigation.goBack();
        sendGoogleAnalytics("mobile_control_connected", {});
      }
    } catch (err) {
      console.error("err while parsing", err);
    }
  }, [messageFromRemote]);

  return (
    <View className="flex-1 justify-center items-center bg-[#111111]">
      <TouchableHighlight
        onPress={() => {
          // setIsQrModalVisible(false);
          navigation.goBack();
        }}
        className="overflow-hidden rounded-full p-2 absolute top-4 left-4"
      >
        <View className="flex-row">
          <Image
            source={require("../assets/back.png")}
            className="w-8 h-8"
            width={10}
            height={10}
          />
        </View>
      </TouchableHighlight>
      <View className="bg-white/5 p-5 rounded-xl">
        <Text className="text-white text-center">{ipAddress}</Text>
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
      <Text className="text-center mx-auto text-red-500 text-base mt-10 bg-red-400/10 rounded-lg px-4 py-2">
        * Make sure you are connected to the same WiFi network
      </Text>
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
