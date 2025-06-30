 type BatchInfoType = {
  _id: string;
  name: string;
  isPathshala: boolean;
  masterBatchId: string | null;
}

 type BatchType = {
  _id: string;
  previewImage: FileId;
  batch: BatchInfoType;
  isPurchased: boolean;
  name: string;
}

 type Order = {
  orderId: string;
  itemName: string;
  totalAmountPaid: number;
  totalItem: number;
  status: string;
  orderDate: string;
  thumbnailImageLink: string;
  modeOfPayment: string;
  typeOfOrder: string;
  isRetry: boolean;
};

type Schedule = {
  _id: string;
  day: string;
  startTime: string;
  endTime: string;
};

type FileId = {
  _id: string;
  baseUrl: string;
  key: string;
  name: string;
};

type ImageId = FileId;

type Fee = {
  amount: number;
  tax: number;
  discount: number;
  total: number;
};

type StudyMaterial = {
  _id: string;
  typeId: string;
  type: string;
};

 type Subject = {
  _id: string;
  fileId: FileId;
  subject: string;
  subjectId: string;
  slug: string;
  schedules: Schedule[];
  teacherIds: string[];
  imageId: ImageId;
  tagCount: number;
};

 type BatchDetails = {
  _id: string;
  type: string;
  name: string;
  exam: string[];
  class: string;
  language: string;
  byName: string;
  label: string[];
  description: string;
  batchCode: string;
  startDate: string;
  endDate: string;
  programId: string;
  subjects: Subject[];
  fee: Fee;
  isPurchased: boolean;
  isBlocked: boolean;
  isChatBlocked: boolean;
  status: string;
  isAvailableFromPoints: boolean;
  maxWalletPoint: number;
  registrationStartDate: string;
  registrationEndDate: string;
  previewImage: ImageId;
  orientationClassBanner: null | any;
  batchPdf: null | any;
  previewVideoType: string;
  previewVideoUrl: null | string;
  previewVideoId: null | string;
  faqCat: string;
  attachTestCat: boolean;
  testCat: string;
  testCats: string[];
  meta: any[];
  buddyRoomId: string;
  previewVideoDetails: null | any;
  enableStudyMaterial: boolean;
  studyMaterials: StudyMaterial[];
  markedAsNew: boolean;
  isClassLive: boolean;
  isPathshala: boolean;
  slug: string;
  khazanaProgramId: string;
  config: {
    isStartDateEnabled: boolean;
    isEndDateEnabled: boolean;
    isTeacherNameEnabled: boolean;
    isVidyapeeth: boolean;
    enableBatchReferAndEarn: boolean;
    isFormEnabled: boolean;
    isSubjective: boolean;
    isPremium: boolean;
    defaultFbt: string;
    fbtPageTitle: string;
    fbtTitle: string;
    isAddonVisible: boolean;
    addonsTitle: string;
    addonsDescription: string;
    enableNotes: boolean;
    enableDpp: boolean;
    enableDppPdfs: boolean;
    enableDppVideos: boolean;
    isAttendanceEnable: boolean;
    isCardEMIEnable: boolean;
    isSecondaryScreenEnabled: boolean;
    isSPDEnabled: boolean;
  };
  isRecorded: boolean;
  enableCommunity: boolean;
  enableCommunityWeb: boolean;
  enableSuper40: boolean;
  manualAllotmentCount: number;
  isPayLaterEnabled: boolean;
  isSelfLearning: boolean;
  priceLabel: string;
  dRoomId: string;
  packValidity: number;
  shortDescription: string;
  batchExpiry: string;
  metaText: string;
  isInfinitePracticeEnabled: boolean;
  infinitePracticeVideoType: string;
  countryGroup: string;
  notifyMeStatus: string;
  registerTag: string;
  isAskSaarthiEnabled: boolean;
  plan: string;
  enableMentorship: boolean;
  discountValue: number;
  discountLabel: string;
  bannerLabel: string;
  discountExpiryDate: string;
  isSatExamEnable: boolean;
  isBatchContentSecurityEnabled: boolean;
  pitaraProgramId: string;
  pitaraTheme: string;
  isDoubtEnabled: boolean;
  isDoubtRecommendationEnabled: boolean;
  appleInAppPurchase: {
    enable: boolean;
    id: number;
    appId: number;
    status: string;
    countryCode: string;
    currencyCode: string;
    price: {
      id: string;
      attributes: {
        customerPrice: string;
        proceeds: string;
      };
    };
  };
  isBatchPlusEnabled: boolean;
  fomoIcons: any[];
  batchPdfUrl: null | string;
  template: string;
  userLimit: number;
  userCount: number;
  roomCount: number;
  masterBatchId: null | string;
  activeSectionBatchId: null | string;
  replicatedBy: null | string;
  webinarId: null | string;
  testPress: null | string;
  program: {
    _id: string;
    name: string;
    board: string;
    class: string;
    exam: string[];
    language: string;
    slug: string;
  };
};

 type TopicType = {
  _id: string;
  name: string;
  type: string;
  typeId: string;
  displayOrder: number;
  notes: number;
  exercises: number;
  videos: number;
  slug: string;
};

type TagType = {
  _id: string;
  name: string;
};

type VideoDetailsType = {
  _id: string;
  id: string;
  name: string;
  image: string;
  videoUrl: string;
  duration: string;
  status: string;
  types: string[];
  createdAt: string;
  drmProtected: boolean;
};

 type VideoType = {
  _id: string;
  restrictedSchedule: boolean;
  restrictedTime: number;
  urlType: string;
  tags: TagType[];
  isFree: boolean;
  isChatEnabled: boolean;
  isDoubtEnabled: boolean;
  isCommentDisabled: boolean;
  isPathshala: boolean;
  isDPPVideos: boolean;
  status: string;
  topic: string;
  date: string;
  startTime: string;
  endTime: string;
  timeline: any[];
  url: string;
  subject: string;
  chapter?: string;
  batch?: string;
  videoDetails: VideoDetailsType;
  dRoomId: string;
  isBatchDoubtEnabled: boolean;
};

type Attachment = {
  _id: string;
  name: string;
  baseUrl: string;
  key: string;
};

 type ItemType = {
  name: string,
  id: number
  path: string,
}
 type ItemType2 = {
  name: string,
  id: number
  path: string,
  thumbnail: string,
  defaultThumbnail: boolean,
}

type HomeworkItem = {
  _id: string;
  actions: string[];
  topic: string;
  note: string;
  attachmentIds: Attachment[];
  batchSubjectId: string;
  solutionVideoType: string;
};

 type NoteType = {
  _id: string;
  isFree: boolean;
  status: string;
  date: string;
  startTime: string;
  isDPPNotes: boolean;
  homeworkIds: HomeworkItem[];
  dRoomId: string;
  isBatchDoubtEnabled: boolean;
};


 type QuizItemType = {
  "test": {
    "_id": string,
    "displayOrder": number,
    "name": string,
    "totalMarks": number,
    "totalQuestions": number,
    "maxDuration": number,
    "createdAt": string
  },
  "testStudentMapping": {},
  "isPurchased": boolean,
  "tag": string,
  "isFree": boolean,
  "scheduleId": string,
  "contentId": string
};

type EventData = {
  timestamp?: string;
  registered_mobile_number?: string;
  [key: string]: any;
};


// PropTypes

type DPPPropType = {
  noteList: NoteType[] | null,
  setNoteList: Dispatch<SetStateAction<NoteType[] | null>>,
  loadMore: boolean,
  getPaidBatches: any
}

type NavbarDetailsPropType = {
  selectedMenu: number;
  setSelectedMenu: (arg: number) => void;
  setContentType: (arg: string) => void;
  setCurrentPage: (arg: number) => void;
}

type NoteComponentPropType = {
  noteList: NoteType[] | null,
  setNoteList: Dispatch<SetStateAction<NoteType[] | null>>,
  loadMore: boolean,
  getPaidBatches: any
}

type VideoComponentPropType = {
  videoList: VideoType[] | null,
  setVideoList: Dispatch<SetStateAction<VideoType[] | null>>,
  loadMore: boolean,
  getPaidBatches: any
}

type OfflineNoteComponentPropType = {
  noteList: ItemType[] | null,
}

type OfflineVideoComponentPropType = {
  videoList: ItemType[] | null,
}
