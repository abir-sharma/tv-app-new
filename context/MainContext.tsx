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
import AsyncStorage from '@react-native-async-storage/async-storage';



type GlobalContextType = {
  subscribedBatches: BatchType[] | null;
  setSubscribedBatches: Dispatch<SetStateAction<BatchType[] | null>>;
  dppList: QuizItemType[] | null;
  setDppList: Dispatch<SetStateAction<QuizItemType[] | null>>;
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
  headers: any;
  setHeaders: Dispatch<SetStateAction<any>>;
  orders: Order[] | null;
  setOrders: Dispatch<SetStateAction<Order[] | null>>;
  selectedSubject: Subject | null;
  setSelectedSubject: Dispatch<SetStateAction<Subject[] | null>>;
  selectedChapter: TopicType | null;
  setSelectedChapter: Dispatch<SetStateAction<TopicType | null>>;
  getChaptersData: () => void;
  chapterPagination: any;
  currentChapterPage: number;
  setCurrentChapterPage: Dispatch<SetStateAction<number>>;
  loadMoreChaptersData: () => void;
  isOnline: boolean;
  setIsOnline: Dispatch<SetStateAction<boolean>>;
  showIpInput: boolean;
  setShowIpInput: Dispatch<SetStateAction<boolean>>;
  directoryLevel: number;
  setDirectoryLevel: Dispatch<SetStateAction<number>>;
  offlineCurrentDirectory: string;
  setOfflineCurrentDirectory: Dispatch<SetStateAction<string>>;
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
  testData: any | null;
  setTestData: Dispatch<SetStateAction<any | null>>;
  testSections: any | null;
  setTestSections: Dispatch<SetStateAction<any | null>>;
  selectedTestMapping: any | null;
  setSelectedTestMapping: Dispatch<SetStateAction<any | null>>;
  recentVideoLoad: boolean;
  setRecentVideoLoad: Dispatch<SetStateAction<boolean>>;
  logs: string[];
  setLogs: Dispatch<SetStateAction<string[]>>;
  messageFromRemote: string;
  setMessageFromRemote: Dispatch<SetStateAction<string>>;
  fetchDetails: boolean;
  setFetchDetails: Dispatch<SetStateAction<boolean>>;
  fetchDetailTrigger: () => void;
  selectedMenu: number;
  setSelectedMenu: Dispatch<SetStateAction<number>>;
  PENDRIVE_BASE_URL: string;
  setPENDRIVE_BASE_URL: Dispatch<SetStateAction<string>>;

}

const GlobalContext = createContext<GlobalContextType>({
  subscribedBatches: null,
  setSubscribedBatches: () => { },
  dppList: null,
  setDppList: () => { },
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
  headers: {},
  setHeaders: () => { },
  orders: null,
  setOrders: () => { },
  selectedSubject: null,
  setSelectedSubject: () => { },
  selectedChapter: null,
  setSelectedChapter: () => { },

  loadMoreChaptersData: () => { },
  getChaptersData: () => { },
  chapterPagination: null,
  currentChapterPage: 1,
  setCurrentChapterPage: () => { },


  isOnline: true,
  setIsOnline: () => { },
  showIpInput: true,
  setShowIpInput: () => { },
  directoryLevel: 0,
  setDirectoryLevel: () => { },
  offlineCurrentDirectory: "http://192.168.1.16:6969/Batches/",
  setOfflineCurrentDirectory: () => { },
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
  testData: null,
  setTestData: () => { },
  testSections: null,
  setTestSections: () => { },
  selectedTestMapping: null,
  setSelectedTestMapping: () => { },
  recentVideoLoad: false,
  setRecentVideoLoad: () => { },
  logs: [],
  setLogs: () => { },
  messageFromRemote: "",
  setMessageFromRemote: () => { },
  fetchDetails: false,
  setFetchDetails: () => { },
  fetchDetailTrigger: () => { },
  selectedMenu: 0,
  setSelectedMenu: () => { },
  PENDRIVE_BASE_URL: '/storage/emulated/0/Download/Batches',
  setPENDRIVE_BASE_URL: () => { },
});

export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {

  const [fetchDetails, setFetchDetails] = useState(false);

  const fetchDetailTrigger = () => {
    setFetchDetails(prev=>!prev);
  }

  const [subscribedBatches, setSubscribedBatches] = useState<BatchType[] | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<BatchType | null>(null);

  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectSubjectSlug, setSelectSubjectSlug] = useState<string | null>(null);

  const [selectedChapter, setSelectedChapter] = useState<TopicType | null>(null);

  const [dppList, setDppList] = useState<QuizItemType[] | null>(null);
  const [batchDetails, setBatchDetails] = useState<BatchDetails | null>(null);

  const [topicList, setTopicList] = useState<TopicType[] | null>(null);
  const [chapterPagination, setChapterPagination] = useState<any>(null);
  const [currentChapterPage, setCurrentChapterPage] = useState<number>(1);

  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [selectedDpp, setSelectedDpp] = useState<QuizItemType | null>(null);
  const [testData, setTestData] = useState<any>(null);
  const [testSections, setTestSections] = useState<any>(null);
  const [selectedTestMapping, setSelectedTestMapping] = useState<any>(null);

  const [recentVideoLoad, setRecentVideoLoad] = useState<boolean>(false);



  const [directoryLevel, setDirectoryLevel] = useState<number>(0);
  const [offlineCurrentDirectory, setOfflineCurrentDirectory] = useState<string>("http://192.168.1.16:6969/Batches/");
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
  const [logs, setLogs] = useState<string[]>([]);
  const [headers, setHeaders] = useState<any>(null)
  const [messageFromRemote, setMessageFromRemote] = useState<string>("");
  const [selectedMenu, setSelectedMenu] = useState<number>(0);

  const [PENDRIVE_BASE_URL, setPENDRIVE_BASE_URL] = useState<string>('/storage/emulated/0/Download/Batches');

  useEffect(() => {
    const getIP = async () => {
      try {
        const ip = await AsyncStorage.getItem("iP")
        setOfflineCurrentDirectory(`http://${ip}/Batches/`);
        const response = await axios.get(`http://${ip}/Batches/`)
      } catch (err) {
        console.error("Error while fetchin Ip from local storage : ", err)
        setShowIpInput(true);
      }
    };
    getIP();
  }, []);

  const getPaidBatches = async () => {
    try {
      const res = await axios.get("https://api.penpencil.co/v3/batches/my-batches?mode=1&page=1&limit=50", { headers });
      setSubscribedBatches(res?.data?.data);
      setSelectedBatch(res?.data?.data[0]);
      setSelectSubjectSlug(res?.data?.data[0]?.subjects[0]?.slug);
      setSelectedSubject(res?.data?.data[0]?.subjects[0]);

      getChaptersData();
    }
    catch (err: any) {
      setLogs((logs) => [...logs, "Error in BATCHES API(MAIN CONTEXT):" + JSON.stringify(err?.response)]);
      console.error("error:", err);
    }
  }

  const getPaidBatchesWithDetails = async () => {
    try {
      const res = await axios.get("https://api.penpencil.co/v2/orders/myPurchaseOrders?page=1&limit=50&status=ALL", { headers });
      setOrders(res?.data?.data?.data);
    }
    catch (err: any) {
      console.error("Err:", err);
    }
  }

  const getBatchDetails = async () => {
    try {
      const res = await axios.get(`https://api.penpencil.co/v3/batches/${selectedBatch?._id}/details`, { headers });
      setBatchDetails(res?.data?.data)

      batchDetails && setSelectedSubject(batchDetails?.subjects ? batchDetails?.subjects[0] : null);
    }
    catch (err: any) {
      setLogs((logs) => [...logs, "Error in BATCH DETAIL API(MAIN CONTEXT):" + JSON.stringify(err.response)]);
      console.error("err:", err);
    }
  }

  // useEffect(() => {
  //   if(topicList){
  //     if(topicList?.length<=0){
  //       const index = batchDetails?.subjects.findIndex((subject) => subject.slug === selectSubjectSlug) || 0;
  //       batchDetails?.subjects[0]?.slug && setSelectSubjectSlug(batchDetails?.subjects[index+1]?.slug);
  //       batchDetails?.subjects[0] && setSelectedSubject(batchDetails?.subjects[index+1]);
  //     }
  //   }
  // }, [topicList])

  const getChaptersData = async () => {

    setCurrentChapterPage(1);
    try {
      const res = await axios.get(`https://api.penpencil.co/v2/batches/${batchDetails?.slug}/subject/${selectSubjectSlug}/topics?page=${currentChapterPage}`, { headers });
      setTopicList((prev) => (prev != null ? [...prev, ...res?.data?.data] : res?.data?.data));

      // find the index of the currently selected Subject
      
      // console.log("res that caused error: ", res);
      console.log('chapters ', res.data.paginate)
      setChapterPagination(res.data.paginate);
      
    }
    catch (err: any) {
      setLogs((logs) => [...logs, "Error in CHAPTER API(MAIN CONTEXT):" + JSON.stringify(err.response)]);
      console.error("error in chapter fetch:", err);
    }
  }

  const loadMoreChaptersData = async () => {
    try {
      if(topicList && (chapterPagination.totalCount <= topicList.length)) return;
      const res = await axios.get(`https://api.penpencil.co/v2/batches/${batchDetails?.slug}/subject/${selectSubjectSlug}/topics?page=${currentChapterPage+1}`, { headers });
      setTopicList((prev) => (prev != null ? [...prev, ...res?.data?.data] : res?.data?.data));
      setCurrentChapterPage(currentChapterPage+1);
      // find the index of the currently selected Subject
      // console.log("res that caused error: ", res);
    }
    catch (err: any) {
      setLogs((logs) => [...logs, "Error in CHAPTER API(MAIN CONTEXT):" + JSON.stringify(err.response)]);
      console.error("error in chapter fetch:", err);
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
    setTopicList(null);
    getChaptersData();
  }, [selectedSubject])


  useEffect(() => {
    batchDetails && setSelectSubjectSlug(batchDetails?.subjects[1]?.slug);
    batchDetails && setSelectedSubject(batchDetails?.subjects[1]);
  }, [batchDetails])

  return (
    <GlobalContext.Provider
      value={{
        subscribedBatches, setSubscribedBatches,
        selectedBatch, setSelectedBatch,
        batchDetails, setBatchDetails,
        topicList, setTopicList,
        dppList, setDppList,
        selectSubjectSlug, setSelectSubjectSlug,
        headers, setHeaders,
        orders, setOrders,
        selectedDpp, setSelectedDpp,
        selectedSubject, setSelectedSubject,
        selectedChapter, setSelectedChapter,
        getChaptersData, chapterPagination, currentChapterPage, setCurrentChapterPage, loadMoreChaptersData,
        isOnline, setIsOnline,
        testData, setTestData,
        testSections, setTestSections,
        directoryLevel, setDirectoryLevel,
        selectedTestMapping, setSelectedTestMapping,
        offlineCurrentDirectory, setOfflineCurrentDirectory,
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
        recentVideoLoad, setRecentVideoLoad,
        logs, setLogs,
        messageFromRemote, setMessageFromRemote,
        fetchDetails, setFetchDetails, fetchDetailTrigger,
        selectedMenu, setSelectedMenu,
        PENDRIVE_BASE_URL, setPENDRIVE_BASE_URL
      } as GlobalContextType}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);




