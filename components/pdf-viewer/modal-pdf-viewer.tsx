import React, { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  BackHandler,
  Alert,
  Pressable,
} from "react-native";
// import { useNavigation } from "@react-navigation/native";
import { Config, DocumentView, RNPdftron } from "react-native-pdftron";
import { useGlobalContext } from "../../context/MainContext";

const myToolItem = {
    [Config.CustomToolItemKey.Id]: 'add_page',
    [Config.CustomToolItemKey.Name]: 'Add page',
    [Config.CustomToolItemKey.Icon]: 'ic_add_blank_page_white'
  };

  const myBackToolItem = {
    [Config.CustomToolItemKey.Id]: 'go_back',
    [Config.CustomToolItemKey.Name]: 'Go Back',
    [Config.CustomToolItemKey.Icon]: 'ic_arrow_back_white_24dp'
  };
  
  
  const myToolbar = {
    [Config.CustomToolbarKey.Id]: 'myToolbar',
    [Config.CustomToolbarKey.Name]: 'myToolbar',
    [Config.CustomToolbarKey.Icon]: Config.ToolbarIcons.FillAndSign,
    [Config.CustomToolbarKey.Items]: [
      myBackToolItem,
      Config.Tools.annotationCreateFreeHand,
      Config.Tools.annotationCreateFreeHighlighter,
      Config.Tools.annotationEraserTool,
      Config.Tools.annotationCreateLine,
      Config.Tools.annotationCreateEllipse
    ]
  };

const ModalPDFViewer = ({ pdfUrl }: any) => {

  // Using useState hook to manage state
  // const [permissionGranted, setPermissionGranted] = useState(Platform.OS === 'ios' ? true : false);

  // const navigation = useNavigation();

  const { setMainNavigation, setLogs, mainNavigation, setHeaders } = useGlobalContext();

  useEffect(() => {
    // Using useEffect hook for side effects (similar to componentDidMount)
    RNPdftron.initialize("Insert commercial license key here after purchase");
    RNPdftron.enableJavaScript(true);

    // Uncomment this section if you want to request storage permissions on Android
    // const requestStoragePermission = async () => {
    //   if (Platform.OS === 'android') {
    //     try {
    //       const granted = await PermissionsAndroid.request(
    //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    //       );
    //       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //         setPermissionGranted(true);
    //         console.log("Storage permission granted");
    //       } else {
    //         setPermissionGranted(false);
    //         console.log("Storage permission denied");
    //       }
    //     } catch (err) {
    //       console.warn(err);
    //     }
    //   }
    // };
    // requestStoragePermission();
  }, []); // Empty dependency array means this effect runs once on mount

  const onLeadingNavButtonPressed = () => {
    console.log("leading nav button pressed");
    if (Platform.OS === "ios") {
      Alert.alert(
        "App",
        "onLeadingNavButtonPressed",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: true }
      );
    } else {
      BackHandler.exitApp();
    }
  };

  // Uncomment this section if you want to show a permission request screen
  // if (!permissionGranted) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>
  //         Storage permission required.
  //       </Text>
  //     </View>
  //   )
  // }

  const path =
    "https://pdftron.s3.amazonaws.com/downloads/pl/PDFTRON_mobile_about.pdf";

  return (
    <>
    <DocumentView
      document={pdfUrl}
    //   showLeadingNavButton={true}
    //   hidePresetBar={true}
    //   hideAnnotationToolbarSwitcher={true}
      hideTopToolbars={false}
      hideTopAppNavBar={true}
      hideToolbarsOnTap={true}
      backgroundColor={{red: 0, green: 255, blue: 0}}
      annotationToolbars={[myToolbar]}
      forceAppTheme={Config.ThemeOptions.ThemeLight}
      leadingNavButtonIcon={
        Platform.OS === "ios"
          ? "ic_close_black_24px.png"
          : "ic_arrow_back_white_24dp"
      }
      annotationMenuItems={[Config.AnnotationMenu.search, Config.AnnotationMenu.share]}
      onLeadingNavButtonPressed={onLeadingNavButtonPressed}
    />
    <Pressable className="w-10 h-10 rounded-full absolute top-1 left-1" onPress={()=>{
      // navigation.goBack()
    }}></Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
});

export default ModalPDFViewer;