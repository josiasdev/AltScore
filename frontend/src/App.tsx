import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { ScorePage } from './pages/Score';
import { Properties } from './pages/Properties';
import { PropertyDetail } from './pages/PropertyDetail';
import { Contracts } from './pages/Contracts';
import { ContractDetail } from './pages/ContractDetail';
import { LandlordDashboard } from './pages/LandlordDashboard';
import { useAuthStore } from './stores/authStore';

function App() {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Register />} />
            <Route path="/auth" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/proprietario" element={<LandlordDashboard />} />
            <Route path="/score" element={<ScorePage />} />
            <Route path="/imoveis" element={<Properties />} />
            <Route path="/imoveis/:id" element={<PropertyDetail />} />
            <Route path="/contratos" element={<Contracts />} />
            <Route path="/contratos/:id" element={<ContractDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
