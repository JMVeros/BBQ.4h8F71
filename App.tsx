
import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { FilterTabsComponent } from './components/FilterTabs';
import { DataTable } from './components/DataTable';
import { Application, FilterTab, FilterTabKey, BBStatus, BBType } from './types';
import { INITIAL_APPLICATIONS, TAB_KEYS_ORDER, TAB_MOCK_COUNTS } from './constants';

const App: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [activeTabKey, setActiveTabKey] = useState<FilterTabKey>(FilterTabKey.ALL);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isActiveFilterOn, setIsActiveFilterOn] = useState<boolean>(true);
  const [isFollowUpFilterOn, setIsFollowUpFilterOn] = useState<boolean>(false);
  const [selectedBbStatuses, setSelectedBbStatuses] = useState<BBStatus[]>([]);
  const [selectedBbTypes, setSelectedBbTypes] = useState<BBType[]>([]); // New state for BB Type filter

  const calculateTabCounts = useCallback((apps: Application[]): Record<FilterTabKey, number> => {
    const counts = { ...TAB_MOCK_COUNTS }; // Start with mock counts as fallback
    
    counts[FilterTabKey.ALL] = apps.length;
    counts[FilterTabKey.PENDING_FILE] = apps.filter(app => app.internalStatus === FilterTabKey.PENDING_FILE).length;
    counts[FilterTabKey.BB_LETTER_SENT] = apps.filter(app => app.internalStatus === FilterTabKey.BB_LETTER_SENT).length;
    counts[FilterTabKey.DEMAND_LETTER_SENT] = apps.filter(app => app.internalStatus === FilterTabKey.DEMAND_LETTER_SENT).length;
    counts[FilterTabKey.FORCED_ACH_PROCESSED] = apps.filter(app => app.internalStatus === FilterTabKey.FORCED_ACH_PROCESSED).length;
    counts[FilterTabKey.REFERRED_TO_LEGAL] = apps.filter(app => app.internalStatus === FilterTabKey.REFERRED_TO_LEGAL).length;
    counts[FilterTabKey.PAID_SETTLED] = apps.filter(app => app.internalStatus === FilterTabKey.PAID_SETTLED).length;
    
    return TAB_MOCK_COUNTS; // Using mock counts for UI consistency as per original logic
  }, []);

  const [tabCounts, setTabCounts] = useState<Record<FilterTabKey, number>>(calculateTabCounts(INITIAL_APPLICATIONS));

  const filterAndSearchApplications = useCallback(() => {
    let tempApps = [...applications];

    // Filter by Active Tab
    if (activeTabKey !== FilterTabKey.ALL) {
      tempApps = tempApps.filter(app => app.internalStatus === activeTabKey);
    }

    // Filter by "Active" toggle
    if (isActiveFilterOn) {
      tempApps = tempApps.filter(app => app.isActive);
    }

    // Filter by "FollowUp" toggle
    if (isFollowUpFilterOn) {
      tempApps = tempApps.filter(app => app.followUpDate && app.followUpDate.trim() !== '');
    }

    // Filter by selected BB Statuses
    if (selectedBbStatuses.length > 0) {
      tempApps = tempApps.filter(app => selectedBbStatuses.includes(app.bbStatus));
    }

    // Filter by selected BB Types
    if (selectedBbTypes.length > 0) {
      tempApps = tempApps.filter(app => selectedBbTypes.includes(app.bbType));
    }

    // Filter by Search Term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      tempApps = tempApps.filter(app =>
        app.dealer.toLowerCase().includes(lowerSearchTerm) ||
        app.primaryName.toLowerCase().includes(lowerSearchTerm) ||
        app.dlrId.toLowerCase().includes(lowerSearchTerm) ||
        app.shawAccnt.toLowerCase().includes(lowerSearchTerm)
      );
    }
    setFilteredApplications(tempApps);
  }, [applications, activeTabKey, searchTerm, isActiveFilterOn, isFollowUpFilterOn, selectedBbStatuses, selectedBbTypes]); // Added selectedBbTypes

  useEffect(() => {
    filterAndSearchApplications();
  }, [filterAndSearchApplications]);
  
  useEffect(() => {
    setTabCounts(calculateTabCounts(applications));
  }, [applications, calculateTabCounts]);

  const handleUpdateApplication = (updatedApp: Application) => {
    const newApplications = applications.map(app => app.id === updatedApp.id ? updatedApp : app);
    setApplications(newApplications);
    setTabCounts(calculateTabCounts(newApplications)); 
  };
  
  const tabs: FilterTab[] = TAB_KEYS_ORDER.map(key => ({
    key: key,
    label: key,
    count: tabCounts[key] || 0,
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pb-4 md:pb-6 bg-gray-50">
        <div className="bg-[#0b679e] p-4"> 
            <SearchBar
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
            onExport={() => alert('Exporting data...')}
            />
        </div>
        <div className="bg-white p-4"> 
            <FilterTabsComponent 
                tabs={tabs} 
                activeTabKey={activeTabKey} 
                onTabClick={setActiveTabKey} 
                isActiveFilterOn={isActiveFilterOn}
                onIsActiveFilterChange={setIsActiveFilterOn}
                isFollowUpFilterOn={isFollowUpFilterOn}
                onIsFollowUpFilterChange={setIsFollowUpFilterOn}
            />
        </div>
        <div> {/* Removed overflow-x-auto from this div */}
          <DataTable 
            applications={filteredApplications} 
            onUpdateApplication={handleUpdateApplication}
            selectedBbStatuses={selectedBbStatuses} 
            onBbStatusFilterChange={setSelectedBbStatuses} 
            selectedBbTypes={selectedBbTypes}
            onBbTypeFilterChange={setSelectedBbTypes}
          />
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-gray-500 border-t border-gray-200">
        © {new Date().getFullYear()} Veros Credit BBQ. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
