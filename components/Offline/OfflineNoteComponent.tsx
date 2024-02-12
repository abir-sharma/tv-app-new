import React, { Dispatch, SetStateAction } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { ItemType, NoteType, VideoType } from '../../types/types';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../../context/MainContext';

type NotePropType = {
  noteList: ItemType[] | null,
  // setNoteList: Dispatch<SetStateAction<NoteType[] | null>>,
  // loadMore: boolean,
  // getPaidBatches: any
}

export const OfflineNoteComponent = ({ noteList }: NotePropType) => {

  const { mainNavigation, batchDetails } = useGlobalContext();
  const navigation = useNavigation();

  //   console.log("Video List: ", videoList);


  const renderGridItem = ({ item }: any) => (
    <Pressable
      style={{ flex: 1 / 4 }}
      className=' m-1 overflow-hidden rounded-3xl bg-white/5'
      android_ripple={{
        color: "rgba(255,255,255,0.4)",
        borderless: false,
        radius: 1000,
        foreground: true
      }}
      hasTVPreferredFocus onPress={() => {
        // console.log("Go to PDF Viewer", item.homeworkIds[0].attachmentIds[0].baseUrl + item.homeworkIds[0].attachmentIds[0].key);
        // @ts-expect-error
        navigation.navigate('PDFViewer', { pdfUrl: item?.path });
      }}>
      <View>
        <View>
          {item?.thumbnail && <Image
            style={{ width: '100%', height: 170, objectFit: 'cover', borderRadius: 5 }}
            source={{ uri: `${item?.thumbnail}` }}
          />}
        </View>
        <View style={{ padding: 16 }}>
          <Text className='text-sm text-white font-medium my-2'>{item?.name?.length >= 60 ? `${item?.name?.substring(0, 60)}...` : item?.name}</Text>
          <View className='bg-white/5 rounded-xl flex-row justify-between items-center px-3 py-2 mt-3' >
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
      {/* <Text style={styles.subjectText}>Physics</Text> */}
      <FlatList
        data={noteList}
        renderItem={renderGridItem}
        keyExtractor={(item: any) => item.id}
        numColumns={4}
      // onEndReached={() => { loadMore && getPaidBatches() }}
      // contentContainerStyle={styles.container}
      />
    </View>
  );
};
