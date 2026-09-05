import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { ScorePage } from './pages/Score';
import { Properties } from './pages/Properties';
import { PropertyDetail } from './pages/PropertyDetail';
import { Contracts } from './pages/Contracts';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/score" element={<ScorePage />} />
            <Route path="/imoveis" element={<Properties />} />
            <Route path="/imoveis/:id" element={<PropertyDetail />} />
            <Route path="/contratos" element={<Contracts />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
