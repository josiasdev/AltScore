import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Avatar } from '../ui/Avatar';

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const handleNav = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  const isLandlord = user?.role === 'landlord';

  return (
    <header className="bg-petrol text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.jpg" alt="AltScore" className="h-10 w-auto rounded-lg object-contain bg-white px-2 py-1" />
            <span className="font-heading font-bold text-xl">AltScore</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link to="/imoveis" className="hover:text-mint transition-colors">Imóveis</Link>
            {isAuthenticated && (
              <>
                {isLandlord ? (
                  <Link to="/proprietario" className="hover:text-mint transition-colors">Meus Imóveis</Link>
                ) : (
                  <Link to="/dashboard" className="hover:text-mint transition-colors">Dashboard</Link>
                )}
                <Link to="/contratos" className="hover:text-mint transition-colors">Contratos</Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <Link to={isLandlord ? '/proprietario' : '/dashboard'} className="hidden sm:block">
                  <Avatar name={user.full_name} role={user.role} size="sm" />
                </Link>
                <button onClick={handleLogout} className="hidden md:block text-sm hover:text-mint transition-colors">
                  Sair
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-mint text-petrol px-4 py-2 rounded-lg font-medium hover:bg-mint-500 transition-colors"
              >
                Entrar
              </Link>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-1 hover:text-mint transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-petrol-700">
          <div className="px-4 py-3 space-y-1">
            <button
              onClick={() => handleNav('/imoveis')}
              className="block w-full text-left px-3 py-2 rounded-lg hover:bg-petrol-700 transition-colors"
            >
              Imóveis
            </button>
            {isAuthenticated && user && (
              <>
                <button
                  onClick={() => handleNav(isLandlord ? '/proprietario' : '/dashboard')}
                  className="block w-full text-left px-3 py-2 rounded-lg hover:bg-petrol-700 transition-colors"
                >
                  {isLandlord ? 'Meus Imóveis' : 'Dashboard'}
                </button>
                <button
                  onClick={() => handleNav('/contratos')}
                  className="block w-full text-left px-3 py-2 rounded-lg hover:bg-petrol-700 transition-colors"
                >
                  Contratos
                </button>
                <div className="flex items-center gap-3 px-3 py-2">
                  <Avatar name={user.full_name} role={user.role} size="sm" />
                  <span className="text-sm text-petrol-200">{user.full_name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-petrol-700 transition-colors"
                >
                  Sair
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
