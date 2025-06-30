/// <reference types="nativewind/types" />

import { useEffect, useState } from "react";                                           //L1 used
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useGlobalContext } from "../../context/MainContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { fromCSS } from "@bacons/css-to-expo-linear-gradient";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

export default function Recent() {
  const navigation = useNavigation();
  const { recentVideoLoad } = useGlobalContext();
  const [recentVideos, setRecentVideos] = useState<{
    [key: string]: VideoType[];
  } | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("recentVideos").then((value) => {
      if (value) {
        setRecentVideos(JSON.parse(value));
      }
    });
  }, [recentVideoLoad]);
  

    const getProgressPercentage = (videos: VideoType[]) => {               //Yaha pe Logic dalna hai ki video ka progress kaise nikalna hai                          

         return Math.floor(Math.random() * 80) + 10; 
  };
  return (
    <View className="">
      <Text className="text-black text-2xl font-medium ml-5">
        Continue Learning
      </Text>
      <View className=" p-5 my-2 flex-none overflow-hidden">
        {recentVideos && Object.entries(recentVideos).length>4 ? <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          className="gap-x-4"
        >
          {recentVideos &&
            Object.entries(recentVideos).map(([subject, videos], index) => (
              <Pressable
                key={index}
                hasTVPreferredFocus={true}
                android_ripple={{
                  color: "rgba(255,255,255,0.5)",
                  borderless: false,
                  radius: 1000,
                  foreground: true,
                }}
                onPress={async () => {
                  // @ts-expect-error
                  navigation.navigate("Video", {
                    lectureDetails: videos[0]?.videoDetails,
                    subject: subject,
                    isRecentVideo: true
                  });
                }}
                className=" rounded-lg h-fit w-72 overflow-hidden"
              >
                
                {/* @ts-expect-error */}
                <LinearGradient
                  {...fromCSS(
                    `linear-gradient(152.97deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)`
                  )}
                  className="rounded-xl overflow-hidden border-[1px] border-black bg-[#fffbe6]"
                >
                  <View className="relative">
                    <View className="w-full aspect-video rounded-t-xl overflow-hidden relative">
                      {videos[0]?.videoDetails?.image && (
                        <Image
                          className=" w-full h-full object-cover rounded-t-lg "
                          source={{ uri: `${videos[0]?.videoDetails?.image}` }}
                        />
                      )}
                       <View className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded">
                        <Text className="text-white text-xs font-medium">
                          {videos[0]?.videoDetails?.duration}
                        </Text>
                      </View>
                    </View>

                    <View className="p-2 relative px-5">
                      <View className="flex flex-col items-center justify-start gap-1">
                        <Text className="text-black text-xs font-bold">
                          {subject}-({videos?.length})
                        </Text>
                        
                        <Text className="text-base text-black font-normal mb-0">
                          {videos[0]?.videoDetails?.name?.length >= 25
                            ? `${videos[0]?.videoDetails?.name?.substring(
                                0,
                                25
                              )}...`
                            : videos[0]?.videoDetails?.name}
                        </Text>
                        <View className="w-full">
                          <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <View className="h-full bg-[#f9c545] rounded-full" style={{ width: `${getProgressPercentage(videos)}%` }}/>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </Pressable>
            ))}
        </ScrollView>:
        <View
          className="gap-x-4 flex flex-row"
        >
          {recentVideos &&
            Object.entries(recentVideos).map(([subject, videos], index) => (
              <Pressable
                key={index}
                hasTVPreferredFocus={true}
                android_ripple={{
                  color: "rgba(255,255,255,0.5)",
                  borderless: false,
                  radius: 1000,
                  foreground: true,
                }}
                onPress={async () => {
                  // @ts-expect-error
                  navigation.navigate("Video", {
                    lectureDetails: videos[0]?.videoDetails,
                    subject: subject,
                    isRecentVideo: true
                  });
                }}
                className=" rounded-lg h-fit w-72 overflow-hidden"
              >

                {/* @ts-expect-error */}
                <LinearGradient
                  {...fromCSS(
                    `linear-gradient(152.97deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%)`
                  )}
                  className="rounded-xl overflow-hidden border-[1px] border-black bg-[#fffbe6]"
                >
                  <View className="relative">
                    <View className="w-full aspect-video rounded-t-xl overflow-hidden relative">
                      {videos[0]?.videoDetails?.image && (
                        <Image
                          className=" w-full h-full object-cover rounded-t-lg "
                          source={{ uri: `${videos[0]?.videoDetails?.image}` }}
                        />
                      )}
                       <View className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded">
                        <Text className="text-white text-xs font-medium">
                          {videos[0]?.videoDetails?.duration}
                        </Text>
                       </View>                      
                    </View>
                    <View className="p-2 relative px-5">
                      <View className="flex flex-col items-center justify-start gap-1">
                        <Text className="text-black text-xs font-bold">
                          {subject}-({videos?.length})
                        </Text>

                        <Text className="text-base text-black font-normal mb-0">
                          {videos[0]?.videoDetails?.name?.length >= 25
                            ? `${videos[0]?.videoDetails?.name?.substring(
                                0,
                                25
                              )}...`
                            : videos[0]?.videoDetails?.name}
                        </Text>
                        <View className="w-full">
                          <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <View className="h-full bg-[#f9c545] rounded-full" style={{ width: `${getProgressPercentage(videos)}%` }}/>
                          </View>
                        </View>                        
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </Pressable>
            ))}
        </View>}
      </View>
    </View>
  );
}
