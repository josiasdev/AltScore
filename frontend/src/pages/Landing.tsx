import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-petrol text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <img src="/logo.jpg" alt="AltScore" className="h-16 w-16 rounded-xl mx-auto mb-6 object-cover" />
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Alugue sem fiador.
            <br />
            <span className="text-mint">Seu histórico é sua garantia.</span>
          </h1>
          <p className="text-petrol-200 text-lg mb-8 max-w-2xl mx-auto">
            O AltScore usa dados reais de pagamento para construir um score de crédito alternativo.
            Sem fiador, sem complicação.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg">Começar agora</Button>
            </Link>
            <Link to="/imoveis">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-petrol">
                Ver imóveis
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">O problema</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl font-heading font-bold text-mint mb-2">46,5 milhões</div>
              <p className="text-petrol-400">de brasileiros vivem de aluguel</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-heading font-bold text-mint mb-2">1 em cada 4</div>
              <p className="text-petrol-400">jovens de 25-34 anos moram com os pais</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-heading font-bold text-mint mb-2">Renda 3x</div>
              <p className="text-petrol-400">é exigida para alugar sem fiador</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-petrol-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">Como funciona</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Crie sua conta', desc: 'Cadastro rápido com email e senha' },
              { step: '2', title: 'Conecte seus dados', desc: 'Pix, assinaturas, open finance' },
              { step: '3', title: 'Receba seu score', desc: 'Score alternativo de 0 a 1000' },
              { step: '4', title: 'Alugue sem fiador', desc: 'Use seu score como garantia' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-mint text-petrol rounded-full flex items-center justify-center text-xl font-heading font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-heading font-semibold mb-2">{item.title}</h3>
                <p className="text-petrol-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solana */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-heading font-bold mb-6">Por que Solana?</h2>
          <p className="text-petrol-400 text-lg mb-8">
            Seu score e contratos são registrados na blockchain Solana,
            garantindo transparência, imutabilidade e portabilidade dos seus dados.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-4 bg-petrol-50 rounded-xl">
              <h3 className="font-heading font-semibold mb-2">Imutável</h3>
              <p className="text-sm text-petrol-400">Seu histórico não pode ser alterado</p>
            </div>
            <div className="p-4 bg-petrol-50 rounded-xl">
              <h3 className="font-heading font-semibold mb-2">Transparente</h3>
              <p className="text-sm text-petrol-400">Qualquer pessoa pode verificar</p>
            </div>
            <div className="p-4 bg-petrol-50 rounded-xl">
              <h3 className="font-heading font-semibold mb-2">Portável</h3>
              <p className="text-sm text-petrol-400">Leve seu score para qualquer imobiliária</p>
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
          <p className="text-petrol-600 mb-8">
            Crie sua conta gratuita e descubra seu score alternativo
          </p>
          <Link to="/auth">
            <Button variant="secondary" size="lg">Criar conta grátis</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
