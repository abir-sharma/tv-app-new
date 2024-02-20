import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { ItemType } from '../../types/types';
import { useNavigation } from '@react-navigation/native';
// @ts-expect-error
import defaultIcon from '../../assets/TV.png';

type NotePropType = {
  noteList: ItemType[] | null,
}

export const OfflineNoteComponent = ({ noteList }: NotePropType) => {

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
        navigation.navigate('PDFViewer', { pdfUrl: item?.path });
      }}>
      <View>
        <View>
          {item.defaultThumbnail ? <Image
            style={{ width: '100%', height: 142, objectFit: 'cover', borderRadius: 5 }}
            source={{ uri: `${item?.thumbnail}` }}
          /> : <Image
            style={{ width: '100%', height: 142, objectFit: 'contain', borderRadius: 5 }}
            source={defaultIcon}
          />}
        </View>
        <View style={{ padding: 16, paddingTop: 0 }}>
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
        data={noteList?.sort((a, b) => {
          const nameA = a?.name?.toUpperCase(); // Ignore case
          const nameB = b?.name?.toUpperCase();

          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0; // Names are equal
        })}
        renderItem={renderGridItem}
        numColumns={4}
      // onEndReached={() => { loadMore && getPaidBatches() }}
      // contentContainerStyle={styles.container}
      />
    </View>
  );
};
