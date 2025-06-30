import React, { useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Image, StyleSheet } from 'react-native';
import Pdf from 'react-native-pdf';
import Svg, { Path } from 'react-native-svg';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { Images } from '../../../images/images';

export default function PDFViewer({ route }: any) {
  let pdfUrl = route?.params?.pdfUrl;
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [annotations, setAnnotations] = useState<{ [key: number]: string[] }>({});
  const [currentPath, setCurrentPath] = useState<string>('');
  const [tool, setTool] = useState<string | null>(null);
  const [allowAnnotations, setAllowAnnotations] = useState<boolean>(false);

  const onTouchStart = (event: any) => {
    if (!allowAnnotations) return;
    const { locationX, locationY } = event.nativeEvent;
    if (tool === 'eraser') {
      erasePath(locationX, locationY);
    } else {
      setCurrentPath(`M ${locationX},${locationY}`);
    }
  };

  const onTouchMove = (event: any) => {
    if (!allowAnnotations) return;
    const { locationX, locationY } = event.nativeEvent;
    if (tool === 'eraser') {
      erasePath(locationX, locationY);
    } else {
      setCurrentPath((prevPath) => `${prevPath} L ${locationX},${locationY}`);
    }
  };

  const onTouchEnd = () => {
    if (!allowAnnotations) return;
    if (tool === 'pen') {
      setAnnotations((prevAnnotations) => ({
        ...prevAnnotations,
        [currentPage]: [...(prevAnnotations[currentPage] || []), currentPath],
      }));
      setCurrentPath('');
    }
  };

  const erasePath = (x: number, y: number) => {
    const updatedPaths = (annotations[currentPage] || []).filter((path) => {
      const commands = path.split(/(?=[ML])/);
      for (let i = 0; i < commands.length; i++) {
        const [command, coords] = commands[i].split(' ');
        const [pathX, pathY] = coords.split(',');
        if (Math.abs(x - Number(pathX)) <= 10 && Math.abs(y - Number(pathY)) <= 10) {
          return false;
        }
      }
      return true;
    });
    setAnnotations((prevAnnotations) => ({
      ...prevAnnotations,
      [currentPage]: updatedPaths,
    }));
  };

  const clearAll = () => {
    setAnnotations((prevAnnotations) => ({
      ...prevAnnotations,
      [currentPage]: [],
    }));
  };

  const switchTool = (selectedTool: string) => {
    if (tool === selectedTool) {
      setTool(null);
      setAllowAnnotations(false);
    } else {
      setTool(selectedTool);
      setAllowAnnotations(true);
    }
  };

  return (
    <View className="flex-1">
      {showLoader && (
        <View
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: 10,
            height: '100%',
            width: '100%',
            alignContent: 'center',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="bg-white/10 "
        >
          <ActivityIndicator color="#FFFFFF" size={80} />
        </View>
      )}
      <View className="flex-row absolute top-2 left-2 z-[2]">
        <Pressable
          android_ripple={{
            color: 'rgba(255,255,255,0.5)',
            borderless: false,
            radius: 1000,
            foreground: true,
          }}
          onPress={() => {
            navigation.goBack();
          }}
          className="bg-black/80 overflow-hidden rounded-full z-[2] p-2 absolute top-2 left-2"
        >
          <Image source={Images.exit} width={30} height={30} className="h-[30] w-[30]" />
        </Pressable>
      </View>
      <View className="flex-row absolute bottom-2 left-2 z-[2]">
        <Pressable
          android_ripple={{
            color: 'rgba(255,255,255,0.8)',
            borderless: false,
            radius: 1000,
            foreground: true,
          }}
          className={` ${tool === 'pen' ? 'bg-[#7363FC]' : 'bg-black/80'}  border-[1px] border-[#7363FC] rounded-full flex items-center justify-center w-12 h-12 ml-2 overflow-hidden`}
          onPress={() => switchTool('pen')}
        >
          <FontAwesome name="pencil" size={24} color={tool === 'pen' ? 'white' : '#7363FC'} />
        </Pressable>
        <Pressable
          android_ripple={{
            color: 'rgba(255,255,255,0.8)',
            borderless: false,
            radius: 1000,
            foreground: true,
          }}
          className={` ${tool === 'eraser' ? 'bg-[#7363FC]' : 'bg-black/80'}  border-[1px] border-[#7363FC] rounded-full flex items-center justify-center w-12 h-12 ml-2 overflow-hidden`}
          onPress={() => switchTool('eraser')}
        >
          <FontAwesome5 name="eraser" size={24} color={tool === 'eraser' ? 'white' : '#7363FC'} />
        </Pressable>
        <Pressable
          android_ripple={{
            color: 'rgba(255,255,255,0.8)',
            borderless: false,
            radius: 1000,
            foreground: true,
          }}
          className={` bg-black/80  border-[1px] border-[#7363FC] rounded-full flex items-center justify-center w-12 h-12 ml-2 overflow-hidden`}
          onPress={clearAll}
        >
          <Entypo name="cross" size={30} color={tool === 'eraser' ? 'white' : '#7363FC'} />
        </Pressable>
      </View>
      <View
        style={styles.drawingArea}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <Pdf
          onLoadComplete={(numberOfPages, filePath) => {
            setMaxPage(numberOfPages);
            setShowLoader(false);
          }}
          page={currentPage}
          trustAllCerts={false}
          style={styles.pdf}
          source={{ uri: pdfUrl, cache: true }}
          onPageChanged={(page, numberOfPages) => {
            setCurrentPage(page);
          }}
        />
        {allowAnnotations && (
          <Svg style={styles.svg}>
            {(annotations[currentPage] || []).map((path, index) => (
              <Path key={index} d={path} stroke="black" strokeWidth={3} fill="none" />
            ))}
            {currentPath !== '' && (
              <Path d={currentPath} stroke="black" strokeWidth={3} fill="none" />
            )}
          </Svg>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawingArea: {
    flex: 1,
  },
  pdf: {
    height: '100%',
    backgroundColor: 'black',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});