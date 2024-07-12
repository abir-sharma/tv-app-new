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
  const { setOfflineSubjects, setOfflineSelectedSubject, setOfflineChapters, setOfflineSelectedChapter, setOfflineLectures } = useGlobalContext();

  const getBatches = async () => {
    const listing = await FileSystem.ls('/storage/emulated/0/Download/Batches/Batches');
    let batches: OfflineBatches[] = [];
    listing.map((batch) => {
      if (!batch?.endsWith('.png')) {
        if (batch.startsWith('.')) return;
        const checkThumbnail = listing.includes(batch + '.png');
        batches.push({
          name: batch,
          thumbnail: checkThumbnail ? '/storage/emulated/0/Download/Batches/Batches/' + batch + '.png' : null,
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
  }

  const getLectures = async (path: string) => {
    let directoryItems: any[] = await FileSystem.ls(path);
    directoryItems = directoryItems.filter((lecture) => !lecture.startsWith('.'));
    const lecturesData: ItemType2[] = [];
    directoryItems?.map((lecture, index) => {
      if (!lecture?.name?.endsWith('.png')) {
        const checkThumbnail = isThumbnailAvailable(directoryItems, lecture?.name?.slice(0, -4) + '.png');
        lecturesData?.push({
          name: lecture,
          path: path + "/" + lecture,
          id: index,
          thumbnail: checkThumbnail ? path + lecture?.name + '.png' : Images.tv,
          defaultThumbnail: checkThumbnail
        })
      }
    })
    setOfflineLectures(lecturesData);
  }

  const isThumbnailAvailable = (directoryItems: any[], toFind: string) => {
    for (let i = 0; i < directoryItems.length; i++) {
      if (directoryItems[i].name === toFind) {
        return true;
      }
    }
    return false;
  }

  useEffect(() => {
    getBatches();
  }, []);

  return (
    <LinearGradient
      {...fromCSS(`linear-gradient(276.29deg, #2D3A41 6.47%, #2D3A41 47.75%, #000000 100%)`)}
      className=" flex-1">
      <Navbar />
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className='gap-x-4'>
        {offlineBatches?.map((batch: any, index: number) => (
          console.log(batch),
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
              getSubjects('/storage/emulated/0/Download/Batches/Batches/' + batch?.name + '/');
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
                    ...(batch?.thumbnail ? { source: { uri: batch?.thumbnail } } : { source: Images.tv })
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
