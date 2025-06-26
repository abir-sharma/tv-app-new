import React, { useState, useEffect } from 'react';
import { fromCSS } from '@bacons/css-to-expo-linear-gradient';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View, Image, ToastAndroid, Button } from 'react-native';
import { FileSystem } from 'react-native-file-access';
import Navbar from '../components/Global/Navbar';
import { Images } from '../images/images';
import { useGlobalContext } from '../context/MainContext';
import * as Sentry from "@sentry/react-native";
import { useNavigation } from '@react-navigation/native';
import * as ExpoFS from 'expo-file-system';
import RNFS from 'react-native-fs';
import sendOfflineAnalytics from '../utils/sendOfflineAnalytics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

type OfflineBatches = {
  name: string,
  thumbnail: string | null
}

const PendriveBatches = () => {
  const navigation = useNavigation()
  const [offlineBatches, setOfflineBatches] = useState<OfflineBatches[]>([]);
  const { setOfflineSubjects, setOfflineSelectedSubject, setOfflineChapters, setOfflineSelectedChapter, setOfflineLectures, setOfflineNotes, setOfflineDppPdf, setOfflineDppVideos, PENDRIVE_BASE_URL, setPENDRIVE_BASE_URL, isOnline, setSelectedClassName, setHeaders } = useGlobalContext();

  const checkToken = async () => {
    const schoolData = await AsyncStorage.getItem('schoolData');
    const phone = await AsyncStorage.getItem('phone');
    if (!schoolData || !phone) {
      navigation.reset({
        index: 0,
        // @ts-expect-error
        routes: [{ name: 'Login' }],
      });
    }
  }

  useEffect(() => {
    checkToken();
  }, []);

  const getBatches = async () => {
    const listing = await FileSystem.ls(PENDRIVE_BASE_URL);
    let batches: OfflineBatches[] = [];
    listing.map(async (batch) => {
      if (!batch?.endsWith('.png')) {
        if (batch.startsWith('.')) return;
        const checkThumbnail = listing.includes(batch + '.png');
        batches.push({
          name: batch,
          thumbnail: checkThumbnail ? `${PENDRIVE_BASE_URL}/${batch}.png` : null,
        });
      }
    })
    batches.sort((a, b) => a?.name?.localeCompare(b?.name));
    setOfflineBatches(batches);
  }

  const getSubjects = async (path: string) => {
    let listing = await FileSystem.ls(path);
    listing = listing.filter((subject) => !subject.startsWith('.'));
    let subjects: ItemType[] = [];
    listing.map((subject, index) => {
      // if (subject.startsWith('.')) return;
      subjects.push({
        name: subject,
        id: index,
        path: path + subject,
      });
    })
    setOfflineSubjects(subjects);
    setOfflineSelectedSubject(0);
    getChapters(path + subjects[0].name + '/');
  }

  const getChapters = async (path: string) => {
    let listing = await FileSystem.ls(path);
    listing = listing.filter((chapter) => !chapter.startsWith('.'));
    let chapters: ItemType[] = [];
    listing.map((chapter, index) => {
      chapters.push({
        name: chapter,
        id: index,
        path: path + chapter,
      });
    })
    setOfflineChapters(chapters);
    setOfflineSelectedChapter(0);
    getLectures(path + chapters[0].name + '/Lectures');
    getNotes(path + chapters[0].name + '/Notes');
    getDppPdf(path + chapters[0].name + '/DPP');
    getDppVideos(path + chapters[0].name + '/DPP Videos');
  }

  const getLectures = async (path: string) => {
    let directoryItems: any[] = await FileSystem.ls(path);
    directoryItems = directoryItems.filter((lecture) => !lecture.startsWith('.'));
    const lecturesData: ItemType2[] = [];
    directoryItems?.map((lecture, index) => {
      if (!lecture?.endsWith('.png')) {
        const checkThumbnail = isThumbnailAvailable(directoryItems, String(lecture?.slice(0, -4) + '.png'));
        lecturesData?.push({
          name: lecture,
          path: path + "/" + lecture,
          id: index,
          thumbnail: checkThumbnail ? path + "/" + lecture?.slice(0, -4) + '.png' : Images.tv,
          defaultThumbnail: checkThumbnail
        })
      }
    })
    setOfflineLectures(lecturesData);
  }

  const getNotes = async (path: string) => {
    let directoryItems: any[] = await FileSystem.ls(path);
    directoryItems = directoryItems.filter((note) => !note.startsWith('.'));
    const notesData: ItemType2[] = [];
    directoryItems?.map((item, index) => {
      if (!item?.name?.endsWith('.png')) {
        const checkThumbnail = isThumbnailAvailable(directoryItems, item?.name?.slice(0, -4) + '.png');
        notesData?.push({
          name: item,
          path: path + "/" + item,
          id: index,
          thumbnail: checkThumbnail ? path + item + '.png' : Images.tv,
          defaultThumbnail: checkThumbnail
        })
      }
    })
    setOfflineNotes(notesData);
  }

  const getDppPdf = async (path: string) => {
    let directoryItems: any[] = await FileSystem.ls(path);
    directoryItems = directoryItems.filter((dpp) => !dpp.startsWith('.'));
    const dppPdfData: ItemType2[] = [];
    directoryItems?.map((item, index) => {
      if (!item?.name?.endsWith('.png')) {
        const checkThumbnail = isThumbnailAvailable(directoryItems, item?.name?.slice(0, -4) + '.png');
        dppPdfData?.push({
          name: item,
          path: path + "/" + item,
          id: index,
          thumbnail: checkThumbnail ? path + item + '.png' : Images.tv,
          defaultThumbnail: checkThumbnail
        })
      }
    })
    setOfflineDppPdf(dppPdfData);
  }

  const getDppVideos = async (path: string) => {
    let directoryItems: any[] = await FileSystem.ls(path);
    directoryItems = directoryItems.filter((video) => !video.startsWith('.'));
    const dppVideosData: ItemType2[] = [];
    directoryItems?.map((item, index) => {
      if (!item?.name?.endsWith('.png')) {
        const checkThumbnail = isThumbnailAvailable(directoryItems, item?.name?.slice(0, -4) + '.png');
        dppVideosData?.push({
          name: item,
          path: path + "/" + item,
          id: index,
          thumbnail: checkThumbnail ? path + item + '.png' : Images.tv,
          defaultThumbnail: checkThumbnail
        })
      }
    })
    setOfflineDppVideos(dppVideosData);
  }

  const isThumbnailAvailable = (directoryItems: any[], toFind: string) => {
    let flag = directoryItems.find((item) => item === toFind) ? true : false;
    return flag;
  }

  // const detectPendriveSource = async () => {
  //   FileSystem.ls("/mnt/media_rw")
  //     .then(async (files) => {
  //       if (files.length > 0) {
  //         let batchesPd: string = '';
  //         for (const pd of files) {
  //           const ls = await FileSystem.ls(/mnt/media_rw/${pd});
  //           if (ls.includes("Batches")) {
  //             batchesPd = pd;
  //             break;
  //           }
  //         }
  //         if (batchesPd === '') {
  //           ToastAndroid.show("No Batches folder found in any pendrive", ToastAndroid.SHORT);
  //           return;
  //         }
  //         const url = /mnt/media_rw/${batchesPd}/Batches;
  //         // const url = /sdcard/Batches;
  //         setPENDRIVE_BASE_URL(url);
  //         console.log(PENDRIVE_BASE_URL set to: ${url});
  //       } else {
  //         ToastAndroid.show("No pendrive detected", ToastAndroid.SHORT);
  //       }
  //     })
  //     .catch((error) => {
  //       Sentry.captureException(error);
  //       console.error("Error reading /mnt/media_rw:", error);
  //     });
  // }


  const detectPendriveSource = async () => {
    // Solution if the pendrive is listed under /storage
    const externalDirs = await RNFS.getAllExternalFilesDirs();
    for (const dir of externalDirs) {
      const externalDirPath = dir.split('/').slice(0, 3).join('/');
      const batchesFolderPath = `${externalDirPath}/Batches`;
      const exists = await RNFS.exists(batchesFolderPath);
      if (exists) {
        setPENDRIVE_BASE_URL(batchesFolderPath);
        console.log(`PENDRIVE_BASE_URL set to: ${batchesFolderPath}`);
        return;
      }
    }

    // Solution if the pendrive is listed under /mnt/media_rw
    const mediaRW = await RNFS.readDir("/mnt/media_rw");
    if (mediaRW.length === 0) {
      ToastAndroid.show("No pendrive detected", ToastAndroid.SHORT);
      return;
    } else {
      const filesInsideMediaRW = await RNFS.readDir("/mnt/media_rw");
      for (const file of filesInsideMediaRW) {
        const batchesFolderPath = `${file.path}/Batches`;
        const exists = await RNFS.exists(batchesFolderPath);
        if (exists) {
          setPENDRIVE_BASE_URL(batchesFolderPath);
          return;
        }
      }
    }

    // const files = await RNFS.readDir("/mnt/media_rw/3218-08B4");
    // // console.log('files', files);

    // let batchesFolderPath: string = '';
    // for (const file of files) {
    //   console.log('file', file?.name);
    //   if (file?.name === 'Batches') {
    //     batchesFolderPath = file?.path;
    //     break;
    //   }
    // }
    // if (batchesFolderPath === '') {
    //   ToastAndroid.show("No Batches folder found in any pendrive", ToastAndroid.SHORT);
    //   return;
    // } else {
    //   const url = batchesFolderPath;
    //   setPENDRIVE_BASE_URL(url);
    //   console.log(`PENDRIVE_BASE_URL set to: ${url}`);
    // }
  }

  useEffect(() => {
    !isOnline && detectPendriveSource();
  }, [isOnline])

  useEffect(() => {
    getBatches();
  }, [PENDRIVE_BASE_URL])

  return (
    <View className="flex-1">
      <Image 
       source={Images.LoginBg} 
       className='bg-[#fefaee]'                               //-->Color adjust Background ke liye
       style={{
       position: 'absolute',
       width: '100%',
       height: '100%',
      resizeMode: 'cover', 
    }}
    />
      
      <Navbar />
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className='gap-x-4 mx-2 mt-2'>
        {offlineBatches.map((batch: any, index: number) => (
          <Pressable
            key={index}
            hasTVPreferredFocus={true}
            android_ripple={{
              color: "rgba(255,255,255,0.5)",
              borderless: false,
              radius: 1000,
              foreground: true
            }}
            onPress={() => {
              setSelectedClassName(batch?.name);
              sendOfflineAnalytics("batch_opened", {
                className: batch?.name,
              });
              getSubjects(PENDRIVE_BASE_URL + '/' + batch?.name + '/');
              // @ts-ignore
              navigation.navigate('PendriveBatchDetails', {
                batch: batch
              });
            }}
            className='rounded-xl h-52 w-72 overflow-hidden '
          >
            <LinearGradient
              {...fromCSS(
                `linear-gradient(152.97deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)`
              )}
              className='rounded-xl overflow-hidden h-52 border-[1px] border-black bg-[#fffbe6]'
            >
              <View className="w-full aspect-video rounded-t-xl overflow-hidden relative">
                <Image
                  key={index}
                  className="w-full h-full rounded-t-lg"
                  {
                  ...(batch?.thumbnail ? { source: { uri: `file://${batch?.thumbnail}` } } : { source: Images.tv })
                  }
                />
              </View>
              <View className='p-2 relative px-5'>
                <View className='flex flex-row items-center justify-center gap-3'>
                  <Text className='text-black text-lg font-base text-center'>{batch?.name >= 20 ? `${batch?.name?.substring(0, 20)}...` : batch?.name}</Text>
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({})

export default PendriveBatches;