import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
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
            {isAuthenticated ? (
              <button onClick={handleLogout} className="text-sm hover:text-mint transition-colors">
                Sair
              </button>
            ) : (
              <Link
                to="/auth"
                className="bg-mint text-petrol px-4 py-2 rounded-lg font-medium hover:bg-mint-500 transition-colors"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
