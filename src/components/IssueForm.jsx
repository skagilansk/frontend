import { useState } from 'react';
import { useIssueContext } from '../context/IssueContext';

const IssueForm = ({ issue = null, onSuccess, onCancel }) => {
  const { addIssue, updateIssue } = useIssueContext();
  const [formData, setFormData] = useState({
    title: issue ? issue.title : '',
    description: issue ? issue.description : '',
    status: issue ? issue.status : 'open',
    priority: issue ? issue.priority : 'medium',
    assignee: issue ? issue.assignee : '',
    reporter: issue ? issue.reporter : '',
    tags: issue ? issue.tags.join(', ') : '',
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    
    try {
      const payload = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : []
      };

      if (issue) {
        await updateIssue(issue._id, payload);
      } else {
        await addIssue(payload);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save issue');
    }
  };

  return (
    <div className="task-form-container">
      <h3>{issue ? 'Edit Issue' : 'Create New Issue'}</h3>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="task-form">
        <input
          type="text"
          placeholder="Issue Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <div className="form-row">
          <input
            type="text"
            placeholder="Assignee"
            value={formData.assignee}
            onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
          />
          <input
            type="text"
            placeholder="Reporter"
            value={formData.reporter}
            onChange={(e) => setFormData({ ...formData, reporter: e.target.value })}
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          />
        </div>
        <div className="form-row">
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="primary-btn">Save Issue</button>
          {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
        </div>
      </form>
    </div>
  );
};

export default IssueForm;
