import React from 'react';
import { FilterTab, FilterTabKey } from '../types';
import { ToggleSwitch } from './ToggleSwitch'; // Import ToggleSwitch

interface FilterTabsProps {
  tabs: FilterTab[];
  activeTabKey: FilterTabKey;
  onTabClick: (tabKey: FilterTabKey) => void;
  isActiveFilterOn: boolean;
  onIsActiveFilterChange: (isOn: boolean) => void;
  isFollowUpFilterOn: boolean;
  onIsFollowUpFilterChange: (isOn: boolean) => void;
}

export const FilterTabsComponent: React.FC<FilterTabsProps> = ({ 
  tabs, 
  activeTabKey, 
  onTabClick,
  isActiveFilterOn,
  onIsActiveFilterChange,
  isFollowUpFilterOn,
  onIsFollowUpFilterChange 
}) => {
  return (
    // Main container: stacks on small, row on sm and up. Aligns to start, justifies between on sm and up.
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
      
      {/* Container for tabs: allows wrapping, adds gap, takes full width on small, auto on sm and up. Margin bottom on small for spacing. */}
      <div className="flex flex-wrap gap-2 w-full sm:w-auto mb-3 sm:mb-0">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabClick(tab.key)}
            className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-all duration-150 ease-in-out
              focus:outline-none
              ${
                activeTabKey === tab.key
                  ? 'bg-[#0070C0] text-white shadow-md'
                  : 'bg-white text-[#0070C0] border border-blue-300 hover:bg-blue-50 hover:border-[#0070C0] hover:text-[#005699] focus:border-[#0070C0]'
              }`}
          >
            {tab.label}
            <span
              className={`ml-1.5 inline-block px-1.5 py-0.5 text-[11px] font-semibold rounded-full
              ${
                activeTabKey === tab.key
                  ? 'bg-white text-[#0070C0]'
                  : 'bg-[#e5f1fa] text-[#0070C0]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Container for toggles: centered on small, end-aligned on sm and up. Flex-shrink for side-by-side. */}
      <div className="flex items-center space-x-4 w-full sm:w-auto justify-center sm:justify-end sm:pl-4 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Active</span>
          <ToggleSwitch isOn={isActiveFilterOn} handleToggle={() => onIsActiveFilterChange(!isActiveFilterOn)} />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">FollowUp</span>
          <ToggleSwitch isOn={isFollowUpFilterOn} handleToggle={() => onIsFollowUpFilterChange(!isFollowUpFilterOn)} color="gray" />
        </div>
      </div>
    </div>
  );
};