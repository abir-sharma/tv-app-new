import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import moment from "moment";

const sendMongoAnalytics = async (eventName: string, data: any) => {
  function formatEventName(eventName: string) {
    return eventName
        .replace(/_/g, " ")    
        .replace(/\b\w/g, c => c.toUpperCase());  
  }

  try {
    const res = await axios.post("https://tv-app-analytics-backend.betterpw.live/v1/events/store", {
      "name": eventName,
      "title": formatEventName(eventName),
      "registeredNumber": await AsyncStorage.getItem('phone') || "not_logged_in",
      "createdAt": moment().format(),
      ...data
    });
    console.log("Mongo analytics sent successfully: ", res);
  } catch (error) {
    console.error("Error sending mongo analytics: ", error);
  }
}

export default sendMongoAnalytics;