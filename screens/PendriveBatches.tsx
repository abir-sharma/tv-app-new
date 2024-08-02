import React, { useState, useEffect } from 'react';
import { fromCSS } from '@bacons/css-to-expo-linear-gradient';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import { FileSystem } from 'react-native-file-access';
import Navbar from '../components/Global/Navbar';
import { Images } from '../images/images';
import { useGlobalContext } from '../context/MainContext';

type OfflineBatches = {
  name: string,
  thumbnail: string | null
}

type PendriveBatchesPropType = {
  navigation: any
}

const PendriveBatches = ({ navigation }: PendriveBatchesPropType) => {
  const [offlineBatches, setOfflineBatches] = useState<OfflineBatches[]>([]);
  const { setOfflineSubjects, setOfflineSelectedSubject, setOfflineChapters, setOfflineSelectedChapter, setOfflineLectures, setOfflineNotes, setOfflineDppPdf, setOfflineDppVideos, PENDRIVE_BASE_URL } = useGlobalContext();

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
          path: path + "/" +item,
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

  useEffect(() => {
    getBatches();
  }, []);

  useEffect(() => {
    getBatches();
  }, [PENDRIVE_BASE_URL])

  return (
    <LinearGradient
      {...fromCSS(`linear-gradient(276.29deg, #2D3A41 6.47%, #2D3A41 47.75%, #000000 100%)`)}
      className=" flex-1">
      <Navbar />
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className='gap-x-4'>
        {offlineBatches?.map((batch: any, index: number) => (
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
              getSubjects(PENDRIVE_BASE_URL + '/' + batch?.name + '/');
              navigation.navigate('PendriveBatchDetails', { 
                batch: batch
              });
            }}
            className='bg-white/10 rounded-xl h-52 w-72 overflow-hidden'
          >
            <LinearGradient
              {...fromCSS(
                `linear-gradient(152.97deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)`
              )}
              className='rounded-xl overflow-hidden h-52 border-[1px] border-white/30'
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
                  <Text className='text-white text-lg font-base text-center'>{batch?.name >= 20 ? `${batch?.name?.substring(0, 20)}...` : batch?.name}</Text>
                </View>
              </View>
            </LinearGradient>
          </Pressable>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({})

export default PendriveBatches;
