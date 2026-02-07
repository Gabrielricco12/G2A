export default function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Simples */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center px-8 justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold">
            G
          </div>
          <span className="font-bold text-slate-700 text-lg">G2A Hub</span>
        </div>
        <div className="text-sm text-slate-500">
          Selecione o ambiente de trabalho
        </div>
      </header>
      
      {/* Conteúdo Central */}
      <main className="container mx-auto py-12 px-4">
        {children}
      </main>
    </div>
  );
}