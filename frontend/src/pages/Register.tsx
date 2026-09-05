import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Avatar } from '../components/ui/Avatar';

export function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'tenant' | 'landlord'>('tenant');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const formatCpf = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 11);
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.auth.register({ email, password, full_name: fullName, cpf: cpf.replace(/\D/g, ''), role });
      setAuth(res.user, res.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const handleWalletRegister = async () => {
    if (!(window as any).solana?.isPhantom) {
      setError('Phantom Wallet não encontrada. Instale a extensão.');
      return;
    }

    try {
      const resp = await (window as any).solana.connect();
      const publicKey = resp.publicKey.toString();
      const res = await api.auth.registerWithWallet({ public_key: publicKey, role });
      setAuth(res.user, res.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar com Phantom');
    }
  };

  return (
    <div className="min-h-screen bg-petrol-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/logo.jpg" alt="AltScore" className="h-16 w-auto max-w-[260px] rounded-xl mx-auto mb-4 object-contain bg-white px-3 py-2" />
          </Link>
          <h1 className="text-2xl font-heading font-bold text-petrol">Criar sua conta</h1>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="mb-6">
            <label className="block text-sm font-medium text-petrol mb-2">Tipo de conta</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setRole('tenant')}
                className={`flex-1 flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                  role === 'tenant' ? 'border-mint bg-mint-50' : 'border-petrol-200 hover:border-petrol-300'
                }`}
              >
                <Avatar name={fullName || 'U'} role="tenant" size="sm" />
                <span className="text-sm font-medium text-petrol">Locatário</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('landlord')}
                className={`flex-1 flex items-center gap-3 p-3 rounded-lg border-2 transition-colors ${
                  role === 'landlord' ? 'border-mint bg-mint-50' : 'border-petrol-200 hover:border-petrol-300'
                }`}
              >
                <Avatar name={fullName || 'U'} role="landlord" size="sm" />
                <span className="text-sm font-medium text-petrol">Proprietário</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome completo"
              type="text"
              placeholder="Seu nome"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              label="CPF"
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(formatCpf(e.target.value))}
              required
              maxLength={14}
            />
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
              {loading ? 'Criando conta...' : 'Criar conta'}
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
              onClick={handleWalletRegister}
              className="mt-4 w-full flex items-center justify-center gap-3 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 128 128" fill="white">
                <path d="M19.7 26.3c-3.5 0-6.6 2.1-7.8 5.5L.3 95.9c-1.3 3.6 1.5 7.3 5.3 7.3h28.8c3.5 0 6.6-2.1 7.8-5.5l11.6-64.1c1.3-3.6-1.5-7.3-5.3-7.3H19.7zM57 26.3c-3.5 0-6.6 2.1-7.8 5.5l-11.6 64.1c-1.3 3.6 1.5 7.3 5.3 7.3h28.8c3.5 0 6.6-2.1 7.8-5.5l11.6-64.1c1.3-3.6-1.5-7.3-5.3-7.3H57zM94.3 26.3c-3.5 0-6.6 2.1-7.8 5.5l-11.6 64.1c-1.3 3.6 1.5 7.3 5.3 7.3H119c3.5 0 6.6-2.1 7.8-5.5l11.6-64.1c1.3-3.6-1.5-7.3-5.3-7.3H94.3z"/>
              </svg>
              Cadastrar com Phantom
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-petrol-400">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-mint font-medium hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
