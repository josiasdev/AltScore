import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { ErrorBanner } from '../components/ui/ErrorBanner';
import { ScoreDisplay } from '../components/score/ScoreDisplay';
import type { Property, Score } from '../types';

export function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [property, setProperty] = useState<Property | null>(null);
  const [score, setScore] = useState<Score | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [checkingScore, setCheckingScore] = useState(false);

  const loadProperty = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.properties.get(Number(id));
      setProperty(res);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar imóvel');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperty();
  }, [id]);

  useEffect(() => {
    if (isAuthenticated) {
      api.score.get().then(setScore).catch(() => {});
    }
  }, [isAuthenticated]);

  const handleCheckScore = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setCheckingScore(true);
    try {
      const res = await api.score.get();
      if (res) {
        setScore(res);
      } else {
        const calculated = await api.score.calculate();
        setScore(calculated);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao verificar score');
    } finally {
      setCheckingScore(false);
    }
  };

  const handleRequestContract = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setRequesting(true);
    try {
      await api.contracts.create({ property_id: Number(id) });
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Erro ao solicitar contrato');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-petrol-50">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-petrol-50">
        <div className="text-center">
          <div className="text-5xl mb-4">🏚️</div>
          <h2 className="font-heading font-semibold text-petrol mb-2">Imóvel não encontrado</h2>
          <Button variant="ghost" onClick={() => navigate('/imoveis')}>
            ← Voltar para imóveis
          </Button>
        </div>
      </div>
    );
  }

  const isQualified = score && score.total >= 500;
  const minScoreRequired = 500;

  return (
    <div className="min-h-screen bg-petrol-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-mint font-medium mb-4 hover:underline"
        >
          ← Voltar
        </button>

        {error && <ErrorBanner message={error} onRetry={() => setError('')} />}

        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
          <div className="h-64 bg-petrol-50">
            <img
              src={property.image_url}
              alt={property.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400"><rect fill="%23E8F2F2" width="800" height="400"/><text fill="%238FBDBF" font-family="sans-serif" font-size="24" x="400" y="200" text-anchor="middle">Sem foto</text></svg>';
              }}
            />
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-heading font-bold text-petrol">{property.title}</h1>
                <p className="text-petrol-400">{property.address}</p>
                <p className="text-sm text-petrol-300">{property.neighborhood}</p>
              </div>
              <div className="flex gap-2">
                {property.accepts_altscore && <Badge variant="success">Alugue sem fiador</Badge>}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-petrol-100">
              <div className="text-center">
                <p className="text-xl font-heading font-bold text-petrol">{property.bedrooms}</p>
                <p className="text-sm text-petrol-400">Quartos</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-heading font-bold text-petrol">{property.bathrooms}</p>
                <p className="text-sm text-petrol-400">Banheiros</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-heading font-bold text-petrol">{property.area_m2}m²</p>
                <p className="text-sm text-petrol-400">Área</p>
              </div>
            </div>

            <p className="text-petrol-400 mb-6">{property.description}</p>

            {/* Score Verification */}
            {property.accepts_altscore && (
              <div className="bg-petrol-50 rounded-xl p-6 mb-6">
                <h3 className="font-heading font-semibold text-lg text-petrol mb-4">
                  Verificar seu score para este imóvel
                </h3>
                {score ? (
                  <div className="flex items-center gap-6">
                    <ScoreDisplay score={score.total} level={score.level} />
                    <div className="flex-1">
                      <p className="text-petrol font-medium mb-2">
                        {isQualified
                          ? `✅ Você está qualificado! Score mínimo: ${minScoreRequired}`
                          : `❌ Score mínimo necessário: ${minScoreRequired}`
                        }
                      </p>
                      <p className="text-sm text-petrol-400">
                        {isQualified
                          ? 'Seu score atende ao requisito deste imóvel.'
                          : 'Conecte mais fontes de dados para aumentar seu score.'
                        }
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-petrol-400 mb-4">
                      Verifique seu score para saber se está qualificado
                    </p>
                    <Button onClick={handleCheckScore} disabled={checkingScore}>
                      {checkingScore ? 'Verificando...' : 'Verificar meu score'}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Price and CTA */}
            <div className="flex items-center justify-between bg-petrol rounded-xl p-6">
              <div>
                <p className="text-petrol-200 text-sm">Aluguel mensal</p>
                <p className="text-3xl font-heading font-bold text-mint">
                  R$ {property.rent_value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              {success ? (
                <div className="text-center">
                  <p className="text-mint font-medium mb-2">Solicitação enviada!</p>
                  <Button variant="secondary" onClick={() => navigate('/contratos')}>
                    Ver contratos
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleRequestContract}
                  disabled={requesting || (property.accepts_altscore && !isQualified)}
                >
                  {requesting ? 'Enviando...' : 'Solicitar contrato'}
                </Button>
              )}
            </div>

            <div className="mt-4 text-sm text-petrol-400">
              <p>Proprietário: {property.landlord_name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
