import React, { useEffect } from 'react';
import { Button, StyleSheet, View, PermissionsAndroid } from 'react-native';
import { Dirs, FileSystem } from 'react-native-file-access';
import { Video } from 'expo-av';
import Pdf from 'react-native-pdf';

const PendriveBatches = () => {
  const readDir = async () => {
    const dir = await FileSystem.ls('/storage/emulated/0/Download/Batches/Batches/PW-11th-Neet/Botany/Botany Chapter 1/Notes/1.pdf');
    console.log('dir', dir);
  }

  useEffect(() => {
    readDir();
  }, []);

  return (
    <View style={{flex: 1}}>
      {/* <Button title="Read Directory" onPress={readDir} /> */}
      <Video
        source={{ uri: '/storage/emulated/0/Download/Batches/Batches/PW-11th-Neet/Botany/Botany Chapter 1/Lectures/1.mp4' }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        shouldPlay
        isLooping
        style={{ width: '100%', height: '100%', backgroundColor: '#000000' }}
        useNativeControls={true}
      />
      {/* <Pdf source={{ uri: '/storage/emulated/0/Download/Batches/Batches/PW-11th-Neet/Botany/Botany Chapter 1/Notes/1.pdf' }} style={{ flex: 1 }} /> */}
    </View>
  );
}

const styles = StyleSheet.create({})

export default PendriveBatches;
