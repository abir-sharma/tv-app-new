import React, { Dispatch, SetStateAction } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { NoteType } from '../../types/types';
import { useNavigation } from '@react-navigation/native';

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
      className=' m-1 overflow-hidden rounded-xl bg-white/5'
      android_ripple={{
        color: "rgba(255,255,255,0.4)",
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
      <View>
        <View style={{ padding: 16 }}>
          <Text className='text-sm text-white font-medium my-2'>{item?.homeworkIds[0]?.topic?.length >= 60 ? `${item?.homeworkIds[0]?.topic?.substring(0, 60)}...` : item?.homeworkIds[0]?.topic}</Text>
          <View className='bg-white/5 rounded-lg flex-row justify-between items-center px-3 py-2 mt-3' >
            <TouchableOpacity onPress={() => {
              console.log("Go to Video Page");
            }}>
              <Image
                style={{ width: 16, height: 16 }}
                source={require('../../assets/pdf.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {
              console.log("Go to Video Page");
            }}>
              <Image
                style={{ width: 16, height: 16 }}
                source={require('../../assets/download.png')}
              />
            </TouchableOpacity>

          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View className='pt-5'>
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
