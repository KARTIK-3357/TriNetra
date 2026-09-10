import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import { CitizenThemeProvider } from './context/CitizenThemeContext';

function App() {
  return (
    <AuthProvider>
      <CitizenThemeProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </CitizenThemeProvider>
    </AuthProvider>
  );
}

export default App;
