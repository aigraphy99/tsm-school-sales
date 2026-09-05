export type Role = 'SUPER_ADMIN' | 'AREA_MANAGER' | 'TSM' | 'DATA_OPERATOR' | 'VIEW_ONLY';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  territoryId: string;
  territoryName: string;
  avatarUrl?: string;
  dailyTarget: number;
}

export interface LiveFeatureConfig {
  tsmName: string;
  tsmPhone: string;
  tsmEmail: string;
  territoryName: string;
  registrationDeadline: string;
  baseFee: number; // ₹150 base fee per student
  schoolRetentionPerStudent: number; // ₹25 per student retained by school
  littleStarFee: number; // ₹175 per child
  littleStarRetention: number; // ₹25 per child
  booksPrice: number; // ₹120 per book
  pyqpPrice: number; // ₹120 per book
  pitchAmountInTemplates: boolean; // strictly false
  showExtensionNotice: boolean;
  grandPrizeHighlight: string;
  officialBrochurePdfUrl: string;
  littleStarPdfUrl: string;
  posterPdfUrl: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface LiveChangeRecord {
  id: string;
  timestamp: string;
  author: string; // 'AI Bot' | 'TSM Swapnil' | 'Admin'
  category: 'FEES' | 'TEMPLATES' | 'TSM_PROFILE' | 'BROCHURE' | 'DEADLINE' | 'FEATURE_FLAG' | 'GENERAL';
  featureKey: string;
  title: string;
  description: string;
  previousValue: any;
  newValue: any;
  canRevert: boolean;
}

export interface Territory {
  id: string;
  name: string;
  region: string;
  state: string;
  totalSchools: number;
  activeTsmId: string;
  activeTsmName: string;
  cities: string[];
}

export type PipelineStage =
  | 'UNVERIFIED'
  | 'DATA_VERIFIED'
  | 'DECISION_MAKER_IDENTIFIED'
  | 'FIRST_CONTACT'
  | 'WHATSAPP_SENT'
  | 'BROCHURE_SENT'
  | 'ENGAGED'
  | 'CONVERSATION'
  | 'MEETING'
  | 'OLYMPIAD_DISCUSSION'
  | 'BOOK_DISCUSSION'
  | 'REGISTRATION'
  | 'ORDER'
  | 'WON'
  | 'LOST'
  | 'NO_RESPONSE'
  | 'CALL_BACK'
  | 'VISIT_REQUIRED'
  | 'NOT_INTERESTED';

export type ContactDesignation =
  | 'PRINCIPAL'
  | 'VICE_PRINCIPAL'
  | 'COORDINATOR'
  | 'OLYMPIAD_COORDINATOR'
  | 'HEADMASTER'
  | 'HEADMISTRESS'
  | 'ACADEMIC_COORDINATOR'
  | 'ACCOUNTS'
  | 'MATHS_TEACHER'
  | 'SCIENCE_TEACHER'
  | 'COMPUTER_TEACHER'
  | 'ENGLISH_TEACHER'
  | 'ADMIN'
  | 'OTHER';

export interface TruecallerCheck {
  checkedAt?: string;
  callerName: string;
  matchedName?: string;
  matchScore: number; // 0 to 100
  isNameMatched: boolean;
  carrier: string; // e.g. Reliance Jio, Bharti Airtel, Vi, BSNL
  circle: string; // e.g. Maharashtra & Goa (Nagpur)
  lineType: 'MOBILE' | 'LANDLINE' | 'INVALID';
  spamScore: number; // 0 to 100
  isSpam: boolean;
  isValidMobile: boolean;
  hasWhatsApp: boolean;
  verifiedBadge: boolean;
  truecallerWebUrl: string;
  status: 'VERIFIED_ACCURATE' | 'NAME_MISMATCH' | 'UNVERIFIED' | 'INVALID_NUMBER' | 'SPAM_RISK';
  remarks?: string;
}

export interface Contact {
  id: string;
  schoolId: string;
  name: string;
  normalizedName: string;
  designation: ContactDesignation;
  mobile: string;
  alternateMobile?: string;
  whatsappNumber: string;
  email: string;
  source: string;
  sourceUrl?: string;
  confidence: number;
  verified: boolean;
  verifiedAt?: string;
  isPrimary: boolean;
  notes?: string;
  truecaller?: TruecallerCheck;
}

export interface FieldConfidence {
  schoolName: number;
  address: number;
  website: number;
  principal: number;
  coordinator: number;
  phone: number;
  email: number;
}

export interface School {
  id: string;
  schoolCode: string;
  name: string;
  normalizedName: string;
  alternateNames?: string[];
  area: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  addressLine1: string;
  addressLine2?: string;
  board: 'CBSE' | 'ICSE' | 'State Board' | 'IB' | 'Other';
  schoolType?: 'Private' | 'Govt' | 'Semi-Govt' | 'International';
  studentStrength: number;
  classes?: string;
  website?: string;
  officialEmail?: string;
  officialPhone?: string;
  priority: 'P1' | 'P2' | 'P3';
  stage: PipelineStage;
  dataConfidence: number; // 0-100
  fieldConfidence: FieldConfidence;
  lastVerifiedAt?: string;
  ownerTsmId: string;
  ownerTsmName: string;
  territoryId: string;
  latitude: number;
  longitude: number;
  tags: string[];
  nextFollowUpDate?: string;
  nextFollowUpAction?: string;
  contactsCount: number;
  contacts?: Contact[];
  silverzoneCode?: string;
  ipSchoolCode?: string;
  confirmationCallStatus?: string;
  confirmationStatus?: string;
  lastYearReg?: number;
  currentYearReg?: number;
  feeOverride?: {
    baseFee?: number;
    schoolRetention?: number;
    littleStarFee?: number;
    littleStarRetention?: number;
    notes?: string;
  };
  webVerification?: {
    isWebVerified: boolean;
    lastWebVerifiedAt?: string;
    domain?: string;
    verifiedPhones?: string[];
    verifiedEmails?: string[];
    websiteStatus?: 'LIVE' | 'NO_WEBSITE' | 'DOWN';
    sourceDetails?: string;
  };
  lastActivityAt?: string;
  lastActivityTitle?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DuplicateCluster {
  id: string;
  clusterType: 'EXACT_CODE' | 'MATCHING_PHONE' | 'SIMILAR_NAME';
  matchKey: string;
  primarySchool: School;
  duplicates: School[];
  resolved: boolean;
  recommendedAction: 'MERGE' | 'RENAME' | 'KEEP_BOTH';
}

export interface Evidence {
  id: string;
  schoolId: string;
  field: string;
  observedValue: string;
  sourceType: 'OFFICIAL_WEBSITE' | 'SEARCH_ENGINE' | 'PUBLIC_DIRECTORY' | 'MAPS_PROFILE' | 'INTERNAL_CSV';
  sourceUrl: string;
  observedAt: string;
  confidence: number;
  status: 'VERIFIED' | 'PROBABLE' | 'UNVERIFIED' | 'CONFLICT' | 'STALE' | 'NOT_FOUND';
}

export interface DataConflict {
  id: string;
  schoolId: string;
  schoolName: string;
  field: string;
  internalValue: string;
  webValue: string;
  webSource: string;
  sourceUrl: string;
  confidence: number;
  status: 'PENDING' | 'RESOLVED_INTERNAL' | 'RESOLVED_WEB';
  detectedAt: string;
}

export interface Activity {
  id: string;
  schoolId: string;
  userId: string;
  userName: string;
  type: 'CALL' | 'WHATSAPP' | 'VISIT' | 'EMAIL' | 'NOTE' | 'STAGE_CHANGE' | 'RESEARCH' | 'BROCHURE_VIEWED';
  title: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface Opportunity {
  id: string;
  schoolId: string;
  schoolName: string;
  type: 'OLYMPIAD' | 'BOOKS';
  product: string;
  interestLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  subjects?: string[];
  estimatedStudents?: number;
  estimatedQuantity?: number;
  potentialValue: number;
  probability: number;
  stage: 'PROSPECTING' | 'QUALIFIED' | 'PROPOSAL_SENT' | 'NEGOTIATION' | 'REGISTERED' | 'ORDER_PLACED' | 'LOST';
  decisionMaker: string;
  expectedCloseDate: string;
  nextAction: string;
  createdAt: string;
  updatedAt: string;
}

export interface ResearchJob {
  id: string;
  schoolId: string;
  schoolName: string;
  city: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'PARTIAL' | 'NEEDS_VERIFICATION' | 'FAILED' | 'RETRYING';
  progress: number;
  sourcesChecked: string[];
  fieldsFound: string[];
  confidence: number;
  logs: string[];
  startedAt: string;
  completedAt?: string;
  error?: string;
}

export interface WhatsAppMessage {
  id: string;
  schoolId: string;
  schoolName: string;
  recipientPhone: string;
  recipientName: string;
  designation: string;
  templateId: string;
  messageText: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'document';
  status: 'QUEUED' | 'SENT' | 'DELIVERED' | 'READ' | 'REPLIED' | 'FAILED';
  sentAt: string;
  deliveredAt?: string;
  readAt?: string;
  repliedAt?: string;
  errorReason?: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  category: 'PRINCIPAL_INTRO' | 'COORDINATOR_INTRO' | 'BROCHURE' | 'OLYMPIAD' | 'BOOKS' | 'FOLLOWUP_3D' | 'FOLLOWUP_5D' | 'MEETING_REQ' | 'THANK_YOU' | 'BROCHURE_EXTENSION' | 'LITTLE_STAR' | 'URGENT_DEADLINE' | 'EDUCATOR_RECOGNITION' | 'AI_OLYMPIAD' | string;
  content: string;
  defaultMediaUrl?: string;
  defaultMediaType?: 'image' | 'video' | 'document';
}

export interface BrochureTracking {
  token: string;
  schoolId: string;
  schoolName: string;
  title: string;
  openedCount: number;
  downloaded: boolean;
  firstViewedAt?: string;
  lastViewedAt?: string;
  device?: string;
}

export interface AuditLogItem {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: 'SCHOOL' | 'CONTACT' | 'OPPORTUNITY' | 'RESEARCH' | 'STAGE';
  entityId: string;
  entityName: string;
  beforeValue?: string;
  afterValue?: string;
  source: string;
  timestamp: string;
}

export interface NextActionItem {
  id: string;
  schoolId: string;
  schoolName: string;
  area: string;
  priority: 'P1' | 'P2' | 'P3';
  action: 'CALL PRINCIPAL' | 'FOLLOW UP NOW' | 'VERIFY COORDINATOR' | 'SEND BROCHURE' | 'VISIT REQUIRED' | 'OLYMPIAD PITCH';
  reason: string;
  score: number;
  contactName?: string;
  contactPhone?: string;
  dueText: string;
  isOverdue?: boolean;
}

export interface DailyStats {
  todayTarget: number;
  todayCompleted: number;
  assignedCount: number;
  verifiedCount: number;
  contactedCount: number;
  repliesCount: number;
  meetingsCount: number;
  olympiadCount: number;
  booksCount: number;
  ordersCount: number;
  fiveDayPlan: {
    dayNumber: number;
    date: string;
    target: number;
    completed: number;
    status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING';
  }[];
}
