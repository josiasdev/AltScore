export function Footer() {
  return (
    <footer className="bg-petrol text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="AltScore" className="h-6 w-6 rounded object-cover" />
            <span className="font-heading font-bold">AltScore</span>
          </div>
          <p className="text-petrol-200 text-sm">
            Alugue sem fiador. Seu histórico é sua garantia.
          </p>
          <p className="text-petrol-300 text-xs">
            Hackathon Universitário Superteam Brasil 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
