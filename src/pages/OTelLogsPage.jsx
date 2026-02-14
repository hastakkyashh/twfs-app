/**
 * OTel Logs Dashboard Page
 * 
 * Admin-only page for viewing user behavior analytics.
 * Displays overview stats, sessions, events, and subscribers in tabbed tables.
 */
 
import React, { useState, useEffect } from 'react';
import { 
  Activity, Users, MousePointer, Mail, RefreshCw, 
  ChevronLeft, ChevronRight, Globe, Clock, Eye,
  TrendingUp, BarChart3, Lock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getCurrentSession } from '../services/auth';
 
const API_BASE = '/api/telemetry/activity';
 
const OTelLogsPage = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ limit: 25, offset: 0 });
 
  // Fetch data based on active tab
  const fetchData = async (type = activeTab, pag = pagination) => {
    const session = getCurrentSession();
    if (!isAuthenticated || !session?.token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
 
    try {
      const url = `${API_BASE}?type=${type}&limit=${pag.limit}&offset=${pag.offset}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${session.token}`,
          'Content-Type': 'application/json',
        },
      });
 
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Unauthorized. Please login again.');
        }
        throw new Error('Failed to fetch data');
      }
 
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [activeTab, pagination, isAuthenticated]);
 
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPagination({ limit: 25, offset: 0 });
  };
 
  const handlePageChange = (direction) => {
    const newOffset = direction === 'next' 
      ? pagination.offset + pagination.limit 
      : Math.max(0, pagination.offset - pagination.limit);
    setPagination({ ...pagination, offset: newOffset });
  };
 
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'sessions', label: 'Sessions', icon: Activity },
    { id: 'events', label: 'Events', icon: MousePointer },
    { id: 'subscribers', label: 'Subscribers', icon: Mail },
    { id: 'visitors', label: 'Visitors', icon: Users },
  ];
 
  // Show loading while auth is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <RefreshCw size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  // Show auth required message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm max-w-md">
          <Lock size={48} className="mx-auto text-slate-400 mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Admin Access Required</h2>
          <p className="text-slate-500">Please login as admin to view OTel Logs.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Activity className="text-blue-600" />
              OTel Logs Dashboard
            </h1>
            <p className="text-slate-500 mt-1">User behavior analytics and tracking data</p>
          </div>
          <button
            onClick={() => fetchData()}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            // data-track="otel-refresh-btn"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
 
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 pb-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100'
              }`}
            // data-track={`otel-tab-${tab.id}`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
 
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
 
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw size={32} className="animate-spin text-blue-600" />
          </div>
        )}
 
        {/* Content */}
        {!loading && data && (
          <>
            {activeTab === 'overview' && <OverviewTab data={data} />}
            {activeTab === 'sessions' && <SessionsTab data={data} />}
            {activeTab === 'events' && <EventsTab data={data} />}
            {activeTab === 'subscribers' && <SubscribersTab data={data} />}
            {activeTab === 'visitors' && <VisitorsTab data={data} />}
 
            {/* Pagination (for non-overview tabs) */}
            {activeTab !== 'overview' && data.total > pagination.limit && (
              <div className="flex items-center justify-between mt-6 bg-white rounded-lg p-4 shadow-sm">
                <span className="text-slate-600">
                  Showing {pagination.offset + 1} - {Math.min(pagination.offset + pagination.limit, data.total)} of {data.total}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange('prev')}
                    disabled={pagination.offset === 0}
                    className="flex items-center gap-1 px-3 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={18} />
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange('next')}
                    disabled={pagination.offset + pagination.limit >= data.total}
                    className="flex items-center gap-1 px-3 py-2 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
 
// ============================================================================
// TAB COMPONENTS
// ============================================================================
 
const OverviewTab = ({ data }) => {
  const { stats, recent_event_types } = data;
 
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Total Visitors"
          value={stats?.total_visitors || 0}
          color="blue"
        />
        <StatCard
          icon={Activity}
          label="Total Sessions"
          value={stats?.total_sessions || 0}
          color="green"
        />
        <StatCard
          icon={MousePointer}
          label="Total Events"
          value={stats?.total_events || 0}
          color="purple"
        />
        <StatCard
          icon={Mail}
          label="Subscribers"
          value={stats?.total_subscribers || 0}
          color="orange"
        />
      </div>
 
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Event Types */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600" />
            Event Types (Last 24h)
          </h3>
          <div className="space-y-3">
            {recent_event_types?.length > 0 ? (
              recent_event_types.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-slate-600 font-mono text-sm">{item.event_type}</span>
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm font-medium">
                    {item.count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm">No events in the last 24 hours</p>
            )}
          </div>
        </div>
 
        {/* Top Pages
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Eye size={20} className="text-green-600" />
            Top Pages
          </h3>
          <div className="space-y-3">
            {top_pages?.length > 0 ? (
              top_pages.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-slate-600 font-mono text-sm">{item.page || '#home'}</span>
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm font-medium">
                    {item.count} views
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm">No page views recorded</p>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
};
 
const StatCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
  };
 
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-slate-500 text-sm">{label}</p>
          <p className="text-2xl font-bold text-slate-900">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};
 
const SessionsTab = ({ data }) => {
  const { sessions } = data;
 
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Session ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Location</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Started</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Events</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sessions?.map((session) => (
              <tr key={session.session_id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-xs text-slate-600">
                  {session.session_id.substring(0, 8)}...
                </td>
                <td className="px-4 py-3 text-sm text-slate-900">
                  {session.email || <span className="text-slate-400">Anonymous</span>}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <Globe size={14} />
                    {session.cf_city || 'Unknown'}, {session.cf_country || '??'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {formatDate(session.started_at)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                    {session.event_count}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
 
const EventsTab = ({ data }) => {
  const { events } = data;
 
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Page</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Element</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Location</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {events?.map((event) => (
              <tr key={event.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.event_type)}`}>
                    {event.event_type}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-600">
                  {event.page || '-'}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-600">
                  {event.element || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-slate-900">
                  {event.email || <span className="text-slate-400">-</span>}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {event.cf_city || 'Unknown'}, {event.cf_country || '??'}
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {formatDate(event.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
 
const SubscribersTab = ({ data }) => {
  const { subscribers } = data;
 
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Subscribed</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">First Seen</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Last Seen</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Sessions</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Events</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {subscribers?.map((sub) => (
              <tr key={sub.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-sm font-medium text-slate-900">
                  {sub.email}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {formatDate(sub.subscribed_at)}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {formatDate(sub.first_seen_at)}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {formatDate(sub.last_seen_at)}
                </td>
                <td className="px-4 py-3">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                    {sub.total_sessions || 0}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                    {sub.total_events || 0}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
 
const VisitorsTab = ({ data }) => {
  const { visitors } = data;
 
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Visitor ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">First Seen</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Last Seen</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Sessions</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600">Events</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visitors?.map((visitor) => (
              <tr key={visitor.visitor_id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-xs text-slate-600">
                  {visitor.visitor_id.substring(0, 12)}...
                </td>
                <td className="px-4 py-3 text-sm text-slate-900">
                  {visitor.email || <span className="text-slate-400">Anonymous</span>}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {formatDate(visitor.first_seen_at)}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  {formatDate(visitor.last_seen_at)}
                </td>
                <td className="px-4 py-3">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                    {visitor.total_sessions || 0}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                    {visitor.total_events || 0}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
 
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
 
function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}
 
function getEventTypeColor(eventType) {
  if (eventType?.startsWith('page.')) return 'bg-blue-100 text-blue-700';
  if (eventType?.startsWith('ui.')) return 'bg-purple-100 text-purple-700';
  if (eventType?.startsWith('user.')) return 'bg-green-100 text-green-700';
  if (eventType?.startsWith('form.')) return 'bg-orange-100 text-orange-700';
  if (eventType?.startsWith('social.')) return 'bg-pink-100 text-pink-700';
  if (eventType?.startsWith('contact.')) return 'bg-yellow-100 text-yellow-700';
  return 'bg-slate-100 text-slate-700';
}
 
export default OTelLogsPage;