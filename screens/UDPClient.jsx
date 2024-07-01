import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import UdpSocket from 'react-native-udp';

export default function UDPClient() {
  const [message, setMessage] = useState('');
  const [ipServer, setIpServer] = useState('192.168.29.246');
  const [text, setText] = useState('');
  const [client, setClient] = useState(null);

  useEffect(() => {
    const udpClient = UdpSocket.createSocket('udp4');
    udpClient.bind(8887);

    udpClient.on('message', (message, remoteInfo) => {
      setMessage(message.toString());
    });

    setClient(udpClient);

    return () => {
      udpClient.close();
    };
  }, []);

  const sendMessage = () => {
    if (client) {
      client.send(text, undefined, undefined, 8888, ipServer, (error) => {
        if (error) {
          console.log('Error sending message:', error);
        } else {
          console.log('Message sent successfully');
        }
      });
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginVertical: 10, paddingHorizontal: 10, width: '80%' }}
        placeholder="Enter server IP"
        onChangeText={setIpServer}
        value={ipServer}
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginVertical: 10, paddingHorizontal: 10, width: '80%' }}
        placeholder="Enter message"
        onChangeText={setText}
        value={text}
      />
      <Button title="Send Message to Server" onPress={sendMessage} />
      <Text>Received Message: {message}</Text>
    </View>
  );
}