export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50">
      {/* Container Centralizado */}
      <div className="w-full max-w-md p-4">
        {children}
      </div>
    </div>
  );
}