import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

// Predefined visual map coordinates for campus buildings
const CAMPUS_LAYOUT = {
  LOC_MAIN_GATE: { x: 100, y: 460, icon: '🚪', label: 'Main Gate' },
  LOC_HEALTH: { x: 120, y: 280, icon: '🏥', label: 'Health Center' },
  LOC_ADMIN: { x: 260, y: 440, icon: '🏛️', label: 'Admin Block' },
  LOC_LIBRARY: { x: 300, y: 300, icon: '📚', label: 'Central Library' },
  LOC_CS: { x: 470, y: 430, icon: '💻', label: 'CS & Eng.' },
  LOC_EC: { x: 620, y: 440, icon: '📡', label: 'ECE Dept' },
  LOC_CAFETERIA: { x: 440, y: 270, icon: '☕', label: 'Cafeteria' },
  LOC_AUDITORIUM: { x: 240, y: 140, icon: '🎭', label: 'Auditorium' },
  LOC_SPORTS: { x: 630, y: 250, icon: '⚽', label: 'Sports Complex' },
  LOC_HOSTEL_A: { x: 630, y: 90, icon: '🏢', label: 'Boys Hostel' },
  LOC_HOSTEL_B: { x: 470, y: 90, icon: '🏨', label: 'Girls Hostel' }
};

// Known campus route connections for SVG rendering
const CAMPUS_EDGES = [
  ['LOC_MAIN_GATE', 'LOC_ADMIN'],
  ['LOC_MAIN_GATE', 'LOC_LIBRARY'],
  ['LOC_MAIN_GATE', 'LOC_HEALTH'],
  ['LOC_ADMIN', 'LOC_LIBRARY'],
  ['LOC_ADMIN', 'LOC_CS'],
  ['LOC_CS', 'LOC_EC'],
  ['LOC_CS', 'LOC_CAFETERIA'],
  ['LOC_LIBRARY', 'LOC_CAFETERIA'],
  ['LOC_CAFETERIA', 'LOC_SPORTS'],
  ['LOC_EC', 'LOC_SPORTS'],
  ['LOC_CAFETERIA', 'LOC_AUDITORIUM'],
  ['LOC_AUDITORIUM', 'LOC_HEALTH'],
  ['LOC_SPORTS', 'LOC_HOSTEL_A'],
  ['LOC_SPORTS', 'LOC_HOSTEL_B'],
  ['LOC_HOSTEL_A', 'LOC_HOSTEL_B']
];

const MapView = () => {
  const [locations, setLocations] = useState([]);
  const [sourceId, setSourceId] = useState('');
  const [destId, setDestId] = useState('');
  const [routeResult, setRouteResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const { user } = useAuth();
  const [feedback, setFeedback] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await api.get('/locations');
      if (response.data && response.data.data) {
        setLocations(response.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load campus locations');
    }
  };

  const handleFindRoute = async (e) => {
    if (e) e.preventDefault();
    if (!sourceId || !destId) {
      toast.warning('Please choose both starting point and destination.');
      return;
    }
    if (sourceId === destId) {
      toast.warning('Starting point and destination cannot be the same.');
      return;
    }

    setLoading(true);
    setRouteResult(null);
    try {
      const response = await api.post('/search/route', {
        sourceLocationId: sourceId,
        destinationLocationId: destId
      });
      if (response.data && response.data.data) {
        setRouteResult(response.data.data);
        if (!response.data.data.reachable) {
          toast.info('No direct walkway route found between these locations.');
        } else {
          toast.success(`Shortest path found (${response.data.data.totalDistance.toFixed(0)}m)!`);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to find route');
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    const temp = sourceId;
    setSourceId(destId);
    setDestId(temp);
  };

  const handleNodeClick = (locId) => {
    setSelectedNode(locId);
    if (!sourceId) {
      setSourceId(locId);
      toast.info(`Selected ${CAMPUS_LAYOUT[locId]?.label || locId} as Starting Point`);
    } else if (!destId && locId !== sourceId) {
      setDestId(locId);
      toast.info(`Selected ${CAMPUS_LAYOUT[locId]?.label || locId} as Destination`);
    } else if (locId === sourceId) {
      // Toggle or reset
      setSourceId('');
    } else {
      setDestId(locId);
    }
  };

  const setPresetRoute = (src, dst) => {
    setSourceId(src);
    setDestId(dst);
    // Find route automatically
    setTimeout(() => {
      findRouteDirect(src, dst);
    }, 50);
  };

  const findRouteDirect = async (src, dst) => {
    setLoading(true);
    setRouteResult(null);
    try {
      const response = await api.post('/search/route', {
        sourceLocationId: src,
        destinationLocationId: dst
      });
      if (response.data && response.data.data) {
        setRouteResult(response.data.data);
      }
    } catch (err) {
      toast.error('Failed to compute route');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setSubmittingFeedback(true);
    try {
      await api.put(`/visitors/${user.userId}/feedback`, { feedback });
      toast.success('Thank you for your feedback!');
      setFeedback('');
    } catch (err) {
      toast.error('Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  // Helper to check if an edge is part of the computed path
  const isEdgeInPath = (loc1, loc2) => {
    if (!routeResult || !routeResult.path || routeResult.path.length < 2) return false;
    const path = routeResult.path;
    for (let i = 0; i < path.length - 1; i++) {
      if ((path[i] === loc1 && path[i + 1] === loc2) || (path[i] === loc2 && path[i + 1] === loc1)) {
        return true;
      }
    }
    return false;
  };

  const isNodeInPath = (locId) => {
    return routeResult?.path?.includes(locId);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-140px)]">
      {/* Route Planner Control Panel */}
      <div className="w-full lg:w-96 glass-panel p-6 overflow-y-auto flex flex-col gap-5 shrink-0">
        <div>
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <span>🧭</span> Campus Navigator
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Choose locations from the dropdown or click nodes on the interactive map below.
          </p>
        </div>

        {/* Quick Route Presets */}
        <div>
          <label className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">
            ⚡ Popular Routes
          </label>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setPresetRoute('LOC_MAIN_GATE', 'LOC_LIBRARY')}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary transition"
            >
              Gate → Library
            </button>
            <button
              type="button"
              onClick={() => setPresetRoute('LOC_MAIN_GATE', 'LOC_CS')}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary transition"
            >
              Gate → CS Dept
            </button>
            <button
              type="button"
              onClick={() => setPresetRoute('LOC_CS', 'LOC_CAFETERIA')}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary transition"
            >
              CS → Cafeteria
            </button>
            <button
              type="button"
              onClick={() => setPresetRoute('LOC_HOSTEL_A', 'LOC_SPORTS')}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-primary/10 hover:text-primary transition"
            >
              Hostel → Gym
            </button>
          </div>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleFindRoute} className="flex flex-col gap-3">
          <div className="form-group mb-0">
            <label className="text-sm font-semibold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              Starting Point
            </label>
            <select
              id="source-location-select"
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="mt-1"
              required
            >
              <option value="">-- Choose start location --</option>
              {locations.map((loc) => (
                <option key={loc.locationId} value={loc.locationId}>
                  {loc.name} {loc.building ? `(${loc.building})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center -my-1">
            <button
              type="button"
              onClick={handleSwap}
              disabled={!sourceId && !destId}
              title="Swap starting point and destination"
              className="p-1.5 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-primary hover:text-white transition text-sm shadow-sm"
            >
              ⇅ Swap
            </button>
          </div>

          <div className="form-group mb-0">
            <label className="text-sm font-semibold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>
              Destination
            </label>
            <select
              id="dest-location-select"
              value={destId}
              onChange={(e) => setDestId(e.target.value)}
              className="mt-1"
              required
            >
              <option value="">-- Choose destination --</option>
              {locations.map((loc) => (
                <option key={loc.locationId} value={loc.locationId}>
                  {loc.name} {loc.building ? `(${loc.building})` : ''}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            id="find-routes-btn"
            className="btn-primary w-full mt-3 flex items-center justify-center gap-2 font-semibold shadow-md"
            disabled={loading || !sourceId || !destId}
          >
            {loading ? (
              <>
                <span className="animate-spin inline-block">⏳</span>
                Finding Optimal Path...
              </>
            ) : (
              <>
                <span>🚀</span>
                Find Routes
              </>
            )}
          </button>
        </form>

        {/* Route Result Card */}
        {routeResult && (
          <div
            className={`p-4 rounded-xl border transition-all ${
              routeResult.reachable
                ? 'bg-primary/5 border-primary/30 dark:bg-primary/10'
                : 'bg-red-500/10 border-red-500/30 text-danger'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-base flex items-center gap-1.5">
                {routeResult.reachable ? '✅ Route Found' : '⚠️ No Route'}
              </h3>
              {routeResult.reachable && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                  Dijkstra Shortest Path
                </span>
              )}
            </div>

            {!routeResult.reachable ? (
              <p className="text-sm text-danger">{routeResult.message}</p>
            ) : (
              <div className="flex flex-col gap-2.5 text-sm">
                <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-white/70 dark:bg-slate-800/80 border border-border-color">
                  <div>
                    <span className="text-xs text-text-muted block">Distance</span>
                    <span className="font-bold text-base text-primary">
                      {routeResult.totalDistance.toFixed(0)} meters
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-text-muted block">Est. Walk Time</span>
                    <span className="font-bold text-base text-secondary">
                      ~{Math.max(1, Math.round(routeResult.totalDistance / 75))} mins
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-1.5">
                    Path Breakdown ({routeResult.pathNames?.length} stops)
                  </span>
                  <ol className="pl-4 border-l-2 border-primary space-y-2 relative ml-1">
                    {routeResult.pathNames?.map((name, idx) => (
                      <li
                        key={idx}
                        className="relative text-xs font-medium before:content-[''] before:absolute before:-left-[21px] before:top-1 before:w-2.5 before:h-2.5 before:bg-primary before:rounded-full before:border-2 before:border-white dark:before:border-slate-900"
                      >
                        <span className={idx === 0 ? 'text-emerald-600 font-bold' : idx === routeResult.pathNames.length - 1 ? 'text-indigo-600 font-bold' : ''}>
                          {name}
                        </span>
                        {idx === 0 && <span className="text-[10px] text-emerald-500 ml-1.5">(Start)</span>}
                        {idx === routeResult.pathNames.length - 1 && <span className="text-[10px] text-indigo-500 ml-1.5">(Destination)</span>}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Visitor Feedback Form */}
        {user?.role === 'VISITOR' && (
          <div className="mt-auto pt-4 border-t border-border-color">
            <h3 className="font-bold mb-2 text-sm text-secondary">Visitor Feedback</h3>
            <form onSubmit={handleSubmitFeedback} className="flex flex-col gap-2">
              <textarea
                className="form-input text-xs min-h-[80px] resize-none"
                placeholder="Share your campus feedback..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                required
              ></textarea>
              <button
                type="submit"
                className="btn-primary text-xs bg-secondary hover:bg-emerald-600"
                disabled={submittingFeedback || !feedback.trim()}
              >
                {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Interactive Map Visualizer Canvas */}
      <div className="flex-1 glass-panel p-4 flex flex-col relative overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 rounded-2xl border border-border-color min-h-[500px]">
        {/* Header and Map Legend */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 px-2">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              <span>🗺️</span> Interactive Campus Visualizer
            </h3>
            <p className="text-xs text-text-muted">Click any building node to select it as Start or Destination</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Start
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block"></span> Destination
            </span>
            <span className="flex items-center gap-1">
              <span className="w-4 h-1 bg-primary inline-block"></span> Shortest Route
            </span>
          </div>
        </div>

        {/* SVG Campus Map */}
        <div className="flex-1 w-full h-full relative border border-border-color/60 rounded-xl overflow-hidden bg-white/40 dark:bg-slate-900/60 backdrop-blur flex items-center justify-center p-2">
          <svg
            viewBox="0 0 740 520"
            className="w-full h-full max-h-[620px] select-none"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.05))' }}
          >
            {/* Background Grid Pattern */}
            <defs>
              <pattern id="campus-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeOpacity="0.04" strokeWidth="1" />
              </pattern>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#campus-grid)" />

            {/* Render Pathway Edges */}
            {CAMPUS_EDGES.map(([src, dst], idx) => {
              const node1 = CAMPUS_LAYOUT[src];
              const node2 = CAMPUS_LAYOUT[dst];
              if (!node1 || !node2) return null;
              const inPath = isEdgeInPath(src, dst);

              return (
                <g key={`edge-${idx}`}>
                  {/* Base Walkway Line */}
                  <line
                    x1={node1.x}
                    y1={node1.y}
                    x2={node2.x}
                    y2={node2.y}
                    stroke={inPath ? '#4F46E5' : '#cbd5e1'}
                    strokeWidth={inPath ? 5 : 2.5}
                    strokeDasharray={inPath ? 'none' : '4 4'}
                    strokeOpacity={inPath ? 1 : 0.6}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                  {/* Glowing overlay if active path */}
                  {inPath && (
                    <line
                      x1={node1.x}
                      y1={node1.y}
                      x2={node2.x}
                      y2={node2.y}
                      stroke="#818cf8"
                      strokeWidth={10}
                      strokeOpacity={0.3}
                      strokeLinecap="round"
                    />
                  )}
                </g>
              );
            })}

            {/* Render Building Nodes */}
            {Object.entries(CAMPUS_LAYOUT).map(([locId, layout]) => {
              const isStart = sourceId === locId;
              const isDest = destId === locId;
              const isPath = isNodeInPath(locId);

              let fillColor = '#ffffff';
              let strokeColor = '#94a3b8';
              let strokeWidth = 2;
              let radius = 22;

              if (isStart) {
                fillColor = '#10B981';
                strokeColor = '#059669';
                strokeWidth = 4;
                radius = 26;
              } else if (isDest) {
                fillColor = '#6366F1';
                strokeColor = '#4338CA';
                strokeWidth = 4;
                radius = 26;
              } else if (isPath) {
                fillColor = '#e0e7ff';
                strokeColor = '#4F46E5';
                strokeWidth = 3;
                radius = 24;
              }

              return (
                <g
                  key={locId}
                  className="cursor-pointer group"
                  onClick={() => handleNodeClick(locId)}
                  transform={`translate(${layout.x}, ${layout.y})`}
                >
                  {/* Subtle Node Ring */}
                  {(isStart || isDest) && (
                    <circle r={radius + 8} fill={isStart ? '#10B981' : '#6366F1'} opacity={0.25}>
                      <animate attributeName="r" values={`${radius + 4};${radius + 12};${radius + 4}`} dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Main Circle */}
                  <circle
                    r={radius}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    className="transition-all duration-200 group-hover:scale-110"
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))' }}
                  />

                  {/* Node Icon */}
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={radius > 24 ? "15" : "13"}
                    className="pointer-events-none"
                  >
                    {layout.icon}
                  </text>

                  {/* Label Text Pill */}
                  <g transform={`translate(0, ${radius + 14})`}>
                    <rect
                      x="-55"
                      y="-10"
                      width="110"
                      height="20"
                      rx="6"
                      fill={isStart ? '#10B981' : isDest ? '#4F46E5' : 'rgba(15, 23, 42, 0.75)'}
                      className="transition-colors"
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#ffffff"
                      fontSize="9.5"
                      fontWeight="600"
                      className="pointer-events-none"
                    >
                      {layout.label}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MapView;
