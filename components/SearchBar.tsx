
import React from 'react';

interface SearchBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onClear: () => void;
  onExport: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchTermChange,
  onClear,
  onExport,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center md:justify-end space-y-3 md:space-y-0 md:space-x-3 p-1">
      <input
        type="text"
        placeholder="Search by Dealer, Primary Name, Dlr Id, Shaw Accnt#"
        className="w-full md:w-auto max-w-[400px] px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-700"
        value={searchTerm}
        onChange={(e) => onSearchTermChange(e.target.value)}
      />
      <button
        onClick={() => onSearchTermChange(searchTerm)} // Or trigger search action
        className="px-6 py-2 bg-transparent text-white border border-white rounded-md hover:bg-white/[.1] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
      >
        Search
      </button>
      <button
        onClick={onClear}
        style={{ backgroundColor: '#0dcaf0' }}
        className="px-6 py-2 text-white border border-white rounded-md hover:brightness-90 transition-all focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
      >
        Clear
      </button>
      <button
        onClick={onExport}
        className="px-6 py-2 bg-transparent text-white border border-white rounded-md hover:bg-white/[.1] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-1"
      >
        Export
      </button>
    </div>
  );
};
