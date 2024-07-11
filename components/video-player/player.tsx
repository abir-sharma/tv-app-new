import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, Text, ActivityIndicator, Pressable, Image, TouchableOpacity, StyleSheet, Modal, FlatList, TouchableWithoutFeedback } from "react-native";
import { WebView } from "react-native-webview";
import styles from "./player.style";
import Svg, { Path } from "react-native-svg";
import axios from "axios";
import { Video, ResizeMode } from "expo-av";
import { cookieSplitter } from "./cookie-splitter";
import { useGlobalContext } from "../../context/MainContext";
import { Slider } from "@miblanchard/react-native-slider";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const playbackSpeedOptions = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function VideoPlayer(props: any) {
  const { mainNavigation, selectedBatch, headers } = useGlobalContext();
  const playerRef = useRef<Video | null>(null);
  const [spinner, setSpinner] = useState<any>();
  const [src, setSrc] = useState<any>(undefined);
  const [cookieParams, setCookieParams] = useState<any>(undefined);
  const [renderVideo, setRenderVideo] = useState<boolean>(false);
  const [noVideoAvailable, setNoVideoAvailable] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(true);
  let isYoutubeVideo = !props?.lectureDetails?.types;

  const [currentTime, setCurrentTime] = useState(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [quality, setQuality] = useState(720);
  const [storedTimestamp, setStoredTimestamp] = useState(0);

  const [annotations, setAnnotations] = useState<{ [key: number]: string[] }>({});
  const [currentPath, setCurrentPath] = useState<string>("");
  const [tool, setTool] = useState<string | null>(null);
  const [allowAnnotations, setAllowAnnotations] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(props.smallPlayer ? false : true);
  const [showControls, setShowControls] = useState<boolean>(true);

  const onTouchStart = (event: any) => {
    if (!allowAnnotations) return;
    const { locationX, locationY } = event.nativeEvent;
    if (tool === "eraser") {
      erasePath(locationX, locationY);
    } else {
      setCurrentPath(`M ${locationX},${locationY}`);
    }
  };

  const onTouchMove = (event: any) => {
    if (!allowAnnotations) return;
    const { locationX, locationY } = event.nativeEvent;
    if (tool === "eraser") {
      erasePath(locationX, locationY);
    } else {
      setCurrentPath((prevPath) => `${prevPath} L ${locationX},${locationY}`);
    }
  };

  const onTouchEnd = () => {
    if (!allowAnnotations) return;
    if (tool === "pen") {
      setAnnotations((prevAnnotations) => ({
        ...prevAnnotations,
        [currentPage]: [...(prevAnnotations[currentPage] || []), currentPath],
      }));
      setCurrentPath("");
    }
  };

  const erasePath = (x: number, y: number) => {
    const updatedPaths = (annotations[currentPage] || []).filter((path) => {
      const commands = path.split(/(?=[ML])/);
      for (let i = 0; i < commands.length; i++) {
        const [command, coords] = commands[i].split(" ");
        const [pathX, pathY] = coords.split(",");
        if (
          Math.abs(x - Number(pathX)) <= 10 &&
          Math.abs(y - Number(pathY)) <= 10
        ) {
          return false;
        }
      }
      return true;
    });
    setAnnotations((prevAnnotations) => ({
      ...prevAnnotations,
      [currentPage]: updatedPaths,
    }));
  };

  const clearAll = () => {
    setAnnotations((prevAnnotations) => ({
      ...prevAnnotations,
      [currentPage]: [],
    }));
  };

  const switchTool = (selectedTool: string) => {
    if (tool === selectedTool) {
      setTool(null);
      setAllowAnnotations(false);
    } else {
      setTool(selectedTool);
      setAllowAnnotations(true);
    }
  };

  useEffect(()=>{
    if(allowAnnotations){
      pauseVideo();
    }
  }, [allowAnnotations])

  const [modalVisible, setModalVisible] = useState(false);
  const qualityOptions = [240, 360, 480, 720];

  const handleQualityChange = (selectedQuality: number) => {
    setQuality(selectedQuality);
    setStoredTimestamp(currentTime);
    setModalVisible(false);
  };

  const renderQualityOption = ({ item }: any) => (
    <Pressable
      onPress={() => handleQualityChange(item)}
      className="p-2 border-b border-gray-300/50"
    >
      <Text className="text-[#7363FC] text-center">{`${item}p`}</Text>
    </Pressable>
  );

  function convertToSeconds(timeString: string) {
    const [hours, minutes, seconds] = timeString?.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  function formatTime(milliseconds: number) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
  }

  function padZero(number: number) {
    return number.toString().padStart(2, "0");
  }

  const MPDTesting = async (mpdUrl: string) => {
    const m3u8url = convertMPDToM3U8(mpdUrl);
    try {
      if(!m3u8url) return;
      const res = await axios.get(m3u8url);
    } catch (err) {
    }
  };

  useEffect(() => {
    if(props.scheduleDetails.videoContentId) {
      const { videoUrl } = props.scheduleDetails.videoContentId.content[0];
      let m3u8Url = convertMPDToM3U8(videoUrl);
      if(!m3u8Url) return;
      setSrc(m3u8Url);
      sendAnalyticsData(m3u8Url);
      setRenderVideo(true);
      setSpinner(false);
      return;
    }
    // MPD testing
    MPDTesting(props?.lectureDetails?.videoUrl);
    setDuration(convertToSeconds(props?.lectureDetails?.duration));
    setSpinner(true);
    if (!props?.lectureDetails?.videoUrl && props?.lectureDetails?.types) {
      setNoVideoAvailable(true);
      setSpinner(false);
      return;
    }
    if (isYoutubeVideo) {
      setShowControls(false);
      setShowLoader(false);
      setAllowAnnotations(false);
      setSrc(props?.lectureDetails?.embedCode);
      setRenderVideo(true);
      setSpinner(false);
      return;
    }
    if (props.isLive) {
      setSrc(props?.lectureDetails?.videoUrl);
      // sendAnalyticsData(props?.lectureDetails?.videoUrl);
      setRenderVideo(true);
      setSpinner(false);
      return;
    } else {
      let m3u8Url = convertMPDToM3U8(props?.lectureDetails?.videoUrl);
      if(!m3u8Url) return;
      setSrc(m3u8Url);
      sendAnalyticsData(m3u8Url);
      // getSignedUrlCookie(m3u8Url);
      setRenderVideo(true);
      setSpinner(false);
    }
  }, [quality, props]);

  const togglePlaybackSpeed = () => {
    //gets the next playback speed index
    const nextSpeedIndex = playbackSpeedOptions.indexOf(playbackSpeed) + 1;
    if (nextSpeedIndex < playbackSpeedOptions.length) {
      playerRef.current &&
        playerRef.current.setRateAsync(
          playbackSpeedOptions[nextSpeedIndex],
          true
        );
      setPlaybackSpeed(playbackSpeedOptions[nextSpeedIndex]);
    }
    else {
      playerRef.current &&
        playerRef.current.setRateAsync(playbackSpeedOptions[0], true);
      setPlaybackSpeed(playbackSpeedOptions[0]);
    }
  };

  const playVideo = () => {
    setIsPlaying(true);
    (playerRef.current as Video | null)?.playAsync();
    setAllowAnnotations(false);
    setTool(null);
    setAnnotations({})
  };

  const pauseVideo = () => {
    setIsPlaying(false);
    (playerRef.current as Video | null)?.pauseAsync();
  };

  const skipForward = (skipTime: number) => {
    (playerRef.current as Video | null)?.getStatusAsync().then((status) => {
      const newPosition = Math.max(
        (status as any).positionMillis + skipTime,
        0
      );
      (playerRef.current as Video | null)?.setPositionAsync(newPosition);
    });
  };

  const skipBackward = (skipTime: number) => {
    (playerRef.current as Video | null)?.getStatusAsync().then((status) => {
      const newPosition = Math.min(
        (status as any).positionMillis - skipTime,
        (status as any).durationMillis
      );
      (playerRef.current as Video | null)?.setPositionAsync(newPosition);
    });
  };

  function convertMPDToM3U8(mpdUrl: string) {
    if(!mpdUrl) return;
    let match;
    try {
      const idRegex = /\/([0-9a-f-]+)\/master\.mpd$/i;
      match = mpdUrl.match(idRegex);
    }
    catch (e) {
      console.error("Unexpected error occured!", e);
      return;
    }
    if (match) {
      const id = match[1];
      const m3u8Url = `https://sec1.pw.live/${id}/hls/${quality}/main.m3u8`;
      // const m3u8Url = `https://sec1.pw.live/${id}/master.m3u8`;
      return m3u8Url;
    } else {
      return "Invalid MPD URL";
    }
  }

  useEffect(() => {
    if(!isYoutubeVideo){
      if(props.scheduleDetails.videoContentId)
        setSrc(convertMPDToM3U8(props.scheduleDetails.videoContentId.content[0].videoUrl));
      else
        setSrc(convertMPDToM3U8(props?.lectureDetails?.videoUrl));
    }
  }, [quality]);

  async function sendAnalyticsData(uri: string) {
    const newHeaders = {
      "Content-Type": "application/json",
      Authorization: headers.Authorization,
      "Client-Type": "WEB",
    };
    const data = {
      url: uri,
    };
    axios.post("https://api.penpencil.co/v3/files/send-analytics-data", data, {
        headers: newHeaders,
      })
      .then((response) => {
        const cookie = cookieSplitter(response?.data?.data);
        getM3U8WithCookie(uri, cookieSplitter(response?.data?.data));
        setCookieParams(cookie);
        setRenderVideo(true);
      })
      .catch((error) => {
        console.error("analytics failed --->", error?.response?.data);
      });
  }

  const handlePlaybackStatusUpdate = useCallback((status: any) => {
    if (status.isPlaying) {
      setCurrentTime(status.positionMillis);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setShowControls(false), 15000);
    return () => clearInterval(interval);
  }, [isActive]);

  function getM3U8WithCookie(src: string, cookieParams: string) {
    axios
      .get(src, {
        headers: {
          cookie: cookieParams,
        },
      })
      .then((res) => {
      })
      .catch((err) => {
      });
  }

  useEffect(() => {
    let animationFrameId: number;
    const updateTime = () => {
      playerRef.current?.getStatusAsync().then((status: any) => {
        setCurrentTime(status.positionMillis);
        if (isPlaying) {
          animationFrameId = requestAnimationFrame(updateTime);
        }
      });
    };
  
    if (isPlaying) {
      updateTime();
    }
  
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying]);

  return (
    <View
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ minHeight: "100%" }}
      className={` h-full ${props.smallPlayer == 1 ? "bg-white": "bg-[#1a1a1a]"}`}
    >
      {showLoader && (
        <View
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            zIndex: 10,
            height: "100%",
            width: "100%",
            alignContent: "center",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
          className="bg-white/10"
        >
          <ActivityIndicator color={"#FFFFFF"} size={80} />
        </View>
      )}

      {props.smallPlayer == 0 && <Pressable
        android_ripple={{
          color: "rgba(255,255,255,0.5)",
          borderless: false,
          radius: 1000,
          foreground: true,
        }}
        onPress={() => {
          mainNavigation.goBack();
        }}
        className="bg-black/40 overflow-hidden rounded-full z-[3] p-2 absolute top-2 left-2"
      >
        <Image
          source={require("../../assets/exit.png")}
          width={30}
          height={30}
          className="h-[30] w-[30]"
        />
      </Pressable>}

      {!isYoutubeVideo && props.smallPlayer && showControls && <Pressable
        android_ripple={{
          color: "rgba(255,255,255,0.5)",
          borderless: false,
          radius: 1000,
          foreground: true,
        }}
        onPress={()=>{
          setIsPlaying(false);
          // @ts-ignore
          mainNavigation.navigate("Videos", {
          lectureDetails: props.lectureDetails,
          scheduleDetails: props.scheduleDetails,
          });}}
        className="bg-black/40 overflow-hidden rounded-full z-[3] p-2 absolute top-2 left-2"
      >
        <MaterialIcons name="fullscreen" size={28} color="white" />
      </Pressable>}
      {!isYoutubeVideo && showControls && (props.smallPlayer == 0 ) && (
        <View className="flex-row absolute top-2 right-2 z-[5]">
          <Pressable
            android_ripple={{
              color: "rgba(255,255,255,0.8)",
              borderless: false,
              radius: 1000,
              foreground: true,
            }}
            className={` ${
              tool === "pen" ? "bg-[#7363FC]" : "bg-black/80"
            }  border-[1px] border-[#7363FC] rounded-full flex items-center justify-center w-12 h-12 ml-2 overflow-hidden`}
            onPress={() => switchTool("pen")}
          >
            <FontAwesome
              name="pencil"
              size={24}
              color={tool === "pen" ? "white" : "#7363FC"}
            />
          </Pressable>
          <Pressable
            android_ripple={{
              color: "rgba(255,255,255,0.8)",
              borderless: false,
              radius: 1000,
              foreground: true,
            }}
            className={`${
              tool === "eraser" ? "bg-[#7363FC]" : "bg-black/80"
            }  border-[1px] border-[#7363FC] rounded-full flex items-center justify-center w-12 h-12 ml-2 overflow-hidden`}
            onPress={() => switchTool("eraser")}
          >
            <FontAwesome5
              name="eraser"
              size={24}
              color={tool === "eraser" ? "white" : "#7363FC"}
            />
          </Pressable>
        </View>
      )}
      { !isYoutubeVideo && showControls && props?.currentVideos?.length > 1 && (
        <View className="bg-black/60 overflow-hidden rounded-xl z-[3] p-1.5 absolute bottom-12 mb-1 left-2">
          <View className="flex flex-row gap-2 items-center justify-center">
            <TouchableOpacity
              className="bg-black px-4 py-2 rounded-full overflow-hidden"
              onPress={props?.handlePrevious}
              disabled={props.currentIndex === 0}
            >
              <AntDesign name="stepbackward" size={20} color="#7363FC" />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-black px-4 py-2 rounded-full overflow-hidden"
              onPress={props?.handleNext}
              disabled={props?.currentIndex === props?.currentVideos.length - 1}
            >
              <AntDesign name="stepforward" size={20} color="#7363FC" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Pressable
        onPress={() => {
          setIsActive(!isActive);
          setShowControls((prev) => !prev);
        }}
        className={`bg-transparent overflow-hidden w-screen h-screen absolute top-0 left-0 duration-300  z-[2]`}
      >
      </Pressable>
      {!isYoutubeVideo && showControls && props.smallPlayer == 0 && (
        <Pressable
          className={`bg-black/80 absolute overflow-hidden rounded-xl flex flex-row items-center px-1 pl-2 py-1  duration-300 bottom-12 mb-1 z-[3] right-2`}
        >
          <Pressable
            android_ripple={{
              color: "rgba(255,255,255,0.5)",
              borderless: false,
              radius: 1000,
              foreground: true,
            }}
            onPress={() => {
              setIsMuted(!isMuted);
            }}
            className="p-1 rounded-lg overflow-hidden w-10 flex items-center justify-center"
          >
            {isMuted ? (
              <FontAwesome5 name="volume-mute" size={24} color="#7363FC" />
            ) : volume < 0.3 ? (
              <FontAwesome5 name="volume-off" size={24} color="#7363FC" />
            ) : volume >= 0.3 && volume < 0.7 ? (
              <FontAwesome5 name="volume-down" size={24} color="#7363FC" />
            ) : (
              <FontAwesome5 name="volume-up" size={24} color="#7363FC" />
            )}
          </Pressable>

          <View className="w-40">
            <Slider
              containerStyle={styles2.slider}
              minimumValue={0}
              maximumValue={1}
              value={volume}
              onValueChange={(value: any) => {
                setVolume(+value);
              }}
              onSlidingComplete={(value: any) => {
                setVolume(+value);
                setIsMuted(false);
              }}
              minimumTrackTintColor="#7363FC"
              maximumTrackTintColor="#AAA"
              thumbTintColor="#7363FC"
            />
          </View>
          <Text className="text-white w-10">{Math.round(volume * 100)}%</Text>
        </Pressable>
      )}
      {!isYoutubeVideo && showControls && (
        <View className={`absolute ${props.smallPlayer == 1 && " scale-90 "} bottom-2 left-0 z-[2] w-full rounded-xl flex-col items-center justify-center px-2`}>
          <View className="flex-row bg-black/50 rounded-xl p-2">
            <View>
              {props.smallPlayer == 0 && <Pressable
                onPress={() => setModalVisible(true)}
                className="bg-black/90 overflow-hidden rounded-full w-12 h-12 flex mr-2 items-center justify-center"
              >
                <Text className="text-sm text-[#7363FC] font-bold mb-1 overflow-hidden">{`${quality}p`}</Text>
              </Pressable>}

              <Modal
                visible={modalVisible}
                animationType="fade"
                transparent
                onRequestClose={() => setModalVisible(false)}
              >
                <TouchableWithoutFeedback
                  onPress={() => setModalVisible(false)}
                >
                  <View style={{ flex: 1 }}>
                    <View className="bg-black/90 w-20 absolute bottom-16 left-96 rounded-lg m-4 ml-16 mb-8 border-[#7363FC]/40 border-[1px]">
                      <FlatList
                        data={qualityOptions}
                        renderItem={renderQualityOption}
                        keyExtractor={(item) => item.toString()}
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            </View>
            <Pressable
              android_ripple={{
                color: "rgba(255,255,255,0.5)",
                borderless: false,
                radius: 1000,
                foreground: true,
              }}
              onPress={() => {
                setIsActive(!isActive);
                skipBackward(30000);
              }}
              className="bg-black/90 overflow-hidden rounded-full p-2"
            >
              <Image
                source={require("../../assets/30b.png")}
                width={30}
                height={30}
                className="h-[30] w-[30]"
              />
            </Pressable>
            <Pressable
              android_ripple={{
                color: "rgba(255,255,255,0.5)",
                borderless: false,
                radius: 1000,
                foreground: true,
              }}
              onPress={() => {
                setIsActive(!isActive);
                skipBackward(10000);
              }}
              className="bg-black/90 overflow-hidden rounded-full ml-2 p-2"
            >
              <Image
                source={require("../../assets/10b.png")}
                width={30}
                height={30}
                className="h-[30] w-[30]"
              />
            </Pressable>
            <Pressable
              android_ripple={{
                color: "rgba(255,255,255,0.5)",
                borderless: false,
                radius: 1000,
                foreground: true,
              }}
              onPress={() => {
                setIsActive(!isActive);
                isPlaying ? pauseVideo() : playVideo();
              }}
              className="bg-black/90 overflow-hidden rounded-full ml-2 p-2"
            >
              <Image
                source={
                  isPlaying
                    ? require("../../assets/pause.png")
                    : require("../../assets/play.png")
                }
                width={30}
                height={30}
                className="h-[30] w-[30]"
              />
            </Pressable>
            <Pressable
              android_ripple={{
                color: "rgba(255,255,255,0.5)",
                borderless: false,
                radius: 1000,
                foreground: true,
              }}
              onPress={() => {
                setIsActive(!isActive);
                skipForward(10000);
              }}
              className="bg-black/90 overflow-hidden rounded-full ml-2 p-2"
            >
              <Image
                source={require("../../assets/10f.png")}
                width={30}
                height={30}
                className="h-[30] w-[30]"
              />
            </Pressable>
            <Pressable
              android_ripple={{
                color: "rgba(255,255,255,0.5)",
                borderless: false,
                radius: 1000,
                foreground: true,
              }}
              onPress={() => {
                setIsActive(!isActive);
                skipForward(30000);
              }}
              className="bg-black/90 overflow-hidden rounded-full ml-2 p-2"
            >
              <Image
                source={require("../../assets/30f.png")}
                width={30}
                height={30}
                className="h-[30] w-[30]"
              />
            </Pressable>

            {props.smallPlayer == 0 && <Pressable
              onPress={() => {
                togglePlaybackSpeed();
              }}
              className="bg-black/90 overflow-hidden rounded-full w-12 h-12 flex ml-2 items-center justify-center"
            >
              <Text className=" text-sm text-[#7363FC] font-bold mb-1 overflow-hidden">{`${playbackSpeed}x`}</Text>
            </Pressable>}
          </View>
          <View className="flex-row bg-black/50 rounded-xl mt-2 px-5 w-full mx-5">
            <View className="flex flex-row justify-between items-center w-full">
              <Text className="text-white">{formatTime(currentTime)}</Text>
              <View className="flex-1">
                <Slider
                  containerStyle={styles2.slider}
                  minimumValue={0}
                  maximumValue={duration * 1000}
                  value={currentTime}
                  onValueChange={(value: any) => {
                    playerRef.current &&
                      playerRef.current.setPositionAsync(+value);
                    setCurrentTime(+value);
                  }}
                  onSlidingComplete={(value: any) => {
                    playerRef.current &&
                      playerRef.current.setPositionAsync(+value);
                    setCurrentTime(+value);
                  }}
                  minimumTrackTintColor="#7363FC"
                  maximumTrackTintColor="#AAA"
                  thumbTintColor="#7363FC"
                />
              </View>
              <Text className="text-white">{formatTime(duration * 1000)}</Text>
            </View>
          </View>
        </View>
      )}
      <ActivityIndicator
        style={{ display: spinner ? "flex" : "none", marginTop: 100 }}
        size="small"
        color="#0569FF"
        animating={spinner}
      />
      {noVideoAvailable && (
        <View style={{ alignItems: "center", marginTop: 100 }}>
          <Text style={{ fontSize: 16, color: "#757575" }}>
            No video available
          </Text>
        </View>
      )}
      {isYoutubeVideo && (
        <View style={{ height: "100%", zIndex: 10 }}>
          <WebView
            style={{ flex: 1 }}
            source={{ uri: src }}
          />
        </View>
      )}
      <View
        className="flex-1"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {renderVideo && (
        <Video
          source={{
            uri: src,
            headers: {
              cookie: cookieParams,
              Authorization: headers?.Authorization,
            },
          }}
          onLoadStart={() => {
            playerRef.current &&
              playerRef.current.setPositionAsync(storedTimestamp);
            setCurrentTime(storedTimestamp);
          }}
          style={styles.backgroundVideo}
          ref={playerRef}
          useNativeControls={false}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          resizeMode={ResizeMode.CONTAIN}
          onError={(err: string) => {
            console.error("Video Player Error --->", err, `${cookieParams}`)
          }}
          isMuted={isMuted}
          shouldPlay={isPlaying}
          volume={volume}
          onLoad={() => setShowLoader(false)}
        />
      )}
        {allowAnnotations && (
          <Svg className=" absolute top-0 left-0 right-0 bottom-0">
            {(annotations[currentPage] || []).map((path, index) => (
              <Path key={index} d={path} stroke="red" strokeWidth={3} fill="none" />
            ))}
            {currentPath !== '' && (
              <Path d={currentPath} stroke="red" strokeWidth={3} fill="none" />
            )}
          </Svg>
        )}
      </View>
      
    </View>
  );
}

const styles2 = StyleSheet.create({
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#000",
  },
  controlButton: {
    flex: 1,
    width: "100%",
    marginHorizontal: 10,
  },
  playbackSpeedText: {
    color: "white",
    fontSize: 16,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    alignSelf: "center",
    backgroundColor: "black",
    padding: 10,
  },
  slider: {
    marginHorizontal: 10,
  },
  timeText: {
    color: "white",
    fontSize: 12,
  },
});
