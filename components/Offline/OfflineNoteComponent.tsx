import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { fromCSS } from '@bacons/css-to-expo-linear-gradient';
import { Images } from '../../images/images';

export const OfflineNoteComponent = ({ noteList }: OfflineNoteComponentPropType) => {

  const navigation = useNavigation();

  const renderGridItem = ({ item }: any) => (
    <Pressable
      style={{ flex: 1 / 4 }}
      className=' m-1 overflow-hidden rounded-xl border-[1px] border-white/30'
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
      <LinearGradient {...fromCSS(`linear-gradient(179deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)`)}
          className='rounded-xl overflow-hidden'>
        <View style={{ padding: 16 }}>
          <Text className='text-sm text-white font-medium my-2'>{item?.name?.length >= 60 ? `${item?.name?.substring(0, 60)}...` : item?.name}</Text>

          <LinearGradient {...fromCSS(`linear-gradient(179deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.05) 100%)
)`)}
          className=' overflow-hidden rounded-xl flex-row justify-between items-center px-3 py-2 mt-3'>
          <View
          className='flex-row justify-center gap-x-2 overflow-hidden rounded-xl w-fit items-center '>
            <Image source={Images.notesIcon2} className='w-5 h-5' width={10} height={10} />
            <Text className=' overflow-hidden rounded-xl text-white'>Notes</Text>
        </View>      
              <Image source={Images.goto} className='w-7 h-7' width={40} height={40} />
          </LinearGradient>
        </View>
      </LinearGradient>
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
