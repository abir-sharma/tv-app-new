import axios from "axios";
import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
  ReactNode,
  useEffect
} from "react";
import { BatchDetails, BatchType, Order, Subject, TopicType, ItemType, ItemType2, QuizItemType } from "../types/types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";



type GlobalContextType = {
  addModalOpen: boolean;
  setAddModalOpen: Dispatch<SetStateAction<boolean>>;
  subscribedBatches: BatchType[] | null;
  setSubscribedBatches: Dispatch<SetStateAction<BatchType[] | null>>;
  topicList: TopicType[] | null;
  setTopicList: Dispatch<SetStateAction<TopicType[] | null>>;
  selectedDpp: QuizItemType | null;
  setSelectedDpp: Dispatch<SetStateAction<QuizItemType | null>>;
  selectedBatch: BatchType | null;
  setSelectedBatch: Dispatch<SetStateAction<BatchType | null>>;
  batchDetails: BatchDetails | null;
  setBatchDetails: Dispatch<SetStateAction<BatchDetails | null>>;
  selectSubjectSlug: string | null;
  setSelectSubjectSlug: Dispatch<SetStateAction<string | null>>;
  mainNavigation: any;
  setMainNavigation: Dispatch<SetStateAction<any>>;
  headers: any;
  setHeaders: Dispatch<SetStateAction<any>>;
  orders: Order[] | null;
  setOrders: Dispatch<SetStateAction<Order[] | null>>;
  selectedSubject: Subject | null;
  setSelectedSubject: Dispatch<SetStateAction<Subject[] | null>>;
  selectedChapter: TopicType | null;
  setSelectedChapter: Dispatch<SetStateAction<TopicType | null>>;
  isOnline: boolean;
  setIsOnline: Dispatch<SetStateAction<boolean>>;
  showIpInput: boolean;
  setShowIpInput: Dispatch<SetStateAction<boolean>>;
  directoryLevel: number;
  setDirectoryLevel: Dispatch<SetStateAction<number>>;
  offlineCurrentDirectory: string;
  setOfflineCurrentDirectory: Dispatch<SetStateAction<string>>;
  offlineDirectoryListings: any;
  setOfflineDirectoryListings: Dispatch<SetStateAction<any>>;
  offlineBatches: ItemType2[];
  setOfflineBatches: Dispatch<SetStateAction<ItemType2[]>>;
  offlineSelectedBatch: number;
  setOfflineSelectedBatch: Dispatch<SetStateAction<number>>;
  offlineSubjects: ItemType[];
  setOfflineSubjects: Dispatch<SetStateAction<ItemType[]>>;
  offlineSelectedSubject: number;
  setOfflineSelectedSubject: Dispatch<SetStateAction<number>>;
  offlineChapters: ItemType[];
  setOfflineChapters: Dispatch<SetStateAction<ItemType[]>>;
  offlineSelectedChapter: number;
  setOfflineSelectedChapter: Dispatch<SetStateAction<number>>;
  offlineSections: ItemType[];
  setOfflineSections: Dispatch<SetStateAction<ItemType[]>>;
  offlineLectures: ItemType2[];
  setOfflineLectures: Dispatch<SetStateAction<ItemType2[]>>;
  offlineNotes: ItemType2[];
  setOfflineNotes: Dispatch<SetStateAction<ItemType2[]>>;
  offlineDpp: ItemType2[];
  setOfflineDpp: Dispatch<SetStateAction<ItemType2[]>>;
  offlineDppPdf: ItemType2[];
  setOfflineDppPdf: Dispatch<SetStateAction<ItemType2[]>>;
  offlineDppVideos: ItemType2[];
  setOfflineDppVideos: Dispatch<SetStateAction<ItemType2[]>>;
  offlineSelectedSection: number;
  setOfflineSelectedSection: Dispatch<SetStateAction<number>>;
}

const GlobalContext = createContext<GlobalContextType>({
  addModalOpen: false,
  setAddModalOpen: () => { },
  subscribedBatches: null,
  setSubscribedBatches: () => { },
  topicList: null,
  setTopicList: () => { },
  selectedDpp: null,
  setSelectedDpp: () => { },
  selectedBatch: null,
  setSelectedBatch: () => { },
  batchDetails: null,
  setBatchDetails: () => { },
  selectSubjectSlug: null,
  setSelectSubjectSlug: () => { },
  mainNavigation: null,
  setMainNavigation: () => { },
  headers: {},
  setHeaders: () => { },
  orders: null,
  setOrders: () => { },
  selectedSubject: null,
  setSelectedSubject: () => { },
  selectedChapter: null,
  setSelectedChapter: () => { },
  isOnline: true,
  setIsOnline: () => { },
  showIpInput: true,
  setShowIpInput: () => { },
  directoryLevel: 0,
  setDirectoryLevel: () => { },
  offlineCurrentDirectory: "http://192.168.1.16:6969/Batches/",
  setOfflineCurrentDirectory: () => { },
  offlineDirectoryListings: [],
  setOfflineDirectoryListings: () => { },
  offlineBatches: [],
  setOfflineBatches: () => { },
  offlineSelectedBatch: 0,
  setOfflineSelectedBatch: () => { },
  offlineSubjects: [],
  setOfflineSubjects: () => { },
  offlineSelectedSubject: 0,
  setOfflineSelectedSubject: () => { },
  offlineChapters: [],
  setOfflineChapters: () => { },
  offlineSelectedChapter: 0,
  setOfflineSelectedChapter: () => { },
  offlineLectures: [],
  setOfflineLectures: () => { },
  offlineSections: [],
  setOfflineSections: () => { },
  offlineNotes: [],
  setOfflineNotes: () => { },
  offlineDpp: [],
  setOfflineDpp: () => { },
  offlineDppPdf: [],
  setOfflineDppPdf: () => { },
  offlineDppVideos: [],
  setOfflineDppVideos: () => { },
  offlineSelectedSection: 3,
  setOfflineSelectedSection: () => { },
});

export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {

  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [subscribedBatches, setSubscribedBatches] = useState<BatchType[] | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<BatchType | null>(null);

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectSubjectSlug, setSelectSubjectSlug] = useState<string | null>(null);

  const [selectedChapter, setSelectedChapter] = useState<TopicType | null>(null);

  const [batchDetails, setBatchDetails] = useState<BatchDetails | null>(null);
  const [mainNavigation, setMainNavigation] = useState<any>(null);

  const [topicList, setTopicList] = useState<TopicType[] | null>(null);
  const [showLoadMore, setShowLoadMore] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [selectedDpp, setSelectedDpp] = useState<QuizItemType | null>(null);


  const [directoryLevel, setDirectoryLevel] = useState<number>(0);
  const [offlineCurrentDirectory, setOfflineCurrentDirectory] = useState<string>("http://192.168.1.16:6969/Batches/");
  const [offlineDirectoryListings, setOfflineDirectoryListings] = useState<any>([]);
  const [offlineBatches, setOfflineBatches] = useState<ItemType2[]>([]);
  const [offlineSelectedBatch, setOfflineSelectedBatch] = useState<number>(0);
  const [offlineSubjects, setOfflineSubjects] = useState<ItemType[]>([]);
  const [offlineSelectedSubject, setOfflineSelectedSubject] = useState<number>(0);
  const [offlineChapters, setOfflineChapters] = useState<ItemType[]>([]);
  const [offlineSelectedChapter, setOfflineSelectedChapter] = useState<number>(0);
  const [offlineSections, setOfflineSections] = useState<ItemType[]>([]);
  const [offlineLectures, setOfflineLectures] = useState<ItemType2[]>([]);
  const [offlineNotes, setOfflineNotes] = useState<ItemType2[]>([]);
  const [offlineDpp, setOfflineDpp] = useState<ItemType2[]>([]);
  const [offlineDppPdf, setOfflineDppPdf] = useState<ItemType2[]>([]);
  const [offlineDppVideos, setOfflineDppVideos] = useState<ItemType2[]>([]);
  const [offlineSelectedSection, setOfflineSelectedSection] = useState<number>(3);
  const [showIpInput, setShowIpInput] = useState<boolean>(false);


  const [headers, setHeaders] = useState<any>(null)

  useEffect(() => {
    const getIP = async () => {
      try {
        const ip = await AsyncStorage.getItem("iP")
        setOfflineCurrentDirectory(`http://${ip}/Batches/`);
        const response = await axios.get(`http://${ip}/Batches/`)
      } catch (err) {
        console.log("Error while fetchin Ip from local storage : ", err)
        setShowIpInput(true);
      }
    };
    getIP();
  }, []);

  const getPaidBatches = async () => {
    try {
      const res = await axios.get("https://api.penpencil.co/v3/batches/all-purchased-batches", { headers });
      setSubscribedBatches(res.data.data);
      setSelectedBatch(res.data.data[0]);
      setSelectSubjectSlug(res.data.data[0].subjects[0].slug);
      setSelectedSubject(res.data.data[0].subjects[0]);

      getChaptersData();
    }
    catch (err) {
      console.log("error:", err);
    }
  }

  const getPaidBatchesWithDetails = async () => {
    try {
      const res = await axios.get("https://api.penpencil.co/v2/orders/myPurchaseOrders?page=1&limit=50&status=ALL", { headers });
      setOrders(res.data.data.data);

    }
    catch (err) {
      console.log("error:", err);
    }
  }

  const getBatchDetails = async () => {
    try {
      const res = await axios.get(`https://api.penpencil.co/v3/batches/${selectedBatch?.batch._id}/details`, { headers });
      setBatchDetails(res.data.data)

      batchDetails && setSelectedSubject(batchDetails.subjects ? batchDetails.subjects[0] : null);
    }
    catch (err) {
      console.log("errorr:", err);
    }
  }

  const getChaptersData = async () => {
    // console.log("running: ", selectSubjectSlug, batchDetails?.slug, currentPage);

    try {
      const res = await axios.get(`https://api.penpencil.co/v2/batches/${batchDetails?.slug}/subject/${selectSubjectSlug}/topics?page=${currentPage}`, { headers });
      setTopicList((prev) => (prev != null ? [...prev, ...res.data.data] : res.data.data));
      // if(res.data.data.length<=0){
      //   setShowLoadMore(false);
      // }
      console.log("Setting selected chapter", res.data.data[0].name);

      setSelectedChapter(res.data.data[0]);
    }
    catch (err) {
      console.log("error:", err);
    }
  }


  useEffect(() => {
    getPaidBatches();
    getPaidBatchesWithDetails();
  }, [headers])



  useEffect(() => {
    getBatchDetails();
  }, [selectedBatch])

  useEffect(() => {
    console.log("getting chapters data");
    setTopicList(null);
    getChaptersData();
  }, [selectedSubject])


  useEffect(() => {
    batchDetails && setSelectSubjectSlug(batchDetails?.subjects[1]?.slug);
    batchDetails && setSelectedSubject(batchDetails?.subjects[1]);
    // console.log("Subject setting", batchDetails?.subjects[1]?.subject);


  }, [batchDetails])

  return (
    <GlobalContext.Provider
      value={{
        addModalOpen, setAddModalOpen,
        subscribedBatches, setSubscribedBatches,
        selectedBatch, setSelectedBatch,
        batchDetails, setBatchDetails,
        topicList, setTopicList,
        selectSubjectSlug, setSelectSubjectSlug,
        mainNavigation, setMainNavigation,
        headers, setHeaders,
        orders, setOrders,
        selectedDpp, setSelectedDpp,
        selectedSubject, setSelectedSubject,
        selectedChapter, setSelectedChapter,
        isOnline, setIsOnline,
        directoryLevel, setDirectoryLevel,
        offlineCurrentDirectory, setOfflineCurrentDirectory,
        offlineDirectoryListings, setOfflineDirectoryListings,
        offlineBatches, setOfflineBatches,
        offlineSelectedBatch, setOfflineSelectedBatch,
        offlineSubjects, setOfflineSubjects,
        offlineSelectedSubject, setOfflineSelectedSubject,
        offlineChapters, setOfflineChapters,
        offlineSelectedChapter, setOfflineSelectedChapter,
        offlineSections, setOfflineSections,
        offlineLectures, setOfflineLectures,
        offlineNotes, setOfflineNotes,
        offlineDpp, setOfflineDpp,
        offlineDppPdf, setOfflineDppPdf,
        offlineDppVideos, setOfflineDppVideos,
        offlineSelectedSection, setOfflineSelectedSection,
        showIpInput, setShowIpInput,
      } as GlobalContextType}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);




