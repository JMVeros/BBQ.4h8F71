
import React, { useEffect, useRef } from 'react';
import { BBStatus } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';

interface BbStatusMultiSelectDropdownProps {
  options: BBStatus[];
  selectedOptions: BBStatus[];
  onSelectionChange: (newSelected: BBStatus[]) => void;
  onClose: () => void;
  position: { top: number; left: number };
}

export const BbStatusMultiSelectDropdown: React.FC<BbStatusMultiSelectDropdownProps> = ({
  options,
  selectedOptions,
  onSelectionChange,
  onClose,
  position,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleCheckboxChange = (option: BBStatus) => {
    const newSelectedOptions = selectedOptions.includes(option)
      ? selectedOptions.filter(item => item !== option)
      : [...selectedOptions, option];
    onSelectionChange(newSelectedOptions);
  };

  const handleSelectAll = () => {
    onSelectionChange(options);
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  return (
    <div
      ref={dropdownRef}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      className="fixed bg-white border border-gray-300 rounded-md shadow-lg w-72 z-[100] flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-labelledby="bbstatus-filter-title"
    >
      <div className="flex justify-between items-center p-3 border-b border-gray-200">
        <h3 id="bbstatus-filter-title" className="text-sm font-semibold text-gray-700">Filter by BB Status</h3>
        <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-sm p-0.5"
            aria-label="Close filter"
        >
            <XMarkIcon className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3 border-b border-gray-200 flex space-x-2">
        <button
          onClick={handleSelectAll}
          className="flex-1 text-xs px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          Select All
        </button>
        <button
          onClick={handleClearAll}
          className="flex-1 text-xs px-2 py-1 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          Clear All
        </button>
      </div>

      <div className="p-1 overflow-y-auto max-h-60" style={{ scrollbarWidth: 'thin'}}>
        {options.map(option => (
          <label
            key={option}
            className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={() => handleCheckboxChange(option)}
              className="h-3.5 w-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
            />
            <span className="text-xs text-gray-700">{option}</span>
          </label>
        ))}
      </div>
      <div className="p-3 border-t border-gray-200 flex justify-end">
        <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
        >
            Close
        </button>
      </div>
    </div>
  );
};
