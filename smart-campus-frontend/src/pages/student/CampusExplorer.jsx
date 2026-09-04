import React, { useState, useEffect, useCallback } from 'react';
import api from '../../api/axiosConfig';
import { toast } from 'react-toastify';

const TABS = [
  { key: 'search',      label: 'Search',      icon: '🔍' },
  { key: 'locations',   label: 'Locations',   icon: '📍' },
  { key: 'departments', label: 'Departments', icon: '🏢' },
  { key: 'facilities',  label: 'Facilities',  icon: '🛠️' },
  { key: 'operations',  label: 'Services',    icon: '⚙️' },
];

const statusColors = {
  OPEN: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  CLOSED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  ACTIVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  INACTIVE: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400',
  MAINTENANCE: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
};

const CampusExplorer = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);

  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [operations, setOperations] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const fetchData = useCallback(async (tab) => {
    setLoadingData(true);
    try {
      if (tab === 'locations' && locations.length === 0) {
        const res = await api.get('/locations');
        setLocations(res.data.data || []);
      } else if (tab === 'departments' && departments.length === 0) {
        const res = await api.get('/departments');
        setDepartments(res.data.data || []);
      } else if (tab === 'facilities' && facilities.length === 0) {
        const res = await api.get('/facilities');
        setFacilities(res.data.data || []);
      } else if (tab === 'operations' && operations.length === 0) {
        const res = await api.get('/operations');
        setOperations(res.data.data || []);
      }
    } catch {
      toast.error(`Failed to load ${tab}`);
    } finally {
      setLoadingData(false);
    }
  }, [locations.length, departments.length, facilities.length, operations.length]);

  useEffect(() => {
    if (activeTab !== 'search') fetchData(activeTab);
  }, [activeTab, fetchData]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchResults(null);
    try {
      const res = await api.get('/search', { params: { q: searchQuery } });
      const raw = res.data.data || {};
      // Backend returns Spring Page objects - extract content array
      setSearchResults({
        locations: raw.locations?.content || raw.locations || [],
        departments: raw.departments?.content || raw.departments || [],
        facilities: raw.facilities?.content || raw.facilities || [],
      });
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setSearching(false);
    }
  };

  const totalResults = searchResults
    ? Object.values(searchResults).reduce((sum, arr) => sum + (arr?.length || 0), 0)
    : 0;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold text-primary">Campus Explorer</h1>
        <p className="text-text-muted text-sm mt-1">Browse all campus locations, departments, facilities and services</p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit flex-wrap">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? 'bg-white dark:bg-slate-900 shadow text-primary'
                : 'text-text-muted hover:text-text-color'
            }`}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Search Tab */}
      {activeTab === 'search' && (
        <div className="flex flex-col gap-5">
          <form onSubmit={handleSearch} className="card p-5 flex flex-col gap-3">
            <div className="flex gap-3 flex-wrap">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search campus... (e.g. library, CS, gym)"
                className="form-input flex-1 min-w-[200px]"
                autoFocus
              />
              <button
                type="submit"
                className="btn-primary flex items-center gap-2 font-semibold px-5"
                disabled={searching || !searchQuery.trim()}
              >
                {searching ? <span className="animate-spin">⏳</span> : '🔍'}
                Search
              </button>
            </div>
          </form>

          {searchResults !== null && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-text-muted font-semibold">
                {totalResults > 0 ? `Found ${totalResults} result${totalResults !== 1 ? 's' : ''} for "${searchQuery}"` : `No results found for "${searchQuery}"`}
              </p>

              {searchResults.locations?.length > 0 && (
                <div>
                  <h3 className="font-bold mb-3 flex items-center gap-2">📍 Locations <span className="text-xs text-text-muted font-normal">({searchResults.locations.length})</span></h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {searchResults.locations.map(loc => (
                      <LocationCard key={loc.locationId} loc={loc} />
                    ))}
                  </div>
                </div>
              )}

              {searchResults.departments?.length > 0 && (
                <div>
                  <h3 className="font-bold mb-3 flex items-center gap-2">🏢 Departments <span className="text-xs text-text-muted font-normal">({searchResults.departments.length})</span></h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {searchResults.departments.map(dep => (
                      <DeptCard key={dep.departmentId} dep={dep} />
                    ))}
                  </div>
                </div>
              )}

              {searchResults.facilities?.length > 0 && (
                <div>
                  <h3 className="font-bold mb-3 flex items-center gap-2">🛠️ Facilities <span className="text-xs text-text-muted font-normal">({searchResults.facilities.length})</span></h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {searchResults.facilities.map(fac => (
                      <FacilityCard key={fac.facilityId} fac={fac} />
                    ))}
                  </div>
                </div>
              )}

              {totalResults === 0 && (
                <div className="text-center p-10 bg-slate-50 dark:bg-slate-800 rounded-xl border border-border-color text-text-muted">
                  <div className="text-4xl mb-3">🔍</div>
                  <div className="font-semibold">No matches found</div>
                  <p className="text-sm mt-1">Try different keywords or check spelling</p>
                </div>
              )}
            </div>
          )}

          {searchResults === null && !searching && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              {[
                { icon: '📚', label: 'Library', query: 'library' },
                { icon: '💻', label: 'CS Dept', query: 'computer science' },
                { icon: '☕', label: 'Cafeteria', query: 'cafeteria' },
                { icon: '⚽', label: 'Sports', query: 'sports' },
              ].map(quick => (
                <button
                  key={quick.label}
                  onClick={() => { setSearchQuery(quick.query); setSearchType('all'); }}
                  className="card p-4 text-center hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{quick.icon}</div>
                  <div className="text-sm font-semibold">{quick.label}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Locations Tab */}
      {activeTab === 'locations' && (
        <div>
          {loadingData ? <LoadingGrid /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {locations.map(loc => <LocationCard key={loc.locationId} loc={loc} />)}
            </div>
          )}
        </div>
      )}

      {/* Departments Tab */}
      {activeTab === 'departments' && (
        <div>
          {loadingData ? <LoadingGrid /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {departments.map(dep => <DeptCard key={dep.departmentId} dep={dep} />)}
            </div>
          )}
        </div>
      )}

      {/* Facilities Tab */}
      {activeTab === 'facilities' && (
        <div>
          {loadingData ? <LoadingGrid /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {facilities.map(fac => <FacilityCard key={fac.facilityId} fac={fac} />)}
            </div>
          )}
        </div>
      )}

      {/* Operations/Services Tab */}
      {activeTab === 'operations' && (
        <div>
          {loadingData ? <LoadingGrid /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {operations.map(op => (
                <div key={op.operationId} className="card p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-bold text-base">{op.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${statusColors[op.status] || statusColors.INACTIVE}`}>
                      {op.status}
                    </span>
                  </div>
                  {op.description && <p className="text-sm text-text-muted mb-3">{op.description}</p>}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted mt-auto">
                    {op.locationName && <span>📍 {op.locationName}</span>}
                    {op.operatingHours && <span>🕒 {op.operatingHours}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const LocationCard = ({ loc }) => (
  <div className="card p-5 hover:shadow-md transition-all hover:-translate-y-0.5">
    <div className="flex items-start justify-between gap-2 mb-2">
      <div>
        <h3 className="font-bold text-base">{loc.name}</h3>
        <span className="text-xs text-text-muted font-mono">{loc.locationId}</span>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${statusColors[loc.status] || 'bg-slate-100 text-slate-500'}`}>
        {loc.status || 'N/A'}
      </span>
    </div>
    {loc.description && <p className="text-sm text-text-muted mb-3 line-clamp-2">{loc.description}</p>}
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
      {loc.building && <span>🏢 {loc.building}</span>}
      {loc.floor && <span>📐 {loc.floor}</span>}
      {loc.openingTime && <span>🕒 {loc.openingTime}–{loc.closingTime}</span>}
    </div>
  </div>
);

const DeptCard = ({ dep }) => (
  <div className="card p-5 hover:shadow-md transition-all hover:-translate-y-0.5 border-l-4 border-l-primary/40">
    <div className="mb-2">
      <h3 className="font-bold text-base">{dep.name}</h3>
      <span className="text-xs text-text-muted font-mono">{dep.departmentId}</span>
    </div>
    {dep.description && <p className="text-sm text-text-muted mb-3 line-clamp-3">{dep.description}</p>}
    <div className="flex flex-col gap-1 text-xs text-text-muted">
      {dep.headOfDept && <span>👤 Head: <strong>{dep.headOfDept}</strong></span>}
      {dep.timing && <span>🕒 {dep.timing}</span>}
      {dep.locationName && <span>📍 {dep.locationName}</span>}
      {dep.facilities && <span>🛠️ {dep.facilities}</span>}
    </div>
  </div>
);

const FacilityCard = ({ fac }) => (
  <div className="card p-5 hover:shadow-md transition-all hover:-translate-y-0.5">
    <div className="flex items-start justify-between gap-2 mb-2">
      <div>
        <h3 className="font-bold text-base">{fac.name}</h3>
        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md font-semibold">{fac.facilityType}</span>
      </div>
      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${fac.available ? statusColors.ACTIVE : statusColors.INACTIVE}`}>
        {fac.available ? 'Available' : 'Unavailable'}
      </span>
    </div>
    {fac.description && <p className="text-sm text-text-muted mt-2 line-clamp-2">{fac.description}</p>}
    {fac.locationName && <p className="text-xs text-text-muted mt-2">📍 {fac.locationName}</p>}
  </div>
);

const LoadingGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {[1, 2, 3, 4, 5, 6].map(i => (
      <div key={i} className="card p-5 animate-pulse">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2 w-3/4" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded mb-4 w-1/2" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
      </div>
    ))}
  </div>
);

export default CampusExplorer;
