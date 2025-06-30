
export enum BBType {
  CHOOSE_TYPE = "Choose Type",
  AUL_SHORTAGE = "Aul Shortage",
  BB_LEGAL_BUYBACK = "BB Legal Buyback",
  BREACH_OF_MASTER_DEALER_AGREEMENT = "Breach of Master Dealer Agreement",
  BUYBACK_FILED = "Buyback Filed",
  BUYBACK_REQUESTED = "Buyback Requested",
  COMPLIANCE_HOLD = "Compliance Hold",
  COURTESY_BUYBACK = "Courtesy Buyback",
  DEALER_BUYBACK = "Dealer Buyback",
  DPAR_REQUEST = "DPAR request",
  FIRST_PAYMENT_DEFAULT = "First Payment Default",
  GAP_REQUEST = "Gap Request",
  KBB_DISCREPANCY = "KBB Discrepancy", // Corrected spelling
  RECOURSE_ACCOUNT = "Recourse Account",
  TB_LEGAL_BUYBACK = "TB Legal Buyback",
  TITLE_BUYBACK = "Title Buyback",
  UNWIND = "Unwind",
  VOLUNTARY_SURRENDER_TYPE = "Voluntary Surrender", // Added _TYPE to avoid conflict with BBStatus
  WARRANTY_CANCELLATION = "Warranty Cancellation",
}

export enum BBStatus {
  CHOOSE_STATUS = "Choose Status",
  S_3P_GAP_PAID = "3P GAP Paid", // Prefixed with S_ to make it a valid enum key
  ACTIVE_ARRANGEMENTS = "Active Arrangements",
  ACTIVE_INSTALLMENTS = "Active Installments",
  ADDITIONAL_RECOURSE_RECEIVED = "Additional Recourse Received",
  APPROVED_CUST_PTP = "Approved Cust PTP",
  ATPC_RECEIVED = "ATPC Received",
  ATPC_REQUESTED = "ATPC Requested",
  AUL_CALL_MADE = "AUL Call Made",
  AUL_LETTER_SENT = "AUL Letter Sent",
  AUL_PAID = "AUL Paid",
  BB_ACH_PENDING = "BB ACH Pending",
  BB_ACH_RETURNED_FWD_TO_LEGAL = "BB ACH Returned/FWD to Legal",
  BB_CHECK_PROCESSED = "BB Check Processed",
  BB_CORP_LEGAL_DLR_COLLECT = "BB Corp Legal - Dlr Collect",
  BB_CORP_LEGAL_DLR_NOT_COLLECT = "BB Corp Legal - Dlr Not Collect",
  BRANDED_HISTORY = "Branded History",
  BRANDED_TITLE = "Branded Title",
  BUYBACK_PAID = "Buyback Paid",
  BUYBACK_PAID_OFR = "Buyback Paid - OFR",
  BUYBACK_SETTLED = "Buyback Settled",
  CALLED_DEALER = "Called Dealer", // Handles duplicate "Dealer Called"
  CLOSE_AS_A_BB = "Close as a BB",
  CLOSED_WITHIN_RCRS = "Closed within RCRS",
  CO_BUYBACK_PAID = "CO Buyback Paid",
  CORP_LEGAL = "Corp Legal",
  CUSTOMER_CLAIMS_AGAINST_DEALER = "Customer Claims Against Dealer",
  CUSTOMER_FRAUD = "Customer Fraud",
  CUSTOMER_NOT_COOPERATING = "Customer Not Cooperating",
  DEAD_BUYBACK = "Dead Buyback",
  DEAD_CHARGE_OFF = "Dead Charge Off",
  DEALER_FRAUD = "Dealer Fraud",
  DEALER_OOB = "Dealer OOB",
  DEALER_TO_SECURE_OWN_UNIT = "Dealer to Secure Own Unit",
  DEFERRED_PICK_PAYMENT = "Deferred Pick Payment",
  DEMAND_LETTER_REQUESTED = "Demand letter requested",
  DEMAND_LETTER_SENT_STATUS = "Demand Letter Sent", // Added _STATUS to differentiate if needed, consistent with FilterTabKey
  DPAR_PAID = "DPAR Paid",
  EMAILED_DEALER = "Emailed Dealer",
  EXECUTIVE_WAIVE = "Executive Waive",
  EXT_OF_RCRS_AND_SEC_DEP_REQ = "Ext of Rcrs & Sec Dep Req",
  EXTENSION_OF_RECOURSE_REQUESTED = "Extension of Recourse Requested",
  FORCED_ACH = "Forced ACH",
  GAP_CLAIM_PAID_OUT = "GAP Claim Paid Out",
  GAP_REFUND_PAID = "Gap Refund Paid",
  GAP_REFUND_REQUEST = "Gap Refund Request",
  IDENTITY_THEFT = "Identity Theft",
  INS_CLAIM_PENDING = "Ins Claim Pending",
  INS_CLAIM_REPAIRABLE = "Ins Claim Repairable",
  INS_CLAIM_TTL = "Ins Claim TTL",
  JUDGMENT_ENTERED = "Judgment Entered",
  KBB_PAID = "KBB Paid",
  KBB_PAST = "KBB Past",
  KBB_SETTLED = "KBB Settled",
  LEGAL_NOT_PURSUED = "Legal Not Pursued",
  LETTER_SENT = "Letter Sent",
  LIEN_REMOVAL = "Lien Removal",
  LMTCB = "LMTCB",
  MANAGER_REVIEW = "Manager Review",
  MANAGER_WAIVE = "Manager Waive",
  MECHANICAL_ISSUES = "Mechanical Issues",
  MONITOR_BUYBACK = "Monitor BuyBack",
  MULTIPLE_ANCILLARY_DUE = "Multiple Ancillary Due",
  NEW_BB_CONTACT_DEALER = "New BB - Contact Dealer",
  NO_BREACH_FOUND = "No Breach Found",
  NO_MECHANICAL_ISSUES = "No Mechanical Issues",
  OPEN_INSURANCE_CLAIM = "Open Insurance Claim",
  OUT_FOR_REPO = "Out for Repo",
  PARTIAL_BUYBACK_PAID = "Partial Buyback Paid",
  PARTIAL_REPU_POSTED = "Partial REPU Posted",
  PENDING_DEALER_ARRANGEMENTS = "Pending Dealer Arrangements",
  PENDING_TITLE_FROM_AUCTION = "Pending Title from Auction",
  POSTDATED_CK_INHOUSE = "Postdated Ck Inhouse",
  REFERRED_TO_LEGAL_STATUS = "Referred to Legal", // Added _STATUS for consistency
  REPO_BUYBACK = "Repo Buyback",
  REPU_POSTED = "REPU Posted",
  REQ_ASSIST_FROM_RSM = "Req Assist from RSM",
  SECURED_TITLE = "Secured Title",
  SMALL_BALANCE_NO_LEGAL = "Small Balance - No Legal",
  STRAW_PURCHASE = "Straw Purchase",
  TBB_PAID = "TBB Paid",
  TBD_PART = "TBD Part",
  TITLE_PERFECTED = "Title Perfected",
  UNDER_AM_REVIEW = "Under AM Review",
  UNDER_MECHANICAL_REVIEW = "Under Mechanical Review",
  UNPAID_GAP_WARR = "Unpaid GAP/WARR",
  UNPAID_TRADE = "Unpaid Trade",
  VC_GAP_WAIVED = "VC GAP Waived",
  VEHICLE_REPAIRED = "Vehicle Repaired",
  VEHICLE_REPOSSESSED_STATUS = "Vehicle Repossessed", // Added _STATUS
  VEHICLE_SURRENDERED_AT_DLR = "Vehicle Surrendered at Dlr",
  VOLUNTARY_SURRENDER_STATUS = "Voluntary Surrender", // Added _STATUS
  VR_RECEIVED = "VR Received",
  WARRANTY_PAID = "Warranty Paid",
  WC_DEMAND_LETTER_SENT = "WC Demand Letter Sent",
  WC_LEGAL_BUYBACK = "WC Legal Buyback",
}


export enum RepoStatus {
  NONE = "-",
  PENDING_RECOVERY = "Pending Recovery",
  REPOSSESSED = "Repossessed",
  SOLD = "Sold",
}

export enum FilterTabKey {
  ALL = "All",
  PENDING_FILE = "Pending File",
  BB_LETTER_SENT = "BB Letter Sent",
  DEMAND_LETTER_SENT = "Demand Letter Sent", // Matches BBStatus.DEMAND_LETTER_SENT_STATUS
  FORCED_ACH_PROCESSED = "Forced ACH Processed",
  REFERRED_TO_LEGAL = "Referred to Legal", // Matches BBStatus.REFERRED_TO_LEGAL_STATUS
  PAID_SETTLED = "Paid / Settled",
}

export enum TitleStatusValue {
  RECEIVED = "Received",
  OUTSTANDING = "Outstanding",
}

export type DealerType = 'Franchise' | 'Non Franchise' | 'Treat as Franchise';

export interface Application {
  id: string;
  dealer: string;
  dealerIdNum: string; // for display like (6601)
  primaryName: string;
  dlrId: string;
  br: number;
  rsm: string;
  fund: number;
  bh: number;
  shawAccnt: string;
  bbType: BBType;
  bbStatus: BBStatus;
  bbDateFiled: string; // "mm/dd/yyyy" or ""
  bbDueDate: string; // "mm/dd/yyyy" or ""
  bbAmt: number;
  dpd: number;
  repoStatus: RepoStatus | string; // Allow string for flexibility if new statuses come from backend
  dlt: number;
  currentStatusDisplay: string; // Text to display, might be "-" or status name
  followUpDate: string; // "mm/dd/yyyy" or ""
  ptp: boolean;
  hasNote: boolean;
  ltrSent: boolean;
  isActive: boolean; // For the "Active" toggle filter
  internalStatus: FilterTabKey; // Represents the application's actual status category

  // Fields for dealer info popup
  dealerAddressLine1: string;
  dealerAddressLine2: string;
  dealerPhone: string;
  dealerEmail: string;
  dealerType: DealerType;

  // New fields
  insuranceStatus: string; 
  registrationStatus: string;
  registrationIssueDate: string; // "mm/dd/yyyy" or ""
  titleStatus: TitleStatusValue; 
  titleReceivedDate: string; // "mm/dd/yyyy" or ""
  loanInsuranceStatus: string;

  // Fields for Promise to Pay from modal
  promiseToPayDate?: string; // "mm/dd/yyyy" or ""
  ptpAmount?: number; // Optional: stores the monetary amount
}

export interface FilterTab {
  key: FilterTabKey;
  label: string;
  count: number;
}

export interface PaymentHistoryEntry {
  id: string;
  date: string; // "mm/dd/yyyy"
  amount: number;
  balance: number;
  isFinal?: boolean;
}
