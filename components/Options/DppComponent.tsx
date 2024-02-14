import React, { Dispatch, SetStateAction } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Pressable } from 'react-native';
import { NoteType, VideoType } from '../../types/types';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from '../../context/MainContext';

type DPPPropType = {
    noteList: NoteType[] | null,
    setNoteList: Dispatch<SetStateAction<NoteType[] | null>>,
    loadMore: boolean,
    getPaidBatches: any
}

export const DppComponent = ({noteList, setNoteList, loadMore, getPaidBatches}: DPPPropType) => {

  const {mainNavigation, batchDetails} = useGlobalContext();
  const navigation = useNavigation();

  const getDPP = async () => {
    try{

    }
    catch(err){
        console.log("Error in getDPP:", err);   
    }
  }
  

  const renderGridItem = ({ item }: any) => (
    <Pressable
      style={{flex: 1/4}}
      className=' my-1 mr-5 overflow-hidden h-20 rounded-xl bg-white/5'
      android_ripple={{
        color: "rgba(255,255,255,0.4)",
        borderless: false,
        radius: 1000,
        foreground: true
      }}
      hasTVPreferredFocus
      onPress={()=>{
        mainNavigation.navigate('Tests');
        }}>
        <View className='w-full h-full flex-row justify-between items-center px-5'>
            <View>
                <Text className='text-white font-medium text-lg'>{"Basic Maths & Calculus : DPP 01  (MCQ Quiz)"}</Text>
                <View className='flex-row'><Image source={require('../../assets/noteIcon.png')} className='w-5 h-5 mr-2' width={10} height={10} /><Text className='text-white font-normal text-sm'>{"10 Questions  |  40 Marks"}</Text></View>
            </View>
            <Image source={require('../../assets/goto.png')} className='w-10 h-10' width={10} height={10} />
        </View>
        </Pressable>
    );

    const dppList = [
        {
            _id: "1",
            title: "Basic Maths & Calculus : DPP 01  (MCQ Quiz)",
            date: "2022-09-01"
        },
        {
            _id: "2",
            title: "Basic Maths & Calculus : DPP 02  (MCQ Quiz)",
            date: "2022-09-01"
        },
        {
            _id: "3",
            title: "Basic Maths & Calculus : DPP 01  (MCQ Quiz)",
            date: "2022-09-01"
        }
    ]

  return (
    <View className='pt-5'>
      <FlatList
        data={dppList}
        renderItem={renderGridItem}
        keyExtractor={(item:any) => item._id}
        numColumns={1}
        // onEndReached={()=>{loadMore && getPaidBatches()}}
        // contentContainerStyle={styles.container}
      />
    </View>
  );
};
