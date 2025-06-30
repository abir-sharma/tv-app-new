//L1 used
import React from 'react';
import { View, Text, Image, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { fromCSS } from '@bacons/css-to-expo-linear-gradient';
import { Images } from '../../images/images';
import sendOfflineAnalytics from '../../utils/sendOfflineAnalytics';
import { useGlobalContext } from '../../context/MainContext';

export const PendriveNoteComponent = ({ noteList }: OfflineNoteComponentPropType) => {
  const { selectedBatch, selectedSubject, selectedChapter, selectedClassName, selectedMenu } = useGlobalContext();

  const navigation = useNavigation();
  
  const renderGridItem = ({ item }: any) => (
    <Pressable
      style={{ flex: 1 / 4 }}
      className=' m-1 overflow-hidden rounded-xl border-[1px] border-black bg-[#fbfaef]'
      android_ripple={{
        color: "rgba(255,255,255,0.4)",
        borderless: false,
        radius: 1000,
        foreground: true
      }}
      hasTVPreferredFocus onPress={() => {
        console.log('PendriveNoteComponent.tsx', item);
        const itemPath = item?.path;
        sendOfflineAnalytics("note_opened", {
            noteName: item?.name,
            // noteId: String(item?.id),
            subjectName: itemPath?.split('/')[7],
            chapterName: itemPath?.split('/')[8],
            isDppPdf: selectedMenu === 3 ? true : false,
            className: selectedClassName,
          });
        // @ts-expect-error
        navigation.navigate('PDFViewer', { pdfUrl: item?.path });
      }}>
      {/* @ts-expect-error */}
      <LinearGradient {...fromCSS(`linear-gradient(179deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)`)}
          className='rounded-xl overflow-hidden'>
        <View style={{ padding: 16 }}>
          <Text className='text-sm text-black font-semibold my-2'>{item?.name?.length >= 60 ? `${item?.name?.substring(0, 60)}...` : item?.name}</Text>

          {/* @ts-expect-error */}
          <LinearGradient {...fromCSS(`linear-gradient(179deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)
)`)}
          className=' overflow-hidden rounded-xl flex-row justify-between items-center px-3 py-2 mt-3 border border-b-[4px]'>
          <View
          className='flex-row justify-center gap-x-2 overflow-hidden rounded-xl w-fit items-center '>
            <Image source={Images.notesVector2} className='w-5 h-5 top-1' width={10} height={10} />
            <Text className=' overflow-hidden rounded-xl text-black'>Notes</Text>
        </View>      
              <Image source={Images.arrowRight} className='w-2 h-2' width={40} height={40} />
          </LinearGradient>
        </View>
      </LinearGradient>
    </Pressable>
  );

  return (
    <View className='p-5'>
      {noteList?.length === 0 && <Text className='text-black text-2xl self-center items-center'>No notes available!!</Text>}
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
