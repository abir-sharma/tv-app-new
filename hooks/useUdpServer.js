import { useEffect, useState } from 'react';
import { NetworkInfo } from 'react-native-network-info';
import UdpSocket from 'react-native-udp';
import { useGlobalContext } from '../context/MainContext';

export default function useUdpServer() {
  const [connectionStatus, setConnectionStatus] = useState('');
  const [message, setMessage] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [clientInfo, setClientInfo] = useState(null);
  const [server, setServer] = useState(null);
  const { messageFromRemote, setMessageFromRemote } = useGlobalContext();

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
      setMessageFromRemote(data.toString());
    });

    udpServer.on('listening', () => {
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
          console.error('Error sending message:', error);
        } else {
          // console.log('Message sent successfully');
        }
      });
    } else {
      console.error('No client info available');
    }
  };

  return { connectionStatus, message, ipAddress, sendMessageToClient };
}