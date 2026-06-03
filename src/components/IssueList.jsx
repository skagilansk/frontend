import { useState } from 'react';
import { useIssueContext } from '../context/IssueContext';
import IssueForm from './IssueForm';

const IssueList = ({ issues, refreshStats }) => {
  const { deleteIssue, updateIssue } = useIssueContext();
  const [editingId, setEditingId] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      await deleteIssue(id);
      refreshStats();
    }
  };

  const handleStatusToggle = async (issue) => {
    let newStatus = 'in-progress';
    if (issue.status === 'open') newStatus = 'in-progress';
    else if (issue.status === 'in-progress') newStatus = 'closed';
    else newStatus = 'open';

    await updateIssue(issue._id, { status: newStatus });
    refreshStats();
  };

  if (!issues || issues.length === 0) {
    return <p className="no-tasks">No issues found.</p>;
  }

  return (
    <div className="task-list">
      {issues.map(issue => (
        <div key={issue._id} className={`task-card ${issue.status}`}>
          {editingId === issue._id ? (
            <IssueForm 
              issue={issue} 
              onSuccess={() => { setEditingId(null); refreshStats(); }} 
              onCancel={() => setEditingId(null)} 
            />
          ) : (
            <>
              <div className="task-header">
                <h4>{issue.issueId ? `[${issue.issueId}] ` : ''}{issue.title}</h4>
                <div className="badges">
                  <span className={`priority-badge ${issue.priority}`}>{issue.priority}</span>
                  <span className={`status-badge ${issue.status}`}>{issue.status}</span>
                </div>
              </div>
              <p>{issue.description}</p>
              
              <div className="issue-meta">
                {issue.assignee && <span><strong>Assignee:</strong> {issue.assignee}</span>}
                {issue.reporter && <span><strong>Reporter:</strong> {issue.reporter}</span>}
              </div>
              
              {issue.tags && issue.tags.length > 0 && (
                <div className="tags-container">
                  {issue.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              )}

              <div className="task-actions">
                <button onClick={() => handleStatusToggle(issue)}>
                  Move Status
                </button>
                <button onClick={() => setEditingId(issue._id)}>Edit</button>
                <button className="danger-btn" onClick={() => handleDelete(issue._id)}>Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default IssueList;
