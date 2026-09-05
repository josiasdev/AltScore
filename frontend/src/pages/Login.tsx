import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.auth.login({ email, password });
      setAuth(res.user, res.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleWalletLogin = async () => {
    setWalletLoading(true);
    setError('');

    try {
      if (!(window as any).solana?.isPhantom) {
        setError('Phantom Wallet não encontrada. Instale a extensão.');
        setWalletLoading(false);
        return;
      }

      const resp = await (window as any).solana.connect();
      const publicKey = resp.publicKey.toString();

      const res = await api.auth.loginWithWallet(publicKey);
      setAuth(res.user, res.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar com Phantom');
    } finally {
      setWalletLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-petrol-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/logo.jpg" alt="AltScore" className="h-16 w-auto max-w-[260px] rounded-xl mx-auto mb-4 object-contain bg-white px-3 py-2" />
          </Link>
          <h1 className="text-2xl font-heading font-bold text-petrol">Entrar na sua conta</h1>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button type="submit" fullWidth disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-petrol-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-petrol-400">ou</span>
              </div>
            </div>

            <button
              onClick={handleWalletLogin}
              disabled={walletLoading}
              className="mt-4 w-full flex items-center justify-center gap-3 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 128 128" fill="white">
                <path d="M19.7 26.3c-3.5 0-6.6 2.1-7.8 5.5L.3 95.9c-1.3 3.6 1.5 7.3 5.3 7.3h28.8c3.5 0 6.6-2.1 7.8-5.5l11.6-64.1c1.3-3.6-1.5-7.3-5.3-7.3H19.7zM57 26.3c-3.5 0-6.6 2.1-7.8 5.5l-11.6 64.1c-1.3 3.6 1.5 7.3 5.3 7.3h28.8c3.5 0 6.6-2.1 7.8-5.5l11.6-64.1c1.3-3.6-1.5-7.3-5.3-7.3H57zM94.3 26.3c-3.5 0-6.6 2.1-7.8 5.5l-11.6 64.1c-1.3 3.6 1.5 7.3 5.3 7.3H119c3.5 0 6.6-2.1 7.8-5.5l11.6-64.1c1.3-3.6-1.5-7.3-5.3-7.3H94.3z"/>
              </svg>
              {walletLoading ? 'Conectando...' : 'Entrar com Phantom'}
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-petrol-400">
            Não tem uma conta?{' '}
            <Link to="/cadastro" className="text-mint font-medium hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
