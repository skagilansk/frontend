import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useIssueContext } from '../context/IssueContext';
import API from '../services/api';
import IssueList from '../components/IssueList';
import IssueForm from '../components/IssueForm';

const Dashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  const { issues, loading, error, fetchIssues, searchIssues } = useIssueContext();

  const [stats, setStats] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '', page: 1 });
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);

  useEffect(() => {
    fetchIssues(filters);
    fetchStats();
  }, [filters, fetchIssues]);

  const fetchStats = async () => {
    try {
      const res = await API.get('/stats');
      setStats(res.data.data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchIssues(searchQuery);
    } else {
      fetchIssues(filters);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await API.post('/sync', { token });
      setSyncResult({ success: true, message: res.data.message, data: res.data.data });
      fetchIssues(filters);
      fetchStats();
    } catch (err) {
      setSyncResult({
        success: false,
        message: err.response?.data?.message || 'Sync failed'
      });
    } finally {
      setSyncing(false);
    }
  };

  const isAdminOrManager = user?.role === 'admin' || user?.role === 'manager';

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="user-info">
          <h2>Issue Tracking Dashboard</h2>
          <p>Welcome, {user?.name} ({user?.role})</p>
        </div>
        <div className="header-actions">
          {isAdminOrManager && (
            <button
              className="sync-btn"
              onClick={handleSync}
              disabled={syncing}
            >
              {syncing ? 'Syncing...' : 'Sync Data from External API'}
            </button>
          )}
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      {syncResult && (
        <div className={`sync-result ${syncResult.success ? 'success' : 'error'}`}>
          <p>{syncResult.message}</p>
          {syncResult.data && (
            <ul>
              <li>Inserted: {syncResult.data.inserted}</li>
              <li>Duplicates: {syncResult.data.duplicates}</li>
              <li>Rejected: {syncResult.data.rejected}</li>
            </ul>
          )}
          <button onClick={() => setSyncResult(null)}>Dismiss</button>
        </div>
      )}

      {stats && (
        <div className="stats-container">
          <div className="stat-card total">
            <h3>Total Issues</h3>
            <p className="stat-number">{stats.totalRecords}</p>
          </div>
          <div className="stat-card open">
            <h3>Open</h3>
            <p className="stat-number">{stats.openRecords}</p>
          </div>
          <div className="stat-card in-progress">
            <h3>In Progress</h3>
            <p className="stat-number">{stats.inProgressRecords}</p>
          </div>
          <div className="stat-card closed">
            <h3>Closed</h3>
            <p className="stat-number">{stats.closedRecords}</p>
          </div>
        </div>
      )}

      <div className="controls-bar">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search issues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
          {searchQuery && (
            <button type="button" onClick={() => { setSearchQuery(''); fetchIssues(filters); }}>
              Clear
            </button>
          )}
        </form>

        <div className="filters">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value, page: 1 })}
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <button className="primary-btn" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'New Issue'}
          </button>
        </div>
      </div>

      {showForm && (
        <IssueForm
          onSuccess={() => { setShowForm(false); fetchStats(); }}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="content-area">
        {loading ? (
          <p className="loading">Loading issues...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <IssueList issues={issues} refreshStats={fetchStats} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
