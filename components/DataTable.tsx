
import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Application, BBStatus, BBType } from '../types';
import { TableRow } from './TableRow';
import { FunnelIcon } from './icons/FunnelIcon'; // New Icon
import { BbStatusMultiSelectDropdown } from './BbStatusMultiSelectDropdown'; // New Dropdown
import { BbTypeMultiSelectDropdown } from './BbTypeMultiSelectDropdown'; // New Dropdown
import { BB_STATUS_FILTER_OPTIONS, BB_TYPE_FILTER_OPTIONS } from '../constants'; // Options for the dropdown

interface DataTableProps {
  applications: Application[];
  onUpdateApplication: (application: Application) => void;
  selectedBbStatuses: BBStatus[]; // From App.tsx
  onBbStatusFilterChange: (statuses: BBStatus[]) => void; // From App.tsx
  selectedBbTypes: BBType[];
  onBbTypeFilterChange: (types: BBType[]) => void;
}

const TABLE_HEADERS = [
  "Dealer", "Account", "F", "BH",
  "BB Type", "BB Status", "BB Date Filed", "BB Due Date", "BB Amt",
  "Payment",
  "DPD",
  "Registration Status", 
  "Title Status", "Insurance Status",
  "Repo Status", "DLT", "Current Status", "FollowUp", "Action"
];

export const DataTable: React.FC<DataTableProps> = ({ 
  applications, 
  onUpdateApplication,
  selectedBbStatuses,
  onBbStatusFilterChange,
  selectedBbTypes,
  onBbTypeFilterChange,
}) => {
  const [isBbStatusFilterOpen, setIsBbStatusFilterOpen] = useState(false);
  const [bbStatusFilterPosition, setBbStatusFilterPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
  const bbStatusFilterIconRef = useRef<HTMLButtonElement>(null);

  const [isBbTypeFilterOpen, setIsBbTypeFilterOpen] = useState(false);
  const [bbTypeFilterPosition, setBbTypeFilterPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
  const bbTypeFilterIconRef = useRef<HTMLButtonElement>(null);

  const handleBbStatusFilterToggle = () => {
    if (bbStatusFilterIconRef.current) {
      const rect = bbStatusFilterIconRef.current.getBoundingClientRect();
      setBbStatusFilterPosition({ top: rect.bottom + window.scrollY + 5, left: rect.left + window.scrollX });
    }
    setIsBbStatusFilterOpen(prev => !prev);
  };
  
  const handleBbTypeFilterToggle = () => {
    if (bbTypeFilterIconRef.current) {
      const rect = bbTypeFilterIconRef.current.getBoundingClientRect();
      setBbTypeFilterPosition({ top: rect.bottom + window.scrollY + 5, left: rect.left + window.scrollX });
    }
    setIsBbTypeFilterOpen(prev => !prev);
  };

  const handleBbStatusFilterClose = () => {
    setIsBbStatusFilterOpen(false);
  };
  
  const handleBbTypeFilterClose = () => {
    setIsBbTypeFilterOpen(false);
  };

  if (applications.length === 0) {
    return <div className="p-4 text-center text-gray-500">No applications found.</div>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white overflow-hidden">
          <thead style={{ backgroundColor: '#F2F2F2' }}>
            <tr className="divide-x divide-gray-200"> {/* Added divide-x for vertical lines */}
              {TABLE_HEADERS.map(header => (
                <th
                  key={header}
                  scope="col"
                  className={`px-2 py-3 text-[12px] font-medium text-gray-500 uppercase tracking-wider text-center ${ // Applied text-center as default
                    (header === "BB Date Filed" || header === "BB Due Date" || header === "FollowUp") ? "min-w-[100px]" : ""
                  } ${
                    header === "Dealer" ? "min-w-[200px]" : "" 
                  } ${
                    header === "Account" ? "min-w-[120px]" : "" 
                  } ${
                    header === "Payment" ? "min-w-[80px]" : "" // text-center is now default
                  } ${
                    header === "Repo Status" ? "min-w-[90px]" : "" 
                  } ${
                    header === "Current Status" ? "min-w-[100px]" : "" 
                  } ${ // Removed specific text-left/text-center logic here as text-center is default
                    header === "Action" ? "min-w-[120px]" : "" // Ensure Action header has enough width
                  }`}
                >
                  {header === "BB Type" ? (
                    <div className="flex items-center justify-center space-x-1">
                        <span>{header}</span>
                        <button
                            ref={bbTypeFilterIconRef}
                            onClick={handleBbTypeFilterToggle}
                            className={`p-0.5 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${selectedBbTypes.length > 0 ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                            aria-label="Filter BB Type"
                            aria-haspopup="true"
                            aria-expanded={isBbTypeFilterOpen}
                        >
                            <FunnelIcon className="w-4 h-4" />
                        </button>
                    </div>
                  ) : header === "BB Status" ? (
                    <div className="flex items-center justify-center space-x-1"> {/* Added justify-center for BB Status filter icon */}
                      <span>{header}</span>
                      <button
                        ref={bbStatusFilterIconRef}
                        onClick={handleBbStatusFilterToggle}
                        className={`p-0.5 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${selectedBbStatuses.length > 0 ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                        aria-label="Filter BB Status"
                        aria-haspopup="true"
                        aria-expanded={isBbStatusFilterOpen}
                      >
                        <FunnelIcon className="w-4 h-4" /> {/* Updated size */}
                      </button>
                    </div>
                  ) : (
                    header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {applications.map((app, index) => (
              <TableRow key={app.id} application={app} onUpdateApplication={onUpdateApplication} rowIndex={index} />
            ))}
          </tbody>
        </table>
      </div>
      {isBbStatusFilterOpen && ReactDOM.createPortal(
        <BbStatusMultiSelectDropdown
          options={BB_STATUS_FILTER_OPTIONS}
          selectedOptions={selectedBbStatuses}
          onSelectionChange={onBbStatusFilterChange}
          onClose={handleBbStatusFilterClose}
          position={bbStatusFilterPosition}
        />,
        document.body
      )}
      {isBbTypeFilterOpen && ReactDOM.createPortal(
        <BbTypeMultiSelectDropdown
          options={BB_TYPE_FILTER_OPTIONS}
          selectedOptions={selectedBbTypes}
          onSelectionChange={onBbTypeFilterChange}
          onClose={handleBbTypeFilterClose}
          position={bbTypeFilterPosition}
        />,
        document.body
      )}
    </>
  );
};
