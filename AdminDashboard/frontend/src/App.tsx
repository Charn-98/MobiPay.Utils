import './App.css'
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MFASetupPage from './pages/MFASetupPage';
import MFAVerificationPage from './pages/MFAVerificationPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
     <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage/>} />
          <Route path="/register" element={<RegistrationPage/>} />
          <Route path="/mfa-setup" element={<MFASetupPage/>} />
          <Route path="/mfa-verify" element={<MFAVerificationPage/>} />
          <Route path="/dashboard" element={<DashboardPage/>} />
          <Route path="/" element={<LoginPage />} /> {/*default*/}
        </Routes>
      </div>
    </Router>
  )
}

export default App
