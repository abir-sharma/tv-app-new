import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { fromCSS } from '@bacons/css-to-expo-linear-gradient';
import sendGoogleAnalytics from '../../utils/sendGoogleAnalytics';
import { useGlobalContext } from '../../context/MainContext';
import { Images } from '../../images/images';
import sendMongoAnalytics from '../../utils/sendMongoAnalytics';

export const NoteComponent = ({ noteList, loadMore, getPaidBatches }: NoteComponentPropType) => {
  const { selectedBatch, selectedChapter, selectedSubject, selectedMenu } = useGlobalContext();
  const navigation = useNavigation();

  const renderGridItem = (item: HomeworkItem) => (
    <View
      className='w-[25%] px-2 py-2'
    >
      <Pressable
        className=' overflow-hidden rounded-xl border-[1px] border-black bg-[#fbfaef]'
        android_ripple={{
          color: "rgba(255,255,255,0.4)",
          borderless: false,
          radius: 1000,
          foreground: true
        }}
        hasTVPreferredFocus
        onPress={() => {
          // @ts-expect-error
          navigation.navigate('PDFViewer', {
            // pdfUrl: item?.homeworkIds[0]?.attachmentIds[0]?.baseUrl + item?.homeworkIds[0]?.attachmentIds[0]?.key
            pdfUrl: item.attachmentIds[0]?.baseUrl + item.attachmentIds[0]?.key
          });
          sendGoogleAnalytics("note_opened", {
            note_name: item?.topic,
            note_id: item?._id,
            batch_name: selectedBatch?.name,
            subject_name: selectedSubject?.subject,
            chapter_name: selectedChapter?.name,
            isDppPdf: selectedMenu === 3 ? true : false,
            batchId: selectedBatch?._id,
          });
          sendMongoAnalytics("note_opened", {
            noteName: item?.topic,
            noteId: item?._id,
            batchName: selectedBatch?.name,
            subjectName: selectedSubject?.subject,
            chapterName: selectedChapter?.name,
            isDppPdf: selectedMenu === 3 ? true : false,
            batchId: selectedBatch?._id,
          });
        }}>
        <LinearGradient {...fromCSS(`linear-gradient(179deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)`)}
          className='rounded-xl overflow-hidden'>
          <View style={{ padding: 16 }}>
            <Text className='text-sm text-black font-semibold'>{item?.topic?.length >= 40 ? `${item?.topic?.substring(0, 40)}...` : item?.topic}</Text>

            <LinearGradient {...fromCSS(`linear-gradient(179deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 100%)
)`)}
              className='overflow-hidden rounded-xl flex-row justify-between items-center px-3 py-2 mt-3 border border-b-[4px]'>
              <View
                className='flex-row justify-center gap-x-2 overflow-hidden rounded-xl w-fit items-center '>
                <Image source={Images.notesVector} className='w-5 h-5 top-1' width={10} height={10} />
                <Text className=' overflow-hidden rounded-xl text-black'>Notes</Text>
              </View>
              <Image source={Images.arrowRight} className='w-2 h-2' width={40} height={40} />
            </LinearGradient>
          </View>
        </LinearGradient>
      </Pressable>
    </View>
  );

  const getHomeWorkList = (noteList: NoteType[] | null) => {
    const homeworkList: HomeworkItem[] = [];
    noteList?.map((note: NoteType) => {
      note?.homeworkIds?.map((homework: HomeworkItem) => {
        homeworkList.push(homework);
      });
    });
    return homeworkList;
  }

  return (
    <View className='p-5'>
      {noteList?.length === 0 && <Text className='text-black text-2xl self-center items-center' >No notes available!!</Text>}
      <FlatList
        data={getHomeWorkList(noteList)}
        renderItem={({ item }) => renderGridItem(item)}
        keyExtractor={(item: HomeworkItem) => item?._id}
        numColumns={4}
        onEndReached={() => { loadMore && getPaidBatches() }}
      />
    </View>
  );
};
