import { View, Text, Pressable } from "react-native"
import Modal from 'react-native-modal';




export const ReviewOrSubmitModal = (props: any) => {

  const { showModal, setShowModal, responses, handleSubmitTest, seconds } = props;


  const formatTime = () => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <Modal
      isVisible={showModal}
      onBackdropPress={() => {
        setShowModal(false);
      }}
    >
      <View className="p-4 rounded-xl text-white bg-[#414141] w-[400] self-center">
        <View className="flex flex-row justify-between items-center">
          <Text className="text-white text-xl font-bold">Quiz Summary</Text>
          <View className="flex flex-row items-center">
            <Text className="text-white text-xs">Time taken: </Text>
            <Text className="p-1 bg-[#0569FF] text-xs rounded-lg text-white">{formatTime()}</Text>
          </View>
        </View>
        <View className="bg-[#626060] p-4 flex rounded-xl flex-row justify-between mt-6 items-center">
          <Text className=" text-white text-sm">Total Questions</Text>
          <Text className=" text-white text-sm">{responses?.length}</Text>
        </View>
        <View className="bg-[#626060] p-4 flex rounded-xl flex-row justify-between mt-6">
          <Text className=" text-white text-sm">Answered</Text>
          {responses && <Text className=" text-white text-sm">{responses?.filter((response: any) => response?.status === "Attempted")?.length}</Text>}
        </View>
        <View className="bg-[#626060] p-4 flex rounded-xl flex-row justify-between mt-6">
          <Text className=" text-white text-sm">Not Answered</Text>
          {responses && <Text className=" text-white text-sm">{responses?.filter((response: any) => response?.status === "UnAttempted")?.length}</Text>}
        </View>
        <View className="items-center my-6">
          <Text className=" text-white text-sm">Are you sure you want to submit the quiz?</Text>
          {responses && <Text className=" text-white text-sm">No changes will be allowed after submission.</Text>}
        </View>
        <View className="flex flex-row justify-between">
          <Pressable
            hasTVPreferredFocus={true}
            android_ripple={{
              color: "rgba(255,255,255,0.5)",
              borderless: false,
              radius: 2000,
              foreground: true
            }}
            className="overflow-hidden py-2 px-16 self-center"
            onPress={() => setShowModal(false)}
          >
            <Text className="text-white text-md font-bold">
              No
            </Text>
          </Pressable>
          <Pressable
            hasTVPreferredFocus={true}
            android_ripple={{
              color: "rgba(255,255,255,0.5)",
              borderless: false,
              radius: 2000,
              foreground: true
            }}
            className="overflow-hidden py-2 px-16 self-center  bg-[#0569FF]"
            onPress={() => handleSubmitTest()}
          >
            <Text className="text-white text-md font-bold">
              Yes
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}