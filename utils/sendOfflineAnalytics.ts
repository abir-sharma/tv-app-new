// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import moment from "moment";

// const sendOfflineAnalytics = async (eventName: string, data: any) => {
//   console.log()
//   function formatEventName(eventName: string) {
//     return eventName
//         .replace(/_/g, " ")    
//         .replace(/\b\w/g, c => c.toUpperCase());  
//   }

//   const schoolData: any = await AsyncStorage.getItem('schoolData');
//   const createdAt = moment().format();

//   try {
//     const res = await axios.post("https://tv-app-analytics-backend.betterpw.live/v1/events/store", {
//       "name": eventName,
//       "title": formatEventName(eventName),
//       "registeredNumber": await AsyncStorage.getItem('phone') || "not_logged_in",
//       "createdAt": createdAt,
//       "school": JSON.parse(schoolData)._id || "not_logged_in",
//       ...data
//     });
//     console.log("Offline analytics sent successfully:", eventName, createdAt);
//   } catch (error: any) {
//     console.error("Error sending offline analytics: ", error.response.data);
//   }
// }

// export default sendOfflineAnalytics;

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import moment from "moment";
import NetInfo from "@react-native-community/netinfo";

interface EventData {
  [key: string]: any;
}

const OFFLINE_EVENTS_KEY = 'offline_analytics_events';

function formatEventName(eventName: string) {
  return eventName
      .replace(/_/g, " ")    
      .replace(/\b\w/g, c => c.toUpperCase());  
}

const sendOfflineAnalytics = async (eventName: string, data: EventData) => {
  const schoolData: any = await AsyncStorage.getItem('schoolData');
  const createdAt = moment().format();
  const registeredNumber = await AsyncStorage.getItem('phone') || "not_logged_in";
  const school = schoolData ? JSON.parse(schoolData)._id || "not_logged_in" : "not_logged_in";
  
  // Prepare the event payload
  const eventPayload = {
    "name": eventName,
    "title": formatEventName(eventName),
    "registeredNumber": registeredNumber,
    "createdAt": createdAt,
    "school": school,
    ...data
  };

  // Check internet connectivity
  const isConnected = await NetInfo.fetch().then((state: any) => state.isConnected);

  if (isConnected) {
    try {
      // Send the current event
      const res = await axios.post("https://tv-app-analytics-backend.betterpw.live/v1/events/store", eventPayload);
      console.log("Analytics sent successfully:", eventName, createdAt);
      
      // Try to send any stored offline events
      await sendStoredOfflineEvents();
    } catch (error: any) {
      console.error("Error sending analytics: ", error?.response?.data || error.message);
    }
  } else {
    // Store the event for later when offline
    await storeOfflineEvent(eventPayload);
    console.log("Stored offline event for later:", eventName);
  }
};

const storeOfflineEvent = async (eventPayload: any) => {
  try {
    // Get currently stored events
    const storedEvents = await AsyncStorage.getItem(OFFLINE_EVENTS_KEY);
    let events = storedEvents ? JSON.parse(storedEvents) : [];
    
    // Add the new event
    events.push(eventPayload);
    
    // Store back to AsyncStorage
    await AsyncStorage.setItem(OFFLINE_EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Error storing offline event:', error);
  }
};

const sendStoredOfflineEvents = async () => {
  try {
    // Get stored events
    const storedEvents = await AsyncStorage.getItem(OFFLINE_EVENTS_KEY);
    
    if (storedEvents) {
      const events = JSON.parse(storedEvents);
      console.log(`Attempting to send ${events.length} stored offline analytics events`);
      
      // Try to send each event
      for (const event of events) {
        try {
          await axios.post("https://tv-app-analytics-backend.betterpw.live/v1/events/store", event);
          console.log("Successfully sent stored event:", event.name, event.createdAt);
        } catch (error: any) {
          console.error("Failed to send stored event:", error?.response?.data || error.message);
          // If we fail, stop the process and keep remaining events for next attempt
          throw error;
        }
      }
      
      // If all events were sent successfully, clear the storage
      await AsyncStorage.removeItem(OFFLINE_EVENTS_KEY);
      console.log("All stored offline events sent successfully");
    }
  } catch (error) {
    console.error('Error processing stored offline events:', error);
  }
};

// Export a function to manually trigger sending stored events
export const forceSendOfflineEvents = async () => {
  const isConnected = await NetInfo.fetch().then((state: any) => state.isConnected);
  if (isConnected) {
    await sendStoredOfflineEvents();
    return true;
  }
  return false;
};

export default sendOfflineAnalytics;