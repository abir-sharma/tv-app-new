import React, { Dispatch, SetStateAction } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { NoteType } from '../../types/types';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { fromCSS } from '@bacons/css-to-expo-linear-gradient';

type NotePropType = {
  noteList: NoteType[] | null,
  setNoteList: Dispatch<SetStateAction<NoteType[] | null>>,
  loadMore: boolean,
  getPaidBatches: any
}

export const NoteComponent = ({ noteList, loadMore, getPaidBatches }: NotePropType) => {

  const navigation = useNavigation();

  const renderGridItem = ({ item }: any) => (
    <Pressable
      style={{ flex: 1 / 4 }}
      className=' m-1 overflow-hidden rounded-xl border-[1px] border-white/30'
      android_ripple={{
        color: "rgba(255,255,255,0.1)",
        borderless: false,
        radius: 1000,
        foreground: true
      }}
      hasTVPreferredFocus onPress={() => {
        // @ts-expect-error
        navigation.navigate('PDFViewer', {
          pdfUrl: item?.homeworkIds[0]?.attachmentIds[0]?.baseUrl + item?.homeworkIds[0]?.attachmentIds[0]?.key
        });
      }}>
      <LinearGradient {...fromCSS(`linear-gradient(179deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)`)}
          className='rounded-xl overflow-hidden'>
        <View style={{ padding: 16 }}>
          <Text className='text-sm text-white font-medium my-2'>{item?.homeworkIds[0]?.topic?.length >= 40 ? `${item?.homeworkIds[0]?.topic?.substring(0, 40)}...` : item?.homeworkIds[0]?.topic}</Text>

          <LinearGradient {...fromCSS(`linear-gradient(179deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)
)`)}
          className=' overflow-hidden rounded-xl flex-row justify-between items-center px-3 py-2 mt-3'>
          <View
          className='flex-row justify-center gap-x-2 overflow-hidden rounded-xl w-fit items-center '>
            <Image source={require('../../assets/notesicon2.png')} className='w-5 h-5' width={10} height={10} />
            <Text className=' overflow-hidden rounded-xl text-white'>Notes</Text>
        </View>      
              <Image source={require('../../assets/goto.png')} className='w-7 h-7' width={40} height={40} />
          </LinearGradient>
        </View>
      </LinearGradient>
    </Pressable>
  );

  return (
    <View className='p-5'>
      {noteList?.length === 0 && <Text className='text-white text-2xl self-center items-center' >No notes available!!</Text>}
      <FlatList
        data={noteList?.sort((a, b) => {
          const topicA = a?.homeworkIds[0]?.topic || '';
          const topicB = b?.homeworkIds[0]?.topic || '';
          return topicA?.localeCompare(topicB);
        })}
        renderItem={renderGridItem}
        keyExtractor={(item: NoteType) => item?._id}
        numColumns={4}
        onEndReached={() => { loadMore && getPaidBatches() }}
      />
    </View>
  );
};
