import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { fromCSS } from "@bacons/css-to-expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useGlobalContext } from "../../context/MainContext";

export default function RecentOffline() {
  const navigation = useNavigation();
  const { selectedClassName, recentVideoLoadOffline } = useGlobalContext();
  const [recentVideos, setRecentVideos] = useState<any[]>([]);
  const [progressMap, setProgressMap] = useState<{ [key: string]: number }>({});


useEffect(() => {
  AsyncStorage.getItem("recentOfflineVideos").then((value) => {
    if (value) {
      const all = JSON.parse(value);
       setRecentVideos(Object.entries(all));
    
    } else {
      setRecentVideos([]);
    }
  });
}, [recentVideoLoadOffline]);

  useEffect(() => {
    const fetchProgress = async () => {
      const newProgressMap: { [key: string]: number } = {};
      for (const [className, video] of recentVideos) {
        const savedData = await AsyncStorage.getItem(
          `video_watch_time_offline${video.path}`
        );
        const watchTime = savedData ? JSON.parse(savedData).watchTime : 0;
        const duration = savedData ? JSON.parse(savedData).duration : 5000;


        const progress =
          duration > 0
            ? Math.min(Math.floor((( watchTime ? Number(watchTime) : 0) / Number(duration)) * 100), 100)
            : 0;
        newProgressMap[video.path] = progress;
      }
      setProgressMap(newProgressMap);
    };
    fetchProgress();
  }, [recentVideos]);

  return (
    <View className="flex-1 mt-5">
     {recentVideos?.length > 0 && <Text className="text-black text-2xl font-medium ml-5">
        Continue Learning
      </Text>}
      {recentVideos?.length > 0 && (
        <View className="p-5 w-full mx-auto mb-3 mt-2 flex-none overflow-hidden">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="gap-x-4"
          >
            {recentVideos.map(([className, video], idx) => (
              <Pressable
                key={idx}
                android_ripple={{
                  color: "rgba(255,255,255,0.5)",
                  borderless: false,
                  radius: 1000,
                  foreground: true,
                }}
                onPress={async () => {
                  // @ts-expect-error
                  navigation.navigate("MP4Player", {
                    videoUrl: video.path,
                    videoName: video.name,
                    className: className,
                  });
                }}
                className="rounded-lg h-fit w-72 overflow-hidden"
              >
                <LinearGradient
                  {...fromCSS(
                    `linear-gradient(152.97deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)`
                  )}
                  className="rounded-xl overflow-hidden border-[1px] border-black bg-[#fffbe6]"
                >
                  <View className="relative">
                    <View className="w-[92%] aspect-video rounded-md overflow-hidden relative mt-2 ml-2 mr-2">
                      {video.defaultThumbnail ? <Image
                        className='w-full h-full '
                        source={{ uri: `file://${video?.thumbnail}` }}/> 
                        : <Image className='w-full h-full '
                                 source={{ uri: `file://${video?.path}` }}
                         />}
       
                    </View>
                    <View className="p-2 relative px-5">
                      <View className="flex flex-col items-center justify-start gap-1">
                        <Text className="text-black text-xs font-bold">{className}</Text>
                        <Text className="text-base text-black font-normal mb-0">
                          {video.name.length >= 25
                            ? `${video.name.substring(0, 25)}...`
                            : video.name}
                        </Text>
                        <View className="w-full">
                          <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <View
                              className="h-full bg-[#f9c545] rounded-full"
                              style={{
                                width: `${progressMap[video.path] || 0}%`,
                              }}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}
