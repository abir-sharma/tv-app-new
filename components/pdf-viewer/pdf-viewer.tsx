import { View, Dimensions, Text, Pressable } from "react-native";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Pdf from 'react-native-pdf';
import { useState } from "react";

export default function PDFViewer({ route }: any) {

  let pdfUrl = route?.params?.pdfUrl;
  // console.log("PDF URL: ", pdfUrl);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);

  const handleNextPage = (e:any) => {
    if(currentPage>=maxPage) return;
    setCurrentPage(prev=>prev+1)
  };
  const handlePrevPage = (e:any) => {
    if(currentPage<=1) return;
    setCurrentPage(prev=>prev-1)
  };

  return (
    <View>
      <View className="flex-row absolute bottom-2 left-2 z-[2]">
        <Pressable
        android_ripple={{
          color: "rgba(255,255,255,0.8)",
          borderless: false,
          radius: 1000,
          foreground: true
        }}
        className=" bg-black/70 border-[1px] border-gray-500 rounded-lg px-4 py-1 overflow-hidden" onPress={handlePrevPage}><Text className="text-xl font-bold text-white">Prev</Text></Pressable>
        <Pressable
        android_ripple={{
          color: "rgba(255,255,255,0.8)",
          borderless: false,
          radius: 1000,
          foreground: true
        }}
        className=" bg-black/70 border-[1px] border-gray-500 rounded-lg px-4 py-1 ml-2 overflow-hidden" onPress={handleNextPage}><Text className="text-xl font-bold text-white">Next</Text></Pressable>
      </View>
      <Pdf
        onLoadComplete={(numberOfPages,filePath)=>{
          // console.log(`number of pages: ${numberOfPages}`);
          setMaxPage(numberOfPages);
        }}
        page={currentPage}
        enablePaging={true}
        onPageSingleTap={(e)=>{handleNextPage(e)}}
        trustAllCerts={false}
        style={{
          height: "100%",
          // width: windowWidth,
          backgroundColor: "black"
        }} source={{ uri: pdfUrl, cache: true }} />
    </View>
  );
}
