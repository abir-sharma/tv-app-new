import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, BackHandler, Alert, Pressable, } from "react-native";
import { Config, DocumentView, RNPdftron } from "react-native-pdftron";

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
  useEffect(() => {
    RNPdftron.initialize("Insert commercial license key here after purchase");
    RNPdftron.enableJavaScript(true);
  }, []);

  const onLeadingNavButtonPressed = () => {
    if (Platform.OS === "ios") {
      Alert.alert(
        "App",
        "onLeadingNavButtonPressed",
        [{ text: "OK", onPress: () => { } }],
        { cancelable: true }
      );
    } else {
      BackHandler.exitApp();
    }
  };

  return (
    <>
      <DocumentView
        document={pdfUrl}
        hideTopToolbars={false}
        hideTopAppNavBar={true}
        hideToolbarsOnTap={true}
        backgroundColor={{ red: 0, green: 255, blue: 0 }}
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