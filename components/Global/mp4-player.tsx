import React, { useEffect, useRef, useState, useCallback } from "react";
import { Video, ResizeMode } from "expo-av";
import { Text, View, ActivityIndicator, Pressable, Image } from "react-native";
import { useGlobalContext } from "../../context/MainContext";
import { useNavigation } from "@react-navigation/native";
import { Images } from "../../images/images";
import { Slider } from "@miblanchard/react-native-slider";
import Svg, { Path } from "react-native-svg";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import sendOfflineAnalytics from "../../utils/sendOfflineAnalytics";

const MP4Player = ({ route }: any) => {
  const uri = route?.params?.videoUrl;
  const navigation = useNavigation();
  const [showLoader, setShowLoader] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isActive, setIsActive] = useState<boolean>(true);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showControls, setShowControls] = useState<boolean>(true);

  const playerRef = useRef<Video | null>(null);
  let skipTimeout: NodeJS.Timeout | null = null;

  const [currentPath, setCurrentPath] = useState<string>("");
  const [tool, setTool] = useState<string | null>(null);
  const [allowAnnotations, setAllowAnnotations] = useState<boolean>(false);
  const [annotations, setAnnotations] = useState<{[key: number]: { path: string; color: string } []}>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [penColor, setPenColor] = useState<string>("#FF0000");
  const penColors = [
    { color: "#FF0000", name: "Red" },
    { color: "#0000FF", name: "Blue" },
    { color: "#FFFF00", name: "Yellow" },
    { color: "#00FF00", name: "Green" },
  ];
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);

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
    if (tool === "pen" && currentPath) {
      setAnnotations((prevAnnotations) => ({
        ...prevAnnotations,
        [currentPage]: [
          ...(prevAnnotations[currentPage] || []),
          { path: currentPath, color: penColor },
        ],
      }));
      setCurrentPath("");
    }
  };

  const erasePath = (x: number, y: number) => {
    const updatedPaths = (annotations[currentPage] || []).filter((pathObj) => {
      const commands = pathObj.path.split(/(?=[ML])/);
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
    if (tool === selectedTool && !showColorPicker) {
      setTool(null);
      setAllowAnnotations(false);
    } else {
      setTool(selectedTool);
      setAllowAnnotations(true);
    }
  };

  useEffect(() => {
    if (allowAnnotations) {
      pauseVideo();
    }
  }, [allowAnnotations]);

  useEffect(() => {
    const interval = setInterval(() => {
      playerRef.current?.getStatusAsync().then((status: any) => {
        setCurrentTime(status.positionMillis);
        setDuration(status.durationMillis);
      });
    }, 500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlaybackSpeed = () => {
    const options = [0.5, 0.75, 1, 1.25, 1.5, 2];
    const nextIndex = options.indexOf(playbackSpeed) + 1;
    const newSpeed =
      nextIndex < options.length ? options[nextIndex] : options[0];
    setPlaybackSpeed(newSpeed);
    playerRef.current?.setRateAsync(newSpeed, true);
  };

  function formatTime(milliseconds: number) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours > 0 ? hours + ":" : ""}${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }

  const playVideo = () => {
    setIsPlaying(true);
    setAllowAnnotations(false);
    setTool(null);
    setAnnotations({});
    playerRef.current?.setPositionAsync(currentTime).then(() => {
      playerRef.current?.playAsync();
    });
  };

  const pauseVideo = () => {
    setIsPlaying(false);
    (playerRef.current as Video | null)?.pauseAsync();
  };

  const skipForward = (skipTime: number) => {
    if (skipTimeout) clearTimeout(skipTimeout);
    skipTimeout = setTimeout(() => {
      playerRef.current?.getStatusAsync().then((status) => {
        const newPosition = Math.max(
          (status as any).positionMillis + skipTime,
          0
        );
        playerRef.current?.setPositionAsync(newPosition);
      });
    }, 100);
  };

  const skipBackward = (skipTime: number) => {
    if (skipTimeout) clearTimeout(skipTimeout);
    skipTimeout = setTimeout(() => {
      playerRef.current?.getStatusAsync().then((status) => {
        const newPosition = Math.min(
          (status as any).positionMillis - skipTime,
          (status as any).durationMillis
        );
        playerRef.current?.setPositionAsync(newPosition);
      });
    }, 100);
  };

  const handlePlaybackStatusUpdate = useCallback((status: any) => {
    if (status.isPlaying) {
      setCurrentTime(status.positionMillis);
    }
  }, []);

  useEffect(() => {
    if (showControls) {
      const timeout = setTimeout(() => setShowControls(false), 10000);
      return () => clearTimeout(timeout);
    }
  }, [isActive]);

  return (
    <View
      style={{ flex: 1, backgroundColor: "#000000" }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {allowAnnotations && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 15,
            pointerEvents: "none", // ensures touches go to parent View
          }}
        >
          <Svg width="100%" height="100%">
            {(annotations[currentPage] || []).map((item, index) => (
              <Path
                key={index}
                d={item.path}
                stroke={item.color}
                strokeWidth={3}
                fill="none"
              />
            ))}
            {currentPath !== "" && (
              <Path
                d={currentPath}
                stroke={penColor}
                strokeWidth={3}
                fill="none"
              />
            )}
          </Svg>
        </View>
      )}

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
          className="bg-white/10 "
        >
          <ActivityIndicator color={"#FFFFFF"} size={80} />
        </View>
      )}
      <Pressable
        android_ripple={{
          color: "rgba(255,255,255,0.5)",
          borderless: false,
          radius: 1000,
          foreground: true,
        }}
        onPress={() => {
          navigation.goBack();
          sendOfflineAnalytics("video_closed", {
              videoName: route?.params?.videoName,
              className: route?.params?.className,
              subjectName: uri?.split('/')[5],
              chapterName: uri?.split('/')[6],
              isSolutionVideo: route?.params?.isSolutionVideo,
                });
        }}
        className="bg-black/40 overflow-hidden rounded-full z-[2] p-2 absolute top-2 left-2"
      >
        <Image
          source={Images.exit}
          width={30}
          height={30}
          className="h-[30] w-[30]"
        />
      </Pressable>
      <Pressable
        onPress={() => {
          setIsActive(!isActive);
          setShowControls((prev) => !prev);
        }}
        className={`bg-transparent overflow-hidden w-screen h-screen absolute top-0 left-0 duration-300 z-[1]`}
      ></Pressable>

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
          onPress={() => {
            setShowColorPicker(true);
            if (tool !== "pen") {
              switchTool("pen");
            }
          }}
        >
          <FontAwesome
            name="pencil"
            size={24}
            color={tool === "pen" ? penColor : "#7363FC"}
          />
        </Pressable>

        {showColorPicker && tool === "pen" && (
          <View
            style={{
              position: "absolute",
              top: 60,
              right: 20,
              zIndex: 20,
              flexDirection: "row",
              backgroundColor: "rgba(0,0,0,0.8)",
              borderRadius: 30,
              padding: 8,
              alignItems: "center",
            }}
          >
            {penColors.map((c) => (
              <Pressable
                key={c.color}
                onPress={() => {
                  setPenColor(c.color);
                  setShowColorPicker(false);
                }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: c.color,
                  marginHorizontal: 6,
                  borderWidth: penColor === c.color ? 3 : 1,
                  borderColor: penColor === c.color ? "#FFF" : "#333",
                }}
              />
            ))}
          </View>
        )}
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

        <Pressable
          android_ripple={{
            color: "rgba(255,255,255,0.8)",
            borderless: false,
            radius: 1000,
            foreground: true,
          }}
          className="bg-black/80 border-[1px] border-[#7363FC] rounded-full flex items-center justify-center w-12 h-12 ml-2 overflow-hidden"
          onPress={clearAll}
        >
          <FontAwesome5 name="trash" size={22} color="#7363FC" />
        </Pressable>
      </View>

      {showControls && (
        <View
          style={{
            position: "absolute",
            right: 100,
            bottom: 65,
            zIndex: 20,
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: 30,
            padding: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Pressable
            onPress={() => setIsMuted(!isMuted)}
            style={{
              marginRight: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isMuted ? (
              <FontAwesome5 name="volume-mute" size={28} color="#7363FC" />
            ) : volume < 0.3 ? (
              <FontAwesome5 name="volume-off" size={28} color="#7363FC" />
            ) : volume >= 0.3 && volume < 0.7 ? (
              <FontAwesome5 name="volume-down" size={28} color="#7363FC" />
            ) : (
              <FontAwesome5 name="volume-up" size={28} color="#7363FC" />
            )}
          </Pressable>
          <View style={{ width: 100 }}>
            <Slider
              minimumValue={0}
              maximumValue={1}
              value={volume}
              onValueChange={(value) => {
                const vol = Array.isArray(value) ? value[0] : value;
                setVolume(vol);
                setIsMuted(vol === 0);
                playerRef.current?.setVolumeAsync(vol);
              }}
              minimumTrackTintColor="#7363FC"
              maximumTrackTintColor="#AAA"
              thumbTintColor="#7363FC"
            />
          </View>
        </View>
      )}

      {showControls && (
        <View
          style={{
            position: "absolute",
            bottom: 10,
            left: 0,
            right: 0,
            zIndex: 10,
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: 30,
              padding: 6,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Pressable
              android_ripple={{
                color: "rgba(255,255,255,0.2)",
                borderless: false,
                radius: 1000,
                foreground: true,
              }}
              onPress={togglePlaybackSpeed}
              className="bg-black/20 overflow-hidden rounded-full w-12 h-12 flex ml-2 items-center justify-center"
            >
              <Text className=" text-sm text-[#7363FC] font-bold mb-1 overflow-hidden">{`${playbackSpeed}x`}</Text>
            </Pressable>

            <Pressable
              android_ripple={{
                color: "rgba(255,255,255,0.3)",
                borderless: false,
                radius: 1000,
                foreground: true,
              }}
              onPress={() => {
                setIsActive(!isActive);
                skipBackward(10000);
              }}
              className="bg-black/20 overflow-hidden rounded-full ml-2 p-2"
            >
              <Image
                source={Images.tenB}
                width={30}
                height={30}
                className="h-[30] w-[30]"
              />
            </Pressable>

            <Pressable
              android_ripple={{
                color: "rgba(255,255,255,0.3)",
                borderless: false,
                radius: 1000,
                foreground: true,
              }}
              onPress={() => {
                setIsActive(!isActive);
                isPlaying ? pauseVideo() : playVideo();
              }}
              className="bg-black/20 overflow-hidden rounded-full ml-2 p-2"
            >
              <Image
                source={isPlaying ? Images.pause : Images.play}
                width={30}
                height={30}
                className="h-[30] w-[30]"
              />
            </Pressable>

            <Pressable
              android_ripple={{
                color: "rgba(255,255,255,0.3)",
                borderless: false,
                radius: 1000,
                foreground: true,
              }}
              onPress={() => {
                setIsActive(!isActive);
                skipForward(10000);
              }}
              className="bg-black/20 overflow-hidden rounded-full ml-2 p-2"
            >
              <Image
                source={Images.tenF}
                width={30}
                height={30}
                className="h-[30] w-[30]"
              />
            </Pressable>
          </View>
          {/* Seek Bar */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "90%",
              marginTop: 8,
            }}
          >
            <Text style={{ color: "white", width: 50 }}>
              {formatTime(currentTime)}
            </Text>
            <Slider
              containerStyle={{ flex: 1, marginHorizontal: 8 }}
              minimumValue={0}
              maximumValue={duration}
              value={currentTime}
              onValueChange={(value) => {
                const position = Array.isArray(value) ? value[0] : value;
                playerRef.current?.setPositionAsync(position);
                setCurrentTime(position);
              }}
              minimumTrackTintColor="#7363FC"
              maximumTrackTintColor="#AAA"
              thumbTintColor="#7363FC"
            />
            <Text style={{ color: "white", width: 50 }}>
              {formatTime(duration)}
            </Text>
          </View>
        </View>
      )}

      <Video
        source={{ uri: uri }}
        onError={(err: string) => {
          console.error("Video Player Error --->", err);
        }}
        volume={volume}
        isMuted={isMuted}
        shouldPlay={isPlaying}
        ref={playerRef}
        isLooping
        style={{ width: "100%", height: "100%", backgroundColor: "#000000" }}
        useNativeControls={false}
        resizeMode={ResizeMode.CONTAIN}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        onLoadStart={() => {
          setShowLoader(true);
        }}
        onLoad={() => {
          setShowLoader(false);
        }}
      />
    </View>
  );
};

export default MP4Player;
