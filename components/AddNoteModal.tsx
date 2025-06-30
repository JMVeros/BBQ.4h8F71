import React, { useState, useEffect, useMemo } from 'react';
import { CalendarIcon } from './icons/CalendarIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { CustomDropdown } from './CustomDropdown';
import { EnvelopeIcon } from './icons/EnvelopeIcon';
import { MoneyCheckDollarIcon } from './icons/MoneyCheckDollarIcon'; 
import { PaymentHistoryEntry } from '../types'; 

// Date Utilities
const formatDateToMMDDYY = (dateString: string | undefined): string => {
  if (!dateString) return '';
  const parts = dateString.split('/');
  if (parts.length === 3 && parts[2].length === 4) {
    return `${parts[0]}/${parts[1]}/${parts[2].substring(2)}`;
  } else if (parts.length === 3 && parts[2].length === 2) {
    return dateString; // Already mm/dd/yy
  }
  return dateString; // Fallback
};

const parseMMDDYYToMMDDYYYY = (dateString: string | undefined): string => {
  if (!dateString) return '';
  const parts = dateString.split('/');
  if (parts.length === 3 && parts[2].length === 2) {
    const year = parseInt(parts[2], 10);
    if (!isNaN(year)) {
      return `${parts[0]}/${parts[1]}/20${parts[2].padStart(2, '0')}`;
    }
  } else if (parts.length === 3 && parts[2].length === 4) {
    return dateString; // Already yyyy
  }
  return dateString; // Fallback
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


interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ModalSaveData) => void;
  applicationId: string;
  currentFollowUpDate?: string; // Expected in yyyy
  bbAmt: number; 
  currentPtpDate?: string; // Expected in yyyy
  currentPtpAmount?: string;
}

export interface ModalSaveData {
  followUpDate: string; // yyyy
  promiseToPayDate: string; // yyyy
  ptpAmount: string;
  selectedLetter: string;
  note: string;
  amountPaid: string; 
  paymentDate: string; // yyyy
}

const INITIAL_NOTE_HISTORY = [
  { id: '1', date: '06/12 04:49 PM', user: 'Jeremy Morrison', text: 'Called dealer, left voicemail. Follow-up scheduled.', duration: '(0 Mins)' },
  { id: '2', date: '06/12 04:50 PM', user: 'Jeremy Morrison', text: 'Received email from dealer, requested more information.', duration: '(0 Mins)' },
  { id: '3', date: '06/12 04:50 PM', user: 'Jeremy Morrison', text: 'Initial contact made. Dealer will review documents.', duration: '(0 Mins)' },
  { id: '4', date: '06/11 09:30 AM', user: 'Jane Doe', text: 'Sent demand letter to dealer via certified mail.', duration: '(5 Mins)' },
];

// Initial mock data should use yyyy for dates if they are full dates
const INITIAL_PAYMENT_HISTORY_MOCK: Array<{ id: string; date: string; amount: number; isFinal?: boolean }> = [
  { id: 'p1', date: '01/15/2024', amount: 2500.00 },
  { id: 'p2', date: '12/20/2023', amount: 1750.00, isFinal: true },
];

const LETTER_OPTIONS = [
  "Choose Letter",
  "Check to Dealer",
  "CTD-CB",
  "Current Balance",
  "Demand Letter",
  "Extension of Recourse", // Added new letter
  "Insurance",
  "Legal",
];

const formatNumberWithCommas = (numStr: string | number | undefined): string => {
  if (numStr === undefined || numStr === null || numStr === '') return '0.00';
  const num = parseFloat(String(numStr).replace(/,/g, ''));
  if (isNaN(num)) return '0.00';
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const parseFormattedNumber = (formattedNumStr: string | undefined): string => {
  if (formattedNumStr === undefined || formattedNumStr === null) return '';
  return String(formattedNumStr).replace(/,/g, '');
};


type ActivePage = 'ACTION' | 'PAYMENTS';
type ActiveExpandableSection = 'none' | 'letter' | 'ptp';


export const AddNoteModal: React.FC<AddNoteModalProps> = ({
    isOpen,
    onClose,
    onSave,
    currentFollowUpDate, // yyyy
    bbAmt,
    currentPtpDate, // yyyy
    currentPtpAmount,
}) => {
  const [activePage, setActivePage] = useState<ActivePage>('ACTION');
  // Modal state for dates will hold mm/dd/yy for display and input
  const [followUpDate, setFollowUpDate] = useState(formatDateToMMDDYY(currentFollowUpDate) || '');
  const [promiseToPayDate, setPromiseToPayDate] = useState(formatDateToMMDDYY(currentPtpDate) || '');
  const [ptpAmount, setPtpAmount] = useState(formatNumberWithCommas(currentPtpAmount) || '');
  const [selectedLetter, setSelectedLetter] = useState(LETTER_OPTIONS[0]);
  const [note, setNote] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentDate, setPaymentDate] = useState(''); // mm/dd/yy
  const [markAsFinal, setMarkAsFinal] = useState<boolean>(false);

  const [noteHistory, setNoteHistory] = useState(INITIAL_NOTE_HISTORY);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryEntry[]>([]);
  
  const [activeExpandableSection, setActiveExpandableSection] = useState<ActiveExpandableSection>('none');

  const totalPaid = useMemo(() => {
    return paymentHistory.reduce((sum, p) => sum + p.amount, 0);
  }, [paymentHistory]);

  useEffect(() => {
    if (isOpen) {
      setActivePage('ACTION'); 
      setFollowUpDate(formatDateToMMDDYY(currentFollowUpDate) || '');
      setPromiseToPayDate(formatDateToMMDDYY(currentPtpDate) || '');
      setPtpAmount(formatNumberWithCommas(currentPtpAmount) || '');   
      setSelectedLetter(LETTER_OPTIONS[0]);
      setNote('');
      setAmountPaid('');
      setPaymentDate('');
      setMarkAsFinal(false); 
      setActiveExpandableSection('none');

      const currentBbAmt = typeof bbAmt === 'number' ? bbAmt : 0;
      
      const sortedPayments = INITIAL_PAYMENT_HISTORY_MOCK.slice().sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      let runningBalance = currentBbAmt;
      const initialPaymentsWithBalance = sortedPayments.map(p => {
        runningBalance -= p.amount;
        return {
          id: p.id,
          date: p.date, // Stored as yyyy
          amount: p.amount,
          balance: Math.max(0, runningBalance),
          isFinal: p.isFinal
        };
      }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Sort descending for display

      setPaymentHistory(initialPaymentsWithBalance);
      setNoteHistory(INITIAL_NOTE_HISTORY);
    }
  }, [isOpen, currentFollowUpDate, bbAmt, currentPtpDate, currentPtpAmount]);


  const handleRecordPayment = () => {
    const paid = parseFloat(parseFormattedNumber(amountPaid));

    if (!isNaN(paid) && paid > 0 && paymentDate.trim() !== '') {
      const currentBbAmt = typeof bbAmt === 'number' ? bbAmt : 0;

      // Create a new temporary list of all payments including the new one
      const newPayment = {
        id: `p-${Date.now()}`,
        date: parseMMDDYYToMMDDYYYY(paymentDate),
        amount: paid,
        isFinal: markAsFinal,
        balance: 0, // temp balance
      };

      const allPayments = [...paymentHistory, newPayment]
        .map(p => ({...p})) // create shallow copies to avoid mutation issues
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      // Recalculate all balances chronologically
      let runningBalance = currentBbAmt;
      const updatedPaymentsWithBalances = allPayments.map(p => {
        runningBalance -= p.amount;
        p.balance = Math.max(0, runningBalance);
        return p;
      });

      // Sort descending for final display and update state
      setPaymentHistory(updatedPaymentsWithBalances.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      
      // Clear inputs
      setAmountPaid('');
      setPaymentDate('');
      setMarkAsFinal(false); 
    } else {
      alert("Please enter a valid Amount Paid and Payment Date (mm/dd/yy).");
    }
  };

  const handleSave = () => {
    onSave({
      followUpDate: parseMMDDYYToMMDDYYYY(followUpDate),
      promiseToPayDate: parseMMDDYYToMMDDYYYY(promiseToPayDate),
      ptpAmount: parseFormattedNumber(ptpAmount),
      selectedLetter: selectedLetter === LETTER_OPTIONS[0] ? '' : selectedLetter,
      note,
      amountPaid: parseFormattedNumber(amountPaid), 
      paymentDate: parseMMDDYYToMMDDYYYY(paymentDate),
    });
  };

  if (!isOpen) return null;

  const PageToggleButton: React.FC<{ page: ActivePage; label: string; icon?: React.ReactNode; }> = ({ page, label, icon }) => (
    <button
      onClick={() => setActivePage(page)}
      className={`
        flex-1 flex items-center justify-center space-x-2 py-2.5 px-4
        text-sm font-medium rounded-md
        focus:outline-none 
        transition-all duration-200 ease-in-out
        ${activePage === page 
          ? 'bg-white text-gray-800 shadow-sm' 
          : 'bg-transparent text-gray-600 hover:bg-white/[0.5] hover:text-gray-700' 
        }
        focus:bg-gray-600 focus:text-gray-100 
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  // Use modal's 'promiseToPayDate' state (mm/dd/yy) for display if edited, else currentPtpDate (prop, yyyy)
  const displayPtpDateYY = promiseToPayDate || formatDateToMMDDYY(currentPtpDate);
  const displayPtpAmount = ptpAmount || formatNumberWithCommas(currentPtpAmount);
  // For logic, convert the modal's state to yyyy
  const logicPtpDateYYYY = parseMMDDYYToMMDDYYYY(promiseToPayDate || currentPtpDate);


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="addNoteModalTitle"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 id="addNoteModalTitle" className="text-xl font-semibold text-gray-800">Add Note / Update Account</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-label="Close modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="bg-slate-200 p-1 rounded-lg flex space-x-1 mx-4 my-3">
          <PageToggleButton 
            page="ACTION" 
            label="ACTION" 
            icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 fill-current"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"/></svg>} 
          />
          <PageToggleButton 
            page="PAYMENTS" 
            label="PAYMENTS"
            icon={<MoneyCheckDollarIcon className="w-4 h-4 fill-current" />}
           />
        </div>

        <div className="px-6 pb-6 flex-grow overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          {activePage === 'ACTION' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-semibold text-gray-700">Notes</h3>
                {logicPtpDateYYYY && displayPtpAmount && displayPtpAmount !== '0.00' && isFutureDate(logicPtpDateYYYY) && (
                  <div className="text-sm text-right">
                    <span className="font-medium text-gray-600">PTP: </span>
                    <span className="text-blue-600 font-semibold">{displayPtpDateYY}</span>
                    <span className="text-gray-500"> - </span>
                    <span className="text-blue-600 font-semibold">${displayPtpAmount}</span>
                  </div>
                )}
              </div>
              <div className="p-3 border border-gray-200 rounded-md bg-white max-h-56 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                {noteHistory.length > 0 ? (
                  <ul className="space-y-4 pr-1">
                    {noteHistory.map(entry => (
                      <li key={entry.id} className="flex items-start space-x-3">
                         <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold text-white">
                           {entry.user.charAt(0).toUpperCase()}
                         </div>
                         <div className="flex-grow">
                           <div className="flex items-center space-x-2 mb-1">
                             <span className="text-sm font-medium text-gray-800">{entry.user}</span>
                             <span className="text-xs text-gray-500">{entry.date}</span>
                             <span className="text-xs text-gray-500">{entry.duration}</span>
                           </div>
                           <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-700">
                             {entry.text}
                           </div>
                         </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No note history.</p>
                )}
              </div>

              <div>
                <textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Enter note details..."
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  aria-label="Note details"
                ></textarea>
              </div>

              <div className="mt-2 flex items-center space-x-2"> 
                <button
                  type="button"
                  onClick={() => setActiveExpandableSection(prev => prev === 'letter' ? 'none' : 'letter')}
                  className="px-3 py-2 bg-transparent border border-blue-600 hover:bg-blue-50 text-blue-600 rounded-full focus:outline-none flex items-center space-x-2 focus:ring-0"
                  aria-label="Add Letter"
                  aria-expanded={activeExpandableSection === 'letter'}
                >
                  <EnvelopeIcon className="w-5 h-5" />
                  <span className="text-sm font-medium">Add Letter</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveExpandableSection(prev => prev === 'ptp' ? 'none' : 'ptp')}
                  className="px-3 py-2 bg-transparent border border-blue-600 hover:bg-blue-50 text-blue-600 rounded-full focus:outline-none flex items-center space-x-2 focus:ring-0"
                  aria-label="Add or Edit Promise to Pay Information"
                  aria-expanded={activeExpandableSection === 'ptp'}
                >
                  <MoneyCheckDollarIcon className="w-5 h-5 fill-current" />
                  <span className="text-sm font-medium">
                    {displayPtpDateYY || (displayPtpAmount && displayPtpAmount !== '0.00') ? "Edit PTP Info" : "Add PTP Info"}
                  </span>
                </button>
                
                 <div className="flex-grow"></div> 

                    <button
                        type="button"
                        onClick={() => {
                            if (activeExpandableSection !== 'none') {
                                setActiveExpandableSection('none');
                            }
                        }}
                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-0"
                    >
                        Save
                    </button>
              </div>

                {activeExpandableSection === 'letter' && (
                  <div className="p-2 border border-gray-200 rounded-md shadow-sm bg-white mt-1"> 
                    <div className="flex items-end space-x-2">
                      <div className="flex-grow">
                        <label htmlFor="letterDropdownModalExpand" className="block text-xs font-medium text-gray-700 mb-1">
                          Select Letter Type
                        </label>
                        <CustomDropdown
                          id="letterDropdownModalExpand"
                          options={LETTER_OPTIONS}
                          value={selectedLetter}
                          onChange={(value) => setSelectedLetter(value)}
                          placeholder="Choose Letter"
                          choosePlaceholderValue={LETTER_OPTIONS[0]}
                          buttonDisplayClassName="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white flex justify-between items-center text-left text-sm"
                          buttonTextClassName="text-sm"
                          direction="up" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeExpandableSection === 'ptp' && (
                  <div className="p-2 border border-gray-200 rounded-md shadow-sm bg-white mt-1"> 
                    <div className="flex items-start space-x-2">  
                      <div className="flex-grow">
                        <label htmlFor="promiseToPayDateModalExpand" className="block text-xs font-medium text-gray-700 mb-1">Promise to Pay Date</label>
                        <div className="relative">
                          <input
                            type="text"
                            id="promiseToPayDateModalExpand"
                            value={promiseToPayDate} // This is mm/dd/yy
                            onChange={(e) => setPromiseToPayDate(e.target.value)}
                            placeholder="mm/dd/yy"
                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                          <CalendarIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <label htmlFor="ptpAmountModalExpand" className="block text-xs font-medium text-gray-700 mb-1">PTP Amount</label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm">$</span>
                          <input
                            type="text"
                            id="ptpAmountModalExpand"
                            value={ptpAmount}
                            onChange={(e) => setPtpAmount(e.target.value)}
                            onBlur={(e) => setPtpAmount(formatNumberWithCommas(parseFormattedNumber(e.target.value)))}
                            placeholder="0.00"
                            className="w-full p-2 pl-7 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm bg-white text-right"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          )}

          {activePage === 'PAYMENTS' && (
            <div className="space-y-4">
              {currentPtpDate && currentPtpAmount && currentPtpAmount !== '0.00' && isFutureDate(currentPtpDate) && ( // currentPtpDate is yyyy
                  <div className="mb-4 p-3 border border-blue-200 bg-blue-50 rounded-md text-sm">
                    <span className="font-semibold text-blue-700">Active Promise to Pay: </span>
                    <span className="text-blue-600">{formatDateToMMDDYY(currentPtpDate)}</span>
                    <span className="text-gray-500"> - </span>
                    <span className="text-blue-600">${formatNumberWithCommas(currentPtpAmount)}</span>
                  </div>
              )}
              <div>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Payment Made</h3>
                <div 
                  className="p-3 border border-gray-200 rounded-md bg-gray-50"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                    <div>
                        <label htmlFor="amountPaidModal" className="block text-sm font-medium text-gray-700 mb-1">Amount Paid</label>
                        <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 text-sm">$</span>
                        <input
                            type="text"
                            id="amountPaidModal"
                            value={amountPaid}
                            onChange={(e) => setAmountPaid(e.target.value)}
                            onBlur={(e) => setAmountPaid(formatNumberWithCommas(parseFormattedNumber(e.target.value)))}
                            placeholder="0.00"
                            className="w-full p-2 pl-7 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm bg-white text-right"
                            aria-label="Amount Paid"
                        />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="paymentDateModal" className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                        <div className="relative">
                            <input
                            type="text"
                            id="paymentDateModal"
                            value={paymentDate} // mm/dd/yy
                            onChange={(e) => setPaymentDate(e.target.value)}
                            placeholder="mm/dd/yy"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            aria-label="Payment Date"
                            />
                            <CalendarIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    </div>
                    <div className="mt-3 flex items-center">
                        <input
                            id="markAsFinalPayment"
                            type="checkbox"
                            checked={markAsFinal}
                            onChange={(e) => setMarkAsFinal(e.target.checked)}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="markAsFinalPayment" className="ml-2 text-sm text-gray-700"> 
                            Mark as Final Payment
                        </label>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                        onClick={handleRecordPayment}
                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-0"
                        >
                        Record Payment
                        </button>
                    </div>
                </div>
              </div>

              <div>
                <h3 className="text-md font-semibold text-gray-700 mb-2">Payment History</h3>
                <div className="border border-gray-200 rounded-md bg-white">
                    <div className="max-h-40 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                        {paymentHistory.length > 0 ? (
                            <>
                                <div className="flex justify-between text-xs font-semibold text-gray-500 p-2 border-b sticky top-0 bg-white z-10">
                                    <span className="w-1/4 text-left">Type</span>
                                    <span className="w-1/4 text-left">Date</span>
                                    <span className="w-1/4 text-right pr-2">Amount</span>
                                    <span className="w-1/4 text-right pr-2">Balance</span>
                                </div>
                                <ul className="divide-y divide-gray-100 pr-1">
                                    {paymentHistory.map(entry => (
                                    <li key={entry.id} className="text-sm text-gray-600 flex justify-between p-2 hover:bg-gray-50">
                                        <span className="w-1/4 text-left">{entry.isFinal ? "Paid" : "Payment"}</span>
                                        <span className="w-1/4 text-left">{formatDateToMMDDYY(entry.date)}</span>
                                        <span className="w-1/4 text-right pr-2">
                                            {`$${entry.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                        </span>
                                        <span className="w-1/4 text-right pr-2">${entry.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                    </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <p className="text-sm text-gray-500 p-2">No payment history.</p>
                        )}
                    </div>
                    {paymentHistory.length > 0 && (
                        <div className="flex justify-between text-sm font-semibold p-2 border-t border-gray-200">
                            <span className="w-1/2 text-left text-gray-800">Total Paid</span>
                            <span className="w-1/4 text-right pr-2 text-gray-800">
                                {`$${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            </span>
                            <span className="w-1/4"></span> {/* Empty span for alignment */}
                        </div>
                    )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <div className="flex items-center space-x-4">
            <div className="relative w-40">
                <label htmlFor="followUpDateModal" className="block text-sm font-medium text-gray-700 mb-1 sr-only">Follow-up Date</label>
                <input
                    type="text"
                    id="followUpDateModal"
                    value={followUpDate} // mm/dd/yy
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    placeholder="Follow-up Date (mm/dd/yy)"
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    aria-label="Follow-up Date"
                />
                <CalendarIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};