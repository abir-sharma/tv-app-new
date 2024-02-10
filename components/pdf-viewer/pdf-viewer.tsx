// import { useState } from "react";
import { Text, View, Dimensions, TouchableOpacity, Image } from "react-native";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import Pdf from 'react-native-pdf';
// import { useNavigation } from "@react-navigation/native";
// import Images from "../../images-teacher/images";
// import styles from "./pdf-viewer.style";
import Constants from 'expo-constants';
// const statusBarHeight = Constants.statusBarHeight;

export default function PDFViewer({ route }: any) {
  let pdfUrl = route?.params?.pdfUrl;
  console.log("PDF URL: ", pdfUrl);

  return (
    <View>
      {/* <Pdf trustAllCerts={false} style={{
        height: windowHeight,
        width: windowWidth,
      }} source={{ uri: pdfUrl, cache: true }} /> */}
    </View>
  );
}
