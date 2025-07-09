import React, { useEffect } from 'react';
import { io } from 'socket.io-client';
import { AppState } from 'react-native';

const SOCKET_URL = 'https://pibox-backend.betterpw.live';

const StatusUpdater = ({ schoolId }: { schoolId: string }) => {
  useEffect(() => {
    console.log('📱 StatusUpdater: initializing with schoolId:', schoolId);
   
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      query: { schoolId },
    });
    
    socket.on('connect', () => {
      console.log('✅ Connected to socket');
      socket.emit('join', schoolId);
    });

    socket.on('connect_error', (error) => {
      console.log('Connection error:', error.message);
    });
 
    socket.on('disconnect', (reason) => {
      console.log('⚠️ Disconnected from socket: ',reason);
    });

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        console.log('App active - reconnecting socket');
        socket.connect();
        socket.emit('device_online', { schoolId });
      } else if (nextAppState === 'background' || nextAppState === 'inactive') {
        console.log('App inactive');
        socket.disconnect();
      }
    });

    return () => {
      socket.disconnect();
      subscription.remove();
    };
  }, [schoolId]);

  return null; // No UI needed
};

export default StatusUpdater;
