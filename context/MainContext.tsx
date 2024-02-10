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
import { BatchDetails, BatchType, Order, Subject, TopicType, ItemType } from "../types/types";


type GlobalContextType = {
  addModalOpen: boolean;
  setAddModalOpen: Dispatch<SetStateAction<boolean>>;
  subscribedBatches: BatchType[] | null;
  setSubscribedBatches: Dispatch<SetStateAction<BatchType[] | null>>;
  topicList: TopicType[] | null;
  setTopicList: Dispatch<SetStateAction<TopicType[] | null>>;
  selectedBatch: BatchType | null;
  setSelectedBatch: Dispatch<SetStateAction<BatchType | null>>;
  batchDetails: BatchDetails | null;
  setBatchDetails: Dispatch<SetStateAction<BatchDetails | null>>;
  selectSubjectSlug: string | null;
  setSelectSubjectSlug: Dispatch<SetStateAction<string | null>>;
  mainNavigation: any;
  setMainNavigation: Dispatch<SetStateAction<any>>;
  headers: any;
  baseDirectoryLocation: string;
  orders: Order[] | null;
  setOrders: Dispatch<SetStateAction<Order[] | null>>;
  selectedSubject: Subject | null;
  setSelectedSubject: Dispatch<SetStateAction<Subject[] | null>>;
  selectedChapter: TopicType | null;
  setSelectedChapter: Dispatch<SetStateAction<TopicType | null>>;
  isOnline: boolean;
  setIsOnline: Dispatch<SetStateAction<boolean>>;
  directoryLevel: number;
  setDirectoryLevel: Dispatch<SetStateAction<number>>;
  offlineCurrentDirectory: string;
  setOfflineCurrentDirectory: Dispatch<SetStateAction<string>>;
  offlineDirectoryListings: any;
  setOfflineDirectoryListings: Dispatch<SetStateAction<any>>;
  offlineBatches: ItemType[];
  setOfflineBatches: Dispatch<SetStateAction<ItemType[]>>;
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
  offlineLectures: ItemType[];
  setOfflineLectures: Dispatch<SetStateAction<ItemType[]>>;
  offlineNotes: ItemType[];
  setOfflineNotes: Dispatch<SetStateAction<ItemType[]>>;
  offlineDpp: ItemType[];
  setOfflineDpp: Dispatch<SetStateAction<ItemType[]>>;
  offlineDppPdf: ItemType[];
  setOfflineDppPdf: Dispatch<SetStateAction<ItemType[]>>;
  offlineDppVideos: ItemType[];
  setOfflineDppVideos: Dispatch<SetStateAction<ItemType[]>>;
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
  selectedBatch: null,
  setSelectedBatch: () => { },
  batchDetails: null,
  setBatchDetails: () => { },
  selectSubjectSlug: null,
  setSelectSubjectSlug: () => { },
  mainNavigation: null,
  setMainNavigation: () => { },
  headers: {},
  baseDirectoryLocation: "http://192.168.1.13:6969/Desktop",
  orders: null,
  setOrders: () => { },
  selectedSubject: null,
  setSelectedSubject: () => { },
  selectedChapter: null,
  setSelectedChapter: () => { },
  isOnline: true,
  setIsOnline: () => { },
  directoryLevel: 0,
  setDirectoryLevel: () => { },
  offlineCurrentDirectory: "http://192.168.1.13:6969/Desktop/",
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

  const [directoryLevel, setDirectoryLevel] = useState<number>(0);
  const [offlineCurrentDirectory, setOfflineCurrentDirectory] = useState<string>("http://192.168.1.13:6969/Desktop/");
  const [offlineDirectoryListings, setOfflineDirectoryListings] = useState<any>([]);
  const [offlineBatches, setOfflineBatches] = useState<ItemType[]>([]);
  const [offlineSelectedBatch, setOfflineSelectedBatch] = useState<number>(0);
  const [offlineSubjects, setOfflineSubjects] = useState<ItemType[]>([]);
  const [offlineSelectedSubject, setOfflineSelectedSubject] = useState<number>(0);
  const [offlineChapters, setOfflineChapters] = useState<ItemType[]>([]);
  const [offlineSelectedChapter, setOfflineSelectedChapter] = useState<number>(0);
  const [offlineSections, setOfflineSections] = useState<ItemType[]>([]);
  const [offlineLectures, setOfflineLectures] = useState<ItemType[]>([]);
  const [offlineNotes, setOfflineNotes] = useState<ItemType[]>([]);
  const [offlineDpp, setOfflineDpp] = useState<ItemType[]>([]);
  const [offlineDppPdf, setOfflineDppPdf] = useState<ItemType[]>([]);
  const [offlineDppVideos, setOfflineDppVideos] = useState<ItemType[]>([]);
  const [offlineSelectedSection, setOfflineSelectedSection] = useState<number>(3);

  const baseDirectoryLocation = "http://192.168.1.13:6969/Desktop";

  const headers = {
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDgwOTU4MDQuMzMzLCJkYXRhIjp7Il9pZCI6IjVlY2QzNGZhYjU4NWYxMjUyZTc4MmJiNiIsInVzZXJuYW1lIjoiODQyMDMxMDEyNSIsImZpcnN0TmFtZSI6IlNheWFrIiwibGFzdE5hbWUiOiJTYXJrYXIiLCJvcmdhbml6YXRpb24iOnsiX2lkIjoiNWViMzkzZWU5NWZhYjc0NjhhNzlkMTg5Iiwid2Vic2l0ZSI6InBoeXNpY3N3YWxsYWguY29tIiwibmFtZSI6IlBoeXNpY3N3YWxsYWgifSwiZW1haWwiOiJzYXlha3NhcmthcjczQGdtYWlsLmNvbSIsInJvbGVzIjpbIjViMjdiZDk2NTg0MmY5NTBhNzc4YzZlZiJdLCJjb3VudHJ5R3JvdXAiOiJJTiIsInR5cGUiOiJVU0VSIn0sImlhdCI6MTcwNzQ5MTAwNH0.CxGrjGsWZJvOgd9yGUhF0Zznn7k-Vo22hnvOTVzJT_o"
  }

  const getPaidBatches = async () => {
    try {
      const res = await axios.get("https://api.penpencil.co/v3/batches/all-purchased-batches", { headers });
      setSubscribedBatches(res.data.data);
      // setSelectedBatch(res.data.data[0]);
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
    }
    catch (err) {
      console.log("error:", err);
    }
  }

  useEffect(() => {
    getPaidBatches();
    getPaidBatchesWithDetails();
  }, [])

  useEffect(() => {
    getBatchDetails();
  }, [selectedBatch])

  useEffect(() => {
    console.log("getting chapters data");
    setTopicList(null);
    getChaptersData();
  }, [selectedSubject])

  useEffect(() => {
    console.log("--------------------")
    console.log("batch: ", selectedBatch?.batch?.name);
    console.log("subject: ", selectedSubject?.subject);
    console.log("slug: ", selectSubjectSlug);
    console.log("chapter: ", selectedChapter?.name);
    console.log("--------------------")

  }, [selectedBatch, selectedSubject, selectSubjectSlug, selectedChapter])

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
        headers, baseDirectoryLocation,
        orders, setOrders,
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
      } as GlobalContextType}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);




