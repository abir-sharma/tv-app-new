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
import { BatchDetails, BatchType, Order } from "../types/types";

type GlobalContextType = {
  addModalOpen: boolean;
  setAddModalOpen: Dispatch<SetStateAction<boolean>>;
  subscribedBatches: BatchType[] | null;
  setSubscribedBatches: Dispatch<SetStateAction<BatchType[] | null>>;
  selectedBatch: BatchType | null;
  setSelectedBatch: Dispatch<SetStateAction<BatchType | null>>;
  batchDetails: BatchDetails | null;
  setBatchDetails: Dispatch<SetStateAction<BatchDetails | null>>;
  selectSubjectSlug: string | null;
  setSelectSubjectSlug: Dispatch<SetStateAction<string | null>>;
  mainNavigation: any;
  setMainNavigation: Dispatch<SetStateAction<any>>;
  headers: any;
  orders: Order[] | null;
  setOrders: Dispatch<SetStateAction<Order[] | null>>;
}

const GlobalContext = createContext<GlobalContextType>({
  addModalOpen: false,
  setAddModalOpen: () => { },
  subscribedBatches: null,
  setSubscribedBatches: () => { },
  selectedBatch: null,
  setSelectedBatch: () => { },
  batchDetails: null,
  setBatchDetails: () => { },
  selectSubjectSlug: null,
  setSelectSubjectSlug: () => { },
  mainNavigation: null,
  setMainNavigation: () => { },
  headers: { },
  orders: null,
  setOrders: () => { }
});

export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [subscribedBatches, setSubscribedBatches] = useState<BatchType[] | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<BatchType | null>(null);
  const [batchDetails, setBatchDetails] = useState<BatchDetails | null>(null);
  const [selectSubjectSlug, setSelectSubjectSlug] = useState<string | null>(null);
  const [mainNavigation, setMainNavigation] = useState<any>(null);

  const headers = {
    // Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDczNjk4MzAuODk4LCJkYXRhIjp7Il9pZCI6IjVlY2QzNGZhYjU4NWYxMjUyZTc4MmJiNiIsInVzZXJuYW1lIjoiODQyMDMxMDEyNSIsImZpcnN0TmFtZSI6IlNheWFrIiwibGFzdE5hbWUiOiJTYXJrYXIiLCJvcmdhbml6YXRpb24iOnsiX2lkIjoiNWViMzkzZWU5NWZhYjc0NjhhNzlkMTg5Iiwid2Vic2l0ZSI6InBoeXNpY3N3YWxsYWguY29tIiwibmFtZSI6IlBoeXNpY3N3YWxsYWgifSwiZW1haWwiOiJzYXlha3NhcmthcjczQGdtYWlsLmNvbSIsInJvbGVzIjpbIjViMjdiZDk2NTg0MmY5NTBhNzc4YzZlZiJdLCJjb3VudHJ5R3JvdXAiOiJJTiIsInR5cGUiOiJVU0VSIn0sImlhdCI6MTcwNjc2NTAzMH0.BC2hePPB0jKRwoxcTkLO7feCFGeZAVcpCvwVh6XwMr8"
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MDgwMjQ1MDEuNDk2LCJkYXRhIjp7Il9pZCI6IjVlY2QzNGZhYjU4NWYxMjUyZTc4MmJiNiIsInVzZXJuYW1lIjoiODQyMDMxMDEyNSIsImZpcnN0TmFtZSI6IlNheWFrIiwibGFzdE5hbWUiOiJTYXJrYXIiLCJvcmdhbml6YXRpb24iOnsiX2lkIjoiNWViMzkzZWU5NWZhYjc0NjhhNzlkMTg5Iiwid2Vic2l0ZSI6InBoeXNpY3N3YWxsYWguY29tIiwibmFtZSI6IlBoeXNpY3N3YWxsYWgifSwiZW1haWwiOiJzYXlha3NhcmthcjczQGdtYWlsLmNvbSIsInJvbGVzIjpbIjViMjdiZDk2NTg0MmY5NTBhNzc4YzZlZiJdLCJjb3VudHJ5R3JvdXAiOiJJTiIsInR5cGUiOiJVU0VSIn0sImlhdCI6MTcwNzQxOTcwMX0.rtS1huRRryErj0TKmMqO9H1jUl6kBmQu53lSJA3ShS8"
  }

  const getPaidBatches = async  () => {
    try{
      const res = await axios.get("https://api.penpencil.co/v3/batches/all-purchased-batches", {headers});
      setSubscribedBatches(res.data.data);
      setSelectedBatch(res.data.data[0]);
    }
    catch(err){
      console.log("error:", err);
    }
  }

  const getPaidBatchesWithDetails = async  () => {
    try{
      const res = await axios.get("https://api.penpencil.co/v2/orders/myPurchaseOrders?page=1&limit=50&status=ALL", {headers});
      setOrders(res.data.data.data);
      
      // setSelectedBatch(res.data.data[0]);
    }
    catch(err){
      console.log("error:", err);
    }
  }

  const getBatchDetails = async  () => {
    try{
      const res = await axios.get(`https://api.penpencil.co/v3/batches/${selectedBatch?.batch._id}/details`, {headers});
      // console.log("Res: ", res.data.data)
      setBatchDetails(res.data.data)
    }
    catch(err){
      console.log("errorr:", err);
    }
  }

  useEffect(()=>{
    // getPaidBatches();
    getPaidBatchesWithDetails();
  }, [])

  useEffect(()=>{
    getBatchDetails();
  }, [selectedBatch])

  return (
    <GlobalContext.Provider
      value={{
        addModalOpen, setAddModalOpen,
        subscribedBatches, setSubscribedBatches,
        selectedBatch, setSelectedBatch,
        batchDetails, setBatchDetails,
        selectSubjectSlug, setSelectSubjectSlug,
        mainNavigation, setMainNavigation,
        headers,
        orders, setOrders
      } as GlobalContextType}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);




