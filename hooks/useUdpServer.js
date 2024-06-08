import { useEffect, useState } from 'react';
import UdpSocket from 'react-native-udp';
import { NetworkInfo } from 'react-native-network-info';

export default function useUdpServer() {
  const [connectionStatus, setConnectionStatus] = useState('');
  const [message, setMessage] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [clientInfo, setClientInfo] = useState(null);
  const [server, setServer] = useState(null);

  useEffect(() => {
    const fetchIpAddress = async () => {
      const ip = await NetworkInfo.getIPV4Address();
      setIpAddress(ip);
    };

    fetchIpAddress();

    const udpServer = UdpSocket.createSocket('udp4');

    udpServer.on('message', (data, rinfo) => {
      setMessage(data.toString());
      setClientInfo(rinfo);
      console.log('Message received:', data.toString());
    });

    udpServer.on('listening', () => {
      console.log('Server listening on port:', udpServer.address().port);
      setConnectionStatus(`Server listening on port ${udpServer.address().port}`);
    });

    udpServer.bind(8888);

    setServer(udpServer);

    return () => {
      udpServer.close();
    };
  }, []);

  const sendMessageToClient = (messageToSend) => {
    if (clientInfo && server) {
      server.send(messageToSend, undefined, undefined, clientInfo.port, clientInfo.address, (error) => {
        if (error) {
          console.log('Error sending message:', error);
        } else {
          console.log('Message sent successfully');
        }
      });
    } else {
      console.log('No client info available');
    }
  };

  return { connectionStatus, message, ipAddress, sendMessageToClient };
}