import AsyncStorage from "@react-native-async-storage/async-storage";
import analytics from "@react-native-firebase/analytics";
import moment from "moment";
import NetInfo from "@react-native-community/netinfo";

interface EventData {
  timestamp?: string;
  registered_phone_number?: string;
  app_version?: string;
  [key: string]: any;
}

const OFFLINE_EVENTS_KEY = 'offline_analytics_events';

const sendGoogleAnalytics = async (eventName: string, data: EventData) => {
  if (!data.timestamp) {
    data.timestamp = moment().format();
  }

  if (!data.registered_phone_number) {
    const phoneNumber = await AsyncStorage.getItem('phone');
    data.registered_phone_number = phoneNumber || "not_logged_in";
  }

  if (!data.app_version) {
    const appVersion = '1.0.7';
    data.app_version = appVersion;
  }

  const isConnected = await NetInfo.fetch().then((state: any) => state.isConnected);

  if (isConnected) {
    await analytics().logEvent(eventName, data);
    await sendOfflineEvents(); // Attempt to send any stored offline events
  } else {
    await storeOfflineEvent(eventName, data);
  }
};

const storeOfflineEvent = async (eventName: string, data: EventData) => {
  try {
    const storedEvents = await AsyncStorage.getItem(OFFLINE_EVENTS_KEY);
    let events = storedEvents ? JSON.parse(storedEvents) : [];
    events.push({ eventName, data });
    await AsyncStorage.setItem(OFFLINE_EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
    console.error('Error storing offline event:', error);
  }
};

const sendOfflineEvents = async () => {
  try {
    const storedEvents = await AsyncStorage.getItem(OFFLINE_EVENTS_KEY);
    if (storedEvents) {
      const events = JSON.parse(storedEvents);
      console.log('sending_offline_analytics_events');
      for (const event of events) {
        await analytics().logEvent(event.eventName, event.data);
      }
      await AsyncStorage.removeItem(OFFLINE_EVENTS_KEY);
    }
  } catch (error) {
    console.error('Error sending offline events:', error);
  }
};

export default sendGoogleAnalytics;
