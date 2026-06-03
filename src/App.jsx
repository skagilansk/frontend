import AppRouter from './router';
import { AuthProvider } from './context/AuthContext';
import { IssueProvider } from './context/IssueContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <IssueProvider>
        <AppRouter />
      </IssueProvider>
    </AuthProvider>
  );
}

export default App;
