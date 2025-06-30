import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Application, BBType, BBStatus, RepoStatus, TitleStatusValue } from '../types';
import { BB_TYPE_OPTIONS, BB_STATUS_OPTIONS } from '../constants';
import { CalendarIcon } from './icons/CalendarIcon';
import { CustomDropdown } from './CustomDropdown';
import { AddNoteModal, ModalSaveData } from './AddNoteModal';
import { BuybackAmountAdjustmentModal } from './BuybackAmountAdjustmentModal';
import { DealerInfoPopup } from './DealerInfoPopup'; // New Import

// Date Utilities
const formatDateToMMDDYY = (dateString: string | undefined): string => {
  if (!dateString) return '';
  const parts = dateString.split('/');
  if (parts.length === 3 && parts[2].length === 4) {
    return `${parts[0]}/${parts[1]}/${parts[2].substring(2)}`;
  } else if (parts.length === 3 && parts[2].length === 2) {
    return dateString; // Already mm/dd/yy
  }
  return dateString; // Fallback for other formats or partial input
};

const parseMMDDYYToMMDDYYYY = (dateString: string | undefined): string => {
  if (!dateString) return '';
  const parts = dateString.split('/');
  if (parts.length === 3 && parts[2].length === 2) {
    const year = parseInt(parts[2], 10);
    if (!isNaN(year)) {
      // Assuming 20xx for all 2-digit years
      return `${parts[0]}/${parts[1]}/20${parts[2].padStart(2, '0')}`;
    }
  } else if (parts.length === 3 && parts[2].length === 4) {
    return dateString; // Already yyyy
  }
  return dateString; // Fallback for other formats or partial input
};


interface TableRowProps {
  application: Application;
  onUpdateApplication: (application: Application) => void;
  rowIndex: number;
}

const parseFormattedNumber = (formattedNumStr: string | undefined): string => {
  if (formattedNumStr === undefined || formattedNumStr === null) return '';
  return String(formattedNumStr).replace(/,/g, '');
};

// isFutureDate expects dateStr in 'mm/dd/yyyy' format
const isFutureDate = (dateStrYYYY: string | undefined): boolean => {
  if (!dateStrYYYY) return false;
  const parts = dateStrYYYY.split('/');
  if (parts.length !== 3) return false; 

  const month = parseInt(parts[0], 10) - 1; 
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  if (isNaN(month) || isNaN(day) || isNaN(year) || year < 1000 || year > 9999) return false; 

  const inputDate = new Date(year, month, day);
  inputDate.setHours(0, 0, 0, 0); 

  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  return inputDate > today;
};

const formatCurrency = (amount: number | undefined): string => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '$0.00';
  }
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};


export const TableRow: React.FC<TableRowProps> = ({ application, onUpdateApplication, rowIndex }) => {
  const [editedApp, setEditedApp] = useState<Application>(application);
  const [isDirty, setIsDirty] = useState(false); // General dirtiness for any field
  const [isCoreDataDirty, setIsCoreDataDirty] = useState(false); // For the green save button
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isBbAmtModalOpen, setIsBbAmtModalOpen] = useState(false); 

  // Individual dirty states for core fields
  const [isBbTypeDirty, setIsBbTypeDirty] = useState(false);
  const [isBbStatusDirty, setIsBbStatusDirty] = useState(false);
  const [isBbDateFiledDirty, setIsBbDateFiledDirty] = useState(false);
  const [isBbDueDateDirty, setIsBbDueDateDirty] = useState(false);
  const [isBbAmtDirty, setIsBbAmtDirty] = useState(false);
  const [isFollowUpDateDirty, setIsFollowUpDateDirty] = useState(false);

  // State for DealerInfoPopup
  const [showDealerPopup, setShowDealerPopup] = useState(false);
  const [dealerPopupPosition, setDealerPopupPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
  const dealerNameRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    setEditedApp(application);
    setIsDirty(false);
    // Resetting specific dirty flags when the source application changes
    setIsBbTypeDirty(false);
    setIsBbStatusDirty(false);
    setIsBbDateFiledDirty(false);
    setIsBbDueDateDirty(false);
    setIsBbAmtDirty(false);
    setIsFollowUpDateDirty(false);
    setIsCoreDataDirty(false);
  }, [application]);

  useEffect(() => {
    // Dates in application and editedApp are stored as mm/dd/yyyy
    const bbTypeChanged = application.bbType !== editedApp.bbType;
    const bbStatusChanged = application.bbStatus !== editedApp.bbStatus;
    const bbDateFiledChanged = application.bbDateFiled !== editedApp.bbDateFiled;
    const bbDueDateChanged = application.bbDueDate !== editedApp.bbDueDate;
    const bbAmtChanged = application.bbAmt !== editedApp.bbAmt;
    const followUpDateChanged = application.followUpDate !== editedApp.followUpDate;

    setIsBbTypeDirty(bbTypeChanged);
    setIsBbStatusDirty(bbStatusChanged);
    setIsBbDateFiledDirty(bbDateFiledChanged);
    setIsBbDueDateDirty(bbDueDateChanged);
    setIsBbAmtDirty(bbAmtChanged);
    setIsFollowUpDateDirty(followUpDateChanged);
    
    setIsCoreDataDirty(
        bbTypeChanged || 
        bbStatusChanged || 
        bbDateFiledChanged || 
        bbDueDateChanged || 
        bbAmtChanged ||
        followUpDateChanged
    );

  }, [
    editedApp.bbType, 
    editedApp.bbStatus, 
    editedApp.bbDateFiled, 
    editedApp.bbDueDate, 
    editedApp.bbAmt,
    editedApp.followUpDate,
    application.bbType, 
    application.bbStatus, 
    application.bbDateFiled, 
    application.bbDueDate,
    application.bbAmt,
    application.followUpDate
  ]);


  const handleChange = <K extends keyof Application,>(field: K, value: Application[K]) => {
    setEditedApp(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };
  
  const handleSelectChange = (field: keyof Application, value: string) => {
    if (field === 'bbType') {
      setEditedApp(prev => ({ ...prev, [field]: value as BBType }));
    } else if (field === 'bbStatus') {
      setEditedApp(prev => ({ ...prev, [field]: value as BBStatus }));
    } else if (field === 'repoStatus') {
      setEditedApp(prev => ({ ...prev, [field]: value as RepoStatus }));
    } else if (field === 'titleStatus') { 
      setEditedApp(prev => ({ ...prev, [field]: value as TitleStatusValue }));
    }
    else {
       setEditedApp(prev => ({ ...prev, [field]: value }));
    }
    setIsDirty(true);
  };

  const handleDateChange = (field: keyof Application, value: string) => {
    // value is raw from input, could be mm/dd/yy or partial
    if (value === "" || /^\d{0,2}(\/(\d{0,2}(\/(\d{0,2})?)?)?)?$/.test(value)) {
        const parts = value.split('/');
        if (parts.length === 3 && parts[2].length === 2) {
            // If user typed full mm/dd/yy, store as mm/dd/yyyy
            handleChange(field, parseMMDDYYToMMDDYYYY(value));
        } else if (parts.length === 3 && parts[2].length === 4) {
            // If user typed full mm/dd/yyyy
            handleChange(field, value);
        } else {
            // Store partial input as is, or an empty string if it becomes invalid
            // (Note: editedApp.fieldName will be used by formatDateToMMDDYY for display,
            // so partial yyyy dates in editedApp might display oddly until fixed.
            // However, since we parse mm/dd/yy to mm/dd/yyyy, editedApp should hold yyyy for completed dates)
            handleChange(field, value);
        }
    }
  };


  const handleSaveTableRow = () => { 
    // Ensure all date fields in editedApp are in yyyy format before saving
    // This is mostly already handled by handleDateChange for fields edited in TableRow
    // For safety, can re-parse here, but ideally editedApp is already correct.
    const appToSave = {
        ...editedApp,
        bbDateFiled: parseMMDDYYToMMDDYYYY(editedApp.bbDateFiled),
        bbDueDate: parseMMDDYYToMMDDYYYY(editedApp.bbDueDate),
        followUpDate: parseMMDDYYToMMDDYYYY(editedApp.followUpDate),
    };
    onUpdateApplication(appToSave);
    // Dirty states will be reset by the useEffect listening to `application` prop update
  };

  const handleOpenActionModal = () => {
    setIsActionModalOpen(true);
  };

  const handleCloseActionModal = () => {
    setIsActionModalOpen(false);
  };

  const handleSaveNoteModal = (data: ModalSaveData) => {
    // data from ModalSaveData already has dates in yyyy format
    let finalPtpAmount: number | undefined = undefined;
    if (data.ptpAmount && data.ptpAmount.trim() !== '') {
      const parsed = parseFloat(parseFormattedNumber(data.ptpAmount));
      if (!isNaN(parsed)) {
        finalPtpAmount = parsed;
      }
    }
  
    setEditedApp(prev => {
      const newEditedState: Application = {
        ...prev,
        followUpDate: data.followUpDate, // yyyy
        ptpAmount: finalPtpAmount,
        promiseToPayDate: data.promiseToPayDate, // yyyy
        hasNote: !!data.note || prev.hasNote,
      };
      onUpdateApplication(newEditedState);
      return newEditedState;
    });
  
    setIsActionModalOpen(false);
  };

  const handleOpenBbAmtModal = () => {
    setIsBbAmtModalOpen(true);
  };

  const handleCloseBbAmtModal = () => {
    setIsBbAmtModalOpen(false);
  };

  const handleSaveBbAmtModal = (newBbAmt: number) => {
    const updatedAppWithNewBbAmt = { ...editedApp, bbAmt: newBbAmt };
    setEditedApp(updatedAppWithNewBbAmt); 
    onUpdateApplication(updatedAppWithNewBbAmt); 
    setIsBbAmtModalOpen(false);
  };

  const handleDealerNameClick = () => {
    if (dealerNameRef.current) {
      const rect = dealerNameRef.current.getBoundingClientRect();
      const popupTop = rect.top + window.scrollY;
      const popupLeft = rect.right + window.scrollX + 10; 
      
      setDealerPopupPosition({ top: popupTop, left: popupLeft });
      setShowDealerPopup(true);
    }
  };

  const handleCloseDealerPopup = () => {
    setShowDealerPopup(false);
  };


  const rowBgClass = rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50';
  
  const baseDropdownStylesForRow = "w-full appearance-none bg-white px-2 py-2 text-[12px] focus:outline-none focus:ring-1 flex justify-between items-center rounded-md";
  const baseDateInputStyles = "w-full rounded-md px-2 py-2 text-[12px] bg-white";

  const getDisplayLoanInsuranceStatus = (status: string): string => {
    const activeStatuses = ["Customer Provided", "Active"];
    return activeStatuses.includes(status) ? "ACTIVE" : "NOT ACTIVE";
  };

  return (
    <>
      <tr className={`${rowBgClass} hover:bg-blue-50 transition-colors duration-150 min-h-[90px] divide-x divide-gray-200`}>
        <td className="px-2 py-2 text-[12px] text-gray-700 align-middle pr-3">
          <div 
            ref={dealerNameRef}
            className="whitespace-nowrap cursor-pointer hover:text-blue-600"
            onClick={handleDealerNameClick}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleDealerNameClick(); }}
            role="button"
            tabIndex={0}
            aria-haspopup="true"
            aria-expanded={showDealerPopup}
          >
            {editedApp.dealer} <span className="text-gray-500">({editedApp.dealerIdNum})</span>
          </div>
          <div className="text-gray-600">
            {editedApp.dlrId} / {editedApp.br} / {editedApp.rsm}
          </div>
        </td>
        <td className="px-2 py-2 text-[12px] text-gray-700 align-middle pr-0">
          <div>{editedApp.shawAccnt}</div>
          <div>{editedApp.primaryName}</div>
        </td>
        <td className="px-3 py-2 text-[12px] text-gray-700 text-right align-middle whitespace-nowrap">{editedApp.fund}</td>
        <td className="px-2 py-2 text-[12px] text-gray-700 text-right align-middle whitespace-nowrap pr-3">{editedApp.bh}</td>
        
        <td className="px-2 py-2 text-[12px] align-middle whitespace-nowrap pr-3">
          <CustomDropdown
            options={BB_TYPE_OPTIONS}
            value={editedApp.bbType}
            onChange={(newValue) => handleSelectChange('bbType', newValue)}
            placeholder={BBType.CHOOSE_TYPE}
            choosePlaceholderValue={BBType.CHOOSE_TYPE}
            id={`bbType-${application.id}`}
            buttonDisplayClassName={`${baseDropdownStylesForRow} ${isBbTypeDirty ? 'ring-2 ring-green-500 border-green-500' : 'border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'}`}
          />
        </td>

        <td className="px-2 py-2 text-[12px] align-middle whitespace-nowrap pr-3">
          <CustomDropdown
            options={BB_STATUS_OPTIONS}
            value={editedApp.bbStatus}
            onChange={(newValue) => handleSelectChange('bbStatus', newValue)}
            placeholder={BBStatus.CHOOSE_STATUS}
            choosePlaceholderValue={BBStatus.CHOOSE_STATUS}
            id={`bbStatus-${application.id}`}
            buttonDisplayClassName={`${baseDropdownStylesForRow} ${isBbStatusDirty ? 'ring-2 ring-green-500 border-green-500' : 'border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'}`}
          />
        </td>
        
        <td className={`px-2 py-2 text-[12px] align-middle whitespace-nowrap pr-3 min-w-[100px]`}>
            <div className="relative">
                <input
                type="text"
                placeholder="mm/dd/yy"
                value={formatDateToMMDDYY(editedApp.bbDateFiled)}
                onChange={(e) => handleDateChange('bbDateFiled', e.target.value)}
                className={`${baseDateInputStyles} ${isBbDateFiledDirty ? 'ring-2 ring-green-500 border-green-500' : 'border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'}`}
                />
                <CalendarIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
            </div>
        </td>
        <td className={`px-2 py-2 text-[12px] align-middle whitespace-nowrap pr-3 min-w-[100px]`}>
            <div className="relative">
                <input
                type="text"
                placeholder="mm/dd/yy"
                value={formatDateToMMDDYY(editedApp.bbDueDate)}
                onChange={(e) => handleDateChange('bbDueDate', e.target.value)}
                className={`${baseDateInputStyles} ${isBbDueDateDirty ? 'ring-2 ring-green-500 border-green-500' : 'border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'}`}
                />
                <CalendarIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
            </div>
        </td>
        
        <td className="px-2 py-2 text-[12px] text-gray-700 text-right align-middle whitespace-nowrap pr-3">
          <div 
              className={`w-full text-right cursor-pointer bg-white active:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-600 rounded-md px-2 py-2 text-[12px] ${
                isBbAmtDirty ? 'ring-2 ring-green-500 border-green-500' : 'border border-gray-300'
              }`}
              onClick={handleOpenBbAmtModal}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpenBbAmtModal();}}
              aria-label="Open modal to view/edit BB Amount Adjustment"
            >
            {formatCurrency(editedApp.bbAmt)}
          </div>
        </td>

        <td className="px-2 py-2 text-[12px] text-gray-700 align-middle text-right whitespace-nowrap">
          {editedApp.promiseToPayDate && editedApp.ptpAmount != null && isFutureDate(editedApp.promiseToPayDate) ? ( // editedApp.promiseToPayDate is yyyy
            <div>
              <div className="font-semibold">{formatCurrency(editedApp.ptpAmount)}</div>
              <div className="text-gray-500 text-[10px]">{formatDateToMMDDYY(editedApp.promiseToPayDate)}</div>
            </div>
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </td>
        
        <td className="px-2 py-2 text-[12px] text-gray-700 text-right align-middle whitespace-nowrap pr-3">{editedApp.dpd}</td>
        
        <td className="px-2 py-2 text-[12px] text-gray-700 align-middle pr-3"> 
          <div>{editedApp.registrationStatus}</div>
          {editedApp.registrationIssueDate && (
            <div className="text-[11px] text-gray-500">Issued: {formatDateToMMDDYY(editedApp.registrationIssueDate)}</div>
          )}
        </td>
        <td className="px-2 py-2 text-[12px] text-gray-700 align-middle whitespace-nowrap pr-3">
          <div>{editedApp.titleStatus}</div>
          {editedApp.titleStatus === TitleStatusValue.RECEIVED && editedApp.titleReceivedDate && (
            <div className="text-[11px] text-gray-500">{formatDateToMMDDYY(editedApp.titleReceivedDate)}</div>
          )}
        </td>
        <td className="px-2 py-2 text-[12px] text-gray-700 align-middle whitespace-nowrap pr-3">
          {getDisplayLoanInsuranceStatus(editedApp.loanInsuranceStatus)}
        </td>
        
        <td className="px-2 py-2 text-[12px] text-gray-700 align-middle pr-3">{editedApp.repoStatus}</td> 
        <td className="px-2 py-2 text-[12px] text-gray-700 text-right align-middle whitespace-nowrap pr-3">{editedApp.dlt}</td>
        <td className="px-2 py-2 text-[12px] text-gray-500 align-middle pr-3">{editedApp.currentStatusDisplay}</td>

        <td className="px-2 py-2 text-[12px] align-middle whitespace-nowrap pr-3 min-w-[100px]">
          <div className="relative">
              <input
              type="text"
              placeholder="mm/dd/yy"
              value={formatDateToMMDDYY(editedApp.followUpDate)}
              onChange={(e) => handleDateChange('followUpDate', e.target.value)}
              className={`w-full rounded-md px-2 py-2 text-[12px] bg-white ${isFollowUpDateDirty ? 'ring-2 ring-green-500 border-green-500' : 'border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'}`}
              />
              <CalendarIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
          </div>
        </td>
        
        <td className="px-2 py-2 text-[12px] align-middle whitespace-nowrap">
          <div className="flex items-center space-x-1">
            <button
              onClick={handleSaveTableRow}
              disabled={!isCoreDataDirty}
              className={`flex-1 px-3 py-2 text-[12px] font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1
              ${isCoreDataDirty
                  ? 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed focus:ring-gray-300'}`}
              aria-label="Save core field changes"
            >
              Save
            </button>
            <button
              onClick={handleOpenActionModal}
              className={`flex-1 px-3 py-2 text-[12px] font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 bg-[#0070C0] text-white hover:bg-[#005699] focus:ring-[#0070C0]`}
              aria-label="Open action modal"
            >
              Action
            </button>
          </div>
        </td>
      </tr>
      {isActionModalOpen && (
        <AddNoteModal
          isOpen={isActionModalOpen}
          onClose={handleCloseActionModal}
          onSave={handleSaveNoteModal}
          applicationId={application.id}
          currentFollowUpDate={editedApp.followUpDate} // Pass yyyy
          bbAmt={editedApp.bbAmt}
          currentPtpDate={editedApp.promiseToPayDate} // Pass yyyy
          currentPtpAmount={editedApp.ptpAmount?.toString()}
        />
      )}
      {isBbAmtModalOpen && ( 
        <BuybackAmountAdjustmentModal
          isOpen={isBbAmtModalOpen}
          onClose={handleCloseBbAmtModal}
          onSave={handleSaveBbAmtModal}
          currentBbAmt={editedApp.bbAmt}
        />
      )}
      {showDealerPopup && ReactDOM.createPortal(
        <DealerInfoPopup
          application={editedApp}
          position={dealerPopupPosition}
          onClose={handleCloseDealerPopup}
        />,
        document.body
      )}
    </>
  );
};
