import React, { useEffect, useState } from "react";
import { View, Text, Button, TextInput } from "react-native";
import useUdpClient from "../hooks/useUdpClient";

export default function Test() {
  const { message, sendMessageToServer } = useUdpClient();
  const [serverIp, setServerIp] = useState("192.168.29.246");
  const [messageToSend, setMessageToSend] = useState("");

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Test Screen</Text>
      <Text>Received Message: {message}</Text>
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginVertical: 10,
          paddingHorizontal: 10,
          width: "80%",
        }}
        placeholder="Enter server IP"
        onChangeText={setServerIp}
        value={serverIp}
      />
      <TextInput
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginVertical: 10,
          paddingHorizontal: 10,
          width: "80%",
        }}
        placeholder="Enter message"
        onChangeText={setMessageToSend}
        value={messageToSend}
      />
      <Button
        title="Send Message to Server"
        onPress={() => sendMessageToServer(messageToSend, serverIp)}
      />
    </View>
  );
}