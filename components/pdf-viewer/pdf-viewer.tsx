import { View, Text, Pressable, ActivityIndicator, Image } from "react-native";
import Pdf from 'react-native-pdf';
import { useState } from "react";
import { useGlobalContext } from "../../context/MainContext";

export default function PDFViewer({ route }: any) {

  let pdfUrl = route?.params?.pdfUrl;

  const { setMainNavigation, setLogs, mainNavigation, setHeaders } = useGlobalContext();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [showLoader, setShowLoader] = useState<boolean>(true);

  const handleNextPage = (e: any) => {
    if (currentPage >= maxPage) return;
    setCurrentPage(prev => prev + 1)
  };
  const handlePrevPage = (e: any) => {
    if (currentPage <= 1) return;
    setCurrentPage(prev => prev - 1)
  };

  return (
    <View className="flex-1">
      {showLoader && <View
        style={{ position: 'absolute', left: 0, top: 0, zIndex: 10, height: '100%', width: '100%', alignContent: 'center', flex: 1, alignItems: 'center', justifyContent: 'center' }}
        className='bg-white/10 '
      >
        <ActivityIndicator color={"#FFFFFF"} size={80} />
      </View>}
      <View className="flex-row absolute top-2 left-2 z-[2]">
      <Pressable
        android_ripple={{
          color: "rgba(255,255,255,0.5)",
          borderless: false,
          radius: 1000,
          foreground: true
        }}
        onPress={() => { mainNavigation.goBack() }} className='bg-black/80 overflow-hidden rounded-full z-[2] p-2 absolute top-2 left-2'
      >
        <Image
          source={require('../../assets/exit.png')}
          width={30}
          height={30}
          className='h-[30] w-[30]'
        />
      </Pressable>
      </View>
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
        onLoadComplete={(numberOfPages, filePath) => {
          setMaxPage(numberOfPages);
          setShowLoader(false);
        }}
        page={currentPage}
        enablePaging={true}
        onPageSingleTap={(e) => { handleNextPage(e) }}
        trustAllCerts={false}
        style={{
          height: "100%",
          backgroundColor: "black"
        }} source={{ uri: pdfUrl, cache: true }} />
    </View>
  );
}
