import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('tenant');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.auth.login({ email, password });
        setAuth(res.user, res.access_token);
      } else {
        const res = await api.auth.register({ email, password, full_name: fullName, role });
        setAuth(res.user, res.access_token);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-petrol-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/logo.jpg" alt="AltScore" className="h-12 w-12 rounded-xl mx-auto mb-4 object-cover" />
          <h1 className="text-2xl font-heading font-bold text-petrol">
            {isLogin ? 'Entrar na sua conta' : 'Criar conta'}
          </h1>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex mb-6 bg-petrol-50 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                isLogin ? 'bg-white text-petrol shadow-sm' : 'text-petrol-400'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                !isLogin ? 'bg-white text-petrol shadow-sm' : 'text-petrol-400'
              }`}
            >
              Cadastrar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <Input
                  label="Nome completo"
                  type="text"
                  placeholder="Seu nome"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-petrol mb-1">Tipo de conta</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-petrol-200 focus:outline-none focus:ring-2 focus:ring-mint text-petrol"
                  >
                    <option value="tenant">Locatário (quero alugar)</option>
                    <option value="landlord">Proprietário (tenho imóvel)</option>
                  </select>
                </div>
              </>
            )}
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
              {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Criar conta'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
