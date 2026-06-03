import { createContext, useContext, useReducer, useCallback } from 'react';
import API from '../services/api';
import { issueReducer, initialState } from '../reducer/issueReducer';

export const IssueContext = createContext();

export const useIssueContext = () => useContext(IssueContext);

export const IssueProvider = ({ children }) => {
  const [state, dispatch] = useReducer(issueReducer, initialState);

  const fetchIssues = useCallback(async (filters = {}) => {
    dispatch({ type: 'FETCH_ISSUES_START' });
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.page) params.append('page', filters.page);
      
      const response = await API.get(`/issues?${params.toString()}`);
      dispatch({ type: 'FETCH_ISSUES_SUCCESS', payload: response.data.data });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_ISSUES_ERROR', 
        payload: error.response?.data?.message || 'Failed to fetch issues' 
      });
    }
  }, []);

  const searchIssues = useCallback(async (query) => {
    dispatch({ type: 'FETCH_ISSUES_START' });
    try {
      const response = await API.get(`/issues/search?q=${query}`);
      dispatch({ type: 'FETCH_ISSUES_SUCCESS', payload: response.data.data });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_ISSUES_ERROR', 
        payload: error.response?.data?.message || 'Failed to search issues' 
      });
    }
  }, []);

  const addIssue = async (issueData) => {
    const response = await API.post('/issues', issueData);
    dispatch({ type: 'ADD_ISSUE', payload: response.data.data });
    return response.data;
  };

  const updateIssue = async (id, issueData) => {
    const response = await API.put(`/issues/${id}`, issueData);
    dispatch({ type: 'UPDATE_ISSUE', payload: response.data.data });
    return response.data;
  };

  const deleteIssue = async (id) => {
    await API.delete(`/issues/${id}`);
    dispatch({ type: 'DELETE_ISSUE', payload: id });
  };

  return (
    <IssueContext.Provider 
      value={{ 
        ...state, 
        fetchIssues, 
        searchIssues,
        addIssue, 
        updateIssue, 
        deleteIssue 
      }}
    >
      {children}
    </IssueContext.Provider>
  );
};
