import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-petrol text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <img src="/logo.jpg" alt="AltScore" className="h-20 w-auto max-w-[320px] rounded-xl mx-auto mb-8 object-contain bg-white px-4 py-2" />
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
            Score de crédito para
            <br />
            <span className="text-mint">plataformas de aluguel.</span>
          </h1>
          <p className="text-petrol-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            O AltScore é a solução que conecta inquilinos a imóveis.
            Seu score alternativo é aceito em plataformas como QuintoAndar, Zap Imóveis e mais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cadastro">
              <Button size="lg">Começar agora</Button>
            </Link>
            <Link to="/imoveis">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-petrol">
                Ver imóveis parceiros
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Partners Logos */}
      <section className="py-8 px-4 bg-white border-b border-petrol-100">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-petrol-300 text-sm mb-6">Plataformas que aceitam AltScore</p>
          <div className="flex items-center justify-center gap-8 md:gap-12 flex-wrap opacity-50">
            <span className="text-xl md:text-2xl font-heading font-bold text-petrol-300">QuintoAndar</span>
            <span className="text-xl md:text-2xl font-heading font-bold text-petrol-300">Zap Imóveis</span>
            <span className="text-xl md:text-2xl font-heading font-bold text-petrol-300">VivaReal</span>
            <span className="text-xl md:text-2xl font-heading font-bold text-petrol-300">ImovelWeb</span>
            <span className="text-xl md:text-2xl font-heading font-bold text-petrol-300">OLX</span>
          </div>
        </div>
      </section>

      {/* Market Data */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-petrol-50 rounded-2xl">
              <div className="text-5xl font-heading font-bold text-mint mb-3">46,5M</div>
              <p className="text-petrol font-medium mb-1">de brasileiros alugam</p>
              <p className="text-petrol-400 text-sm">e dependem de fiadores para conseguir um imóvel</p>
            </div>
            <div className="text-center p-8 bg-petrol-50 rounded-2xl">
              <div className="text-5xl font-heading font-bold text-mint mb-3">1 em cada 4</div>
              <p className="text-petrol font-medium mb-1">jovens de 25-34 anos</p>
              <p className="text-petrol-400 text-sm">ainda moram com os pais por falta de opção</p>
            </div>
            <div className="text-center p-8 bg-petrol-50 rounded-2xl">
              <div className="text-5xl font-heading font-bold text-mint mb-3">3x</div>
              <p className="text-petrol font-medium mb-1">a renda mensal</p>
              <p className="text-petrol-400 text-sm">é o que muitos proprietários exigem de fiador</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-6 text-petrol">
                De fiador impossível a<span className="text-mint"> aluguel garantido</span>
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-500 font-bold">✗</span>
                  </div>
                  <div>
                    <p className="font-medium text-petrol">Fiador com renda 3x o aluguel</p>
                    <p className="text-sm text-petrol-400">A maioria dos jovens não consegue</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-red-500 font-bold">✗</span>
                  </div>
                  <div>
                    <p className="font-medium text-petrol">Histórico de crédito invisível</p>
                    <p className="text-sm text-petrol-400">Quem paga em dia não tem como provar</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-sh-shrink-0">
                    <span className="text-red-500 font-bold">✗</span>
                  </div>
                  <div>
                    <p className="font-medium text-petrol">Sistema tradicional exclui</p>
                    <p className="text-sm text-petrol-400">Informais e jovens ficam de fora</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-petrol rounded-2xl p-8 text-white">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-mint rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-petrol font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-medium">Score baseado em pagamentos reais</p>
                    <p className="text-sm text-petrol-200">Pix, assinaturas, open finance</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-mint rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-petrol font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-medium">Dados na blockchain Solana</p>
                    <p className="text-sm text-petrol-200">Transparente, imutável, portável</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-mint rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-petrol font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-medium">Aceito em múltiplas plataformas</p>
                    <p className="text-sm text-petrol-200">QuintoAndar, Zap, VivaReal e mais</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-petrol-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center mb-4 text-petrol">Como funciona</h2>
          <p className="text-center text-petrol-400 mb-12">3 passos simples para alugar sem fiador</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Crie sua conta', desc: 'Cadastre-se gratuitamente com email ou conecte sua wallet Phantom', icon: '👤' },
              { step: '2', title: 'Conecte seus dados', desc: 'Vincule Pix, assinaturas e open finance para gerar seu score', icon: '🔗' },
              { step: '3', title: 'Alugue sem fiador', desc: 'Use seu AltScore como garantia em qualquer plataforma parceira', icon: '🏠' },
            ].map((item) => (
              <div key={item.step} className="bg-white p-8 rounded-2xl text-center shadow-sm">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="w-12 h-12 bg-mint text-petrol rounded-full flex items-center justify-center text-xl font-heading font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2 text-petrol">{item.title}</h3>
                <p className="text-petrol-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Platforms */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold mb-6 text-petrol">Para plataformas de aluguel</h2>
          <p className="text-petrol-400 text-lg mb-8">
            Integre o AltScore e amplie seu número de inquilinos qualificados.
            Reduza a inadimplência e aumente a confiança nas transações.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-6 bg-petrol-50 rounded-xl">
              <div className="text-3xl mb-3">📈</div>
              <h3 className="font-heading font-semibold mb-2 text-petrol">Mais inquilinos</h3>
              <p className="text-sm text-petrol-400">Acesse um público que hoje é excluído pelo sistema tradicional</p>
            </div>
            <div className="p-6 bg-petrol-50 rounded-xl">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="font-heading font-semibold mb-2 text-petrol">Menos risco</h3>
              <p className="text-sm text-petrol-400">Score baseado em dados reais de pagamento, não em renda formal</p>
            </div>
            <div className="p-6 bg-petrol-50 rounded-xl">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-heading font-semibold mb-2 text-petrol">Integração rápida</h3>
              <p className="text-sm text-petrol-400">API simples para verificar o score do inquilino em segundos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solana */}
      <section className="py-16 px-4 bg-petrol-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold mb-6 text-petrol">Seu Score seguro</h2>
          <p className="text-petrol-400 text-lg mb-8">
            Seu score e contratos são registrados na blockchain Solana,
            garantindo transparência, imutabilidade e portabilidade dos seus dados.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-xl">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="font-heading font-semibold mb-2 text-petrol">Imutável</h3>
              <p className="text-sm text-petrol-400">Seu histórico não pode ser alterado ou adulterado</p>
            </div>
            <div className="p-6 bg-white rounded-xl">
              <div className="text-3xl mb-3">👁️</div>
              <h3 className="font-heading font-semibold mb-2 text-petrol">Transparente</h3>
              <p className="text-sm text-petrol-400">Qualquer pessoa pode verificar seu score na chain</p>
            </div>
            <div className="p-6 bg-white rounded-xl">
              <div className="text-3xl mb-3">📦</div>
              <h3 className="font-heading font-semibold mb-2 text-petrol">Portável</h3>
              <p className="text-sm text-petrol-400">Leve seu score para qualquer plataforma parceira</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-mint py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold text-petrol mb-4">
            Comece a alugar hoje
          </h2>
          <p className="text-petrol-600 mb-8 text-lg">
            Crie sua conta gratuita e descubra seu score alternativo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cadastro">
              <Button variant="secondary" size="lg">Criar conta grátis</Button>
            </Link>
            <Link to="/imoveis">
              <Button variant="outline" size="lg" className="border-petrol text-petrol hover:bg-petrol hover:text-white">
                Ver imóveis parceiros
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
