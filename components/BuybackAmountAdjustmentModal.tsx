import React, { useState, useEffect, useCallback } from 'react';
import { XMarkIcon } from './icons/XMarkIcon';
import { ClipboardDocumentCheckIcon } from './icons/ClipboardDocumentCheckIcon'; // New Icon

interface BuybackAmountAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newBbAmount: number) => void;
  currentBbAmt: number;
}

const formatNumberForInput = (numStr: string | number | undefined): string => {
  if (numStr === undefined || numStr === null || numStr === '') return '0.00';
  const num = parseFloat(String(numStr).replace(/,/g, ''));
  if (isNaN(num)) return '0.00';
  return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const parseInputToNumber = (inputStr: string): number => {
  const parsed = parseFloat(inputStr.replace(/,/g, ''));
  return isNaN(parsed) ? 0 : parsed;
};

// Define initial values based on the provided image for the specific bbAmt
const EXAMPLE_BREAKDOWN_BB_AMT = 10219.78;
const EXAMPLE_VALUES = {
  advanceToDealer: 9753.16,
  balance: 11303.98,
  interestOwing: 32.20,
  discountUnearned: 1216.40,
  docProcessingFee: 100.00,
  bbGps: 0.00,
  repoFees: 0.00,
  bbCpiEst: 0.00,
  servicingFees: 0.00,
  bbPmtRfd: 0.00,
};

export const BuybackAmountAdjustmentModal: React.FC<BuybackAmountAdjustmentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentBbAmt,
}) => {
  const [advanceToDealer, setAdvanceToDealer] = useState('0.00');
  const [balanceAmount, setBalanceAmount] = useState('0.00'); // Renamed to avoid conflict with 'balance' from totals
  const [interestOwing, setInterestOwing] = useState('0.00');
  const [discountUnearned, setDiscountUnearned] = useState('0.00');
  const [docProcessingFee, setDocProcessingFee] = useState('0.00');
  const [bbGps, setBbGps] = useState('0.00');
  const [repoFees, setRepoFees] = useState('0.00');
  const [bbCpiEst, setBbCpiEst] = useState('0.00');
  const [servicingFees, setServicingFees] = useState('0.00');
  const [bbPmtRfd, setBbPmtRfd] = useState('0.00');
  
  const [selectedOption, setSelectedOption] = useState<'currentBalance' | 'checkToDealer'>('currentBalance');

  const [checkToDealerTotal, setCheckToDealerTotal] = useState(0);
  const [currentBalanceTotal, setCurrentBalanceTotal] = useState(0);

  useEffect(() => {
    if (isOpen) {
      if (currentBbAmt === EXAMPLE_BREAKDOWN_BB_AMT) {
        setAdvanceToDealer(formatNumberForInput(EXAMPLE_VALUES.advanceToDealer));
        setBalanceAmount(formatNumberForInput(EXAMPLE_VALUES.balance));
        setInterestOwing(formatNumberForInput(EXAMPLE_VALUES.interestOwing));
        setDiscountUnearned(formatNumberForInput(EXAMPLE_VALUES.discountUnearned));
        setDocProcessingFee(formatNumberForInput(EXAMPLE_VALUES.docProcessingFee));
        setBbGps(formatNumberForInput(EXAMPLE_VALUES.bbGps));
        setRepoFees(formatNumberForInput(EXAMPLE_VALUES.repoFees));
        setBbCpiEst(formatNumberForInput(EXAMPLE_VALUES.bbCpiEst));
        setServicingFees(formatNumberForInput(EXAMPLE_VALUES.servicingFees));
        setBbPmtRfd(formatNumberForInput(EXAMPLE_VALUES.bbPmtRfd));
      } else {
        setAdvanceToDealer(formatNumberForInput(0));
        setBalanceAmount(formatNumberForInput(currentBbAmt));
        setInterestOwing(formatNumberForInput(0));
        setDiscountUnearned(formatNumberForInput(0));
        setDocProcessingFee(formatNumberForInput(100)); // Default DPF
        setBbGps(formatNumberForInput(0));
        setRepoFees(formatNumberForInput(0));
        setBbCpiEst(formatNumberForInput(0));
        setServicingFees(formatNumberForInput(0));
        setBbPmtRfd(formatNumberForInput(0));
      }
      setSelectedOption('currentBalance');
    }
  }, [isOpen, currentBbAmt]);

  const calculateTotals = useCallback(() => {
    const numAdvanceToDealer = parseInputToNumber(advanceToDealer);
    const numBalance = parseInputToNumber(balanceAmount);
    const numInterestOwing = parseInputToNumber(interestOwing);
    const numDiscountUnearned = parseInputToNumber(discountUnearned);
    const numDocProcessingFee = parseInputToNumber(docProcessingFee);
    const numBbGps = parseInputToNumber(bbGps);
    const numRepoFees = parseInputToNumber(repoFees);
    const numBbCpiEst = parseInputToNumber(bbCpiEst);
    const numServicingFees = parseInputToNumber(servicingFees);
    const numBbPmtRfd = parseInputToNumber(bbPmtRfd);

    const calcCheckToDealer = numAdvanceToDealer + numDocProcessingFee;
    setCheckToDealerTotal(calcCheckToDealer);

    const calcCurrentBalance = numBalance - numDiscountUnearned + numInterestOwing + numDocProcessingFee + numBbGps + numRepoFees + numBbCpiEst + numServicingFees - numBbPmtRfd;
    setCurrentBalanceTotal(calcCurrentBalance);
  }, [advanceToDealer, balanceAmount, interestOwing, discountUnearned, docProcessingFee, bbGps, repoFees, bbCpiEst, servicingFees, bbPmtRfd]);

  useEffect(() => {
    if (isOpen) {
      calculateTotals();
    }
  }, [isOpen, calculateTotals]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
  };

  const handleInputBlur = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => () => {
    setter(formatNumberForInput(value));
  };

  const handleSave = () => {
    const amountToSave = selectedOption === 'currentBalance' ? currentBalanceTotal : checkToDealerTotal;
    onSave(amountToSave);
  };
  
  const handleLoadDefaults = () => {
     if (currentBbAmt === EXAMPLE_BREAKDOWN_BB_AMT) {
        setAdvanceToDealer(formatNumberForInput(EXAMPLE_VALUES.advanceToDealer));
        setBalanceAmount(formatNumberForInput(EXAMPLE_VALUES.balance));
        setInterestOwing(formatNumberForInput(EXAMPLE_VALUES.interestOwing));
        setDiscountUnearned(formatNumberForInput(EXAMPLE_VALUES.discountUnearned));
        setDocProcessingFee(formatNumberForInput(EXAMPLE_VALUES.docProcessingFee));
        setBbGps(formatNumberForInput(EXAMPLE_VALUES.bbGps));
        setRepoFees(formatNumberForInput(EXAMPLE_VALUES.repoFees));
        setBbCpiEst(formatNumberForInput(EXAMPLE_VALUES.bbCpiEst));
        setServicingFees(formatNumberForInput(EXAMPLE_VALUES.servicingFees));
        setBbPmtRfd(formatNumberForInput(EXAMPLE_VALUES.bbPmtRfd));
      } else {
        setBalanceAmount(formatNumberForInput(currentBbAmt));
        setDocProcessingFee(formatNumberForInput(100));
        setAdvanceToDealer(formatNumberForInput(0));
        setInterestOwing(formatNumberForInput(0));
        setDiscountUnearned(formatNumberForInput(0));
        setBbGps(formatNumberForInput(0));
        setRepoFees(formatNumberForInput(0));
        setBbCpiEst(formatNumberForInput(0));
        setServicingFees(formatNumberForInput(0));
        setBbPmtRfd(formatNumberForInput(0));
      }
      // calculateTotals will be called by the state updates effect
  };

  if (!isOpen) return null;

  const renderInputField = (label: string, value: string, setter: React.Dispatch<React.SetStateAction<string>>, fieldId: string) => (
    <div className="flex items-center space-x-3 py-1.5">
      <label htmlFor={fieldId} className="w-1/2 text-sm text-gray-700">{label}</label>
      <div className="w-1/2 flex items-center border border-gray-300 rounded-md h-9 overflow-hidden focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
        <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-100 h-full border-r border-gray-300">
          $
        </span>
        <input
          type="text"
          id={fieldId}
          value={value}
          onChange={handleInputChange(setter)}
          onBlur={handleInputBlur(setter, value)}
          className="flex-1 block w-full text-sm h-full text-right px-2 focus:outline-none bg-white"
          placeholder="0.00"
        />
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog" aria-modal="true" aria-labelledby="bbAdjustmentModalTitle">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 id="bbAdjustmentModalTitle" className="text-lg font-semibold text-gray-800">BuyBack Amount Adjustment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md" aria-label="Close modal">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-4 flex-grow overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
          <div className="space-y-1">
            {renderInputField("Advance to Dealer", advanceToDealer, setAdvanceToDealer, "advToDealer")}
            {renderInputField("Balance", balanceAmount, setBalanceAmount, "balance")}
            {renderInputField("Interest Owing", interestOwing, setInterestOwing, "interestOwing")}
            {renderInputField("Discount Unearned", discountUnearned, setDiscountUnearned, "discountUnearned")}
            {renderInputField("Document Processing Fee", docProcessingFee, setDocProcessingFee, "docProcFee")}
            {renderInputField("BB GPS", bbGps, setBbGps, "bbGps")}
            {renderInputField("Repo / Transportation Fees", repoFees, setRepoFees, "repoFees")}
            {renderInputField("BB CPI EST", bbCpiEst, setBbCpiEst, "bbCpiEst")}
            {renderInputField("Servicing Fees", servicingFees, setServicingFees, "servicingFees")}
            {renderInputField("BB PMT RFD", bbPmtRfd, setBbPmtRfd, "bbPmtRfd")}
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md bg-gray-50">
              <div className="flex items-center">
                <input
                  id="radioCheckToDealer"
                  name="buybackOption"
                  type="radio"
                  checked={selectedOption === 'checkToDealer'}
                  onChange={() => setSelectedOption('checkToDealer')}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
                <label htmlFor="radioCheckToDealer" className="ml-2 block text-sm font-medium text-gray-700">
                  Check to Dealer
                </label>
              </div>
              <span className="text-sm font-semibold text-gray-800">{formatNumberForInput(checkToDealerTotal)}</span>
            </div>

            <div className="flex items-center justify-between p-3 border border-blue-500 rounded-md bg-blue-50 ring-1 ring-blue-500">
              <div className="flex items-center">
                <input
                  id="radioCurrentBalance"
                  name="buybackOption"
                  type="radio"
                  checked={selectedOption === 'currentBalance'}
                  onChange={() => setSelectedOption('currentBalance')}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                />
                <label htmlFor="radioCurrentBalance" className="ml-2 block text-sm font-medium text-blue-700">
                  Current Balance
                </label>
              </div>
              <span className="text-sm font-bold text-blue-700">{formatNumberForInput(currentBalanceTotal)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button 
            onClick={handleLoadDefaults} 
            className="p-2 text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            aria-label="Load Defaults"
            title="Load Defaults"
          >
            <ClipboardDocumentCheckIcon className="w-6 h-6" />
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
