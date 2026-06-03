export const initialState = {
  issues: [],
  loading: false,
  error: null,
};

export const issueReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_ISSUES_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_ISSUES_SUCCESS':
      return { ...state, loading: false, issues: action.payload };
    case 'FETCH_ISSUES_ERROR':
      return { ...state, loading: false, error: action.payload };
    
    case 'ADD_ISSUE':
      return { ...state, issues: [action.payload, ...state.issues] };
    
    case 'UPDATE_ISSUE':
      return {
        ...state,
        issues: state.issues.map((issue) =>
          issue._id === action.payload._id ? action.payload : issue
        ),
      };
      
    case 'DELETE_ISSUE':
      return {
        ...state,
        issues: state.issues.filter((issue) => issue._id !== action.payload),
      };

    default:
      return state;
  }
};
