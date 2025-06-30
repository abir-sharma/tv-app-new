import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  sample: {
    color: 'red',
  },
  backgroundVideo: {
    position: 'absolute',
    // flex: 1,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,    
    // height: 200,
    // width: '100%',
    // backgroundColor: '#0569FF',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  youtubePlayer: {
    width: '100%', // Adjust the width as needed
    height: 200, // Adjust the height as needed
  },
});

export default styles;
