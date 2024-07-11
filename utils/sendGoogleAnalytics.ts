import AsyncStorage from "@react-native-async-storage/async-storage";
import analytics from "@react-native-firebase/analytics";
import moment from "moment";

const sendGoogleAnalytics = async (eventName: string, data: EventData) => {
  if (!data.timestamp) {
    data.timestamp = moment().format();
  }

  if (!data.registered_phone_number) {
    const phoneNumber = await AsyncStorage.getItem('phone');
    data.registered_phone_number = phoneNumber || "not_logged_in";
  }
  
  await analytics().logEvent(eventName, data);
};

export default sendGoogleAnalytics;
