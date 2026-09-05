export function Footer() {
  return (
    <footer className="bg-petrol text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="AltScore" className="h-8 w-auto rounded-lg object-contain bg-white px-2 py-1" />
            <span className="font-heading font-bold">AltScore</span>
          </div>
          <p className="text-petrol-200 text-sm">
            Score de crédito alternativo para plataformas de aluguel. Alugue sem fiador.
          </p>
          <div className="flex items-center gap-4 text-petrol-300 text-sm">
            <span>QuintoAndar</span>
            <span>•</span>
            <span>Zap Imóveis</span>
            <span>•</span>
            <span>VivaReal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
