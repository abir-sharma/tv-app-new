import { useEffect, useState } from 'react';
import UdpSocket from 'react-native-udp';

export default function useUdpClient() {
  const [message, setMessage] = useState('');
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

  useEffect(() => {
    sendMessageToServer('Client connected', '192.168.29.246');
  }, [client]);

  const sendMessageToServer = (text, ipServer) => {
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

  return { message, sendMessageToServer };
}