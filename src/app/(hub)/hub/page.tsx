"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Building2, ChevronRight, Loader2, LogOut } from "lucide-react";

export default function HubPage() {
  const { user, availableCompanies, switchCompany, isLoading, signOut } = useAuth();
  const router = useRouter();

  // Se o usuário entrar aqui e não tiver logado, o Middleware protege, 
  // mas por segurança dupla:
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  const handleSelectCompany = (companyId: string) => {
    switchCompany(companyId);
    router.push("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-500">Carregando seus ambientes...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Meus Clientes</h1>
          <p className="text-slate-500 mt-2">
            Olá, <span className="font-semibold text-slate-700">{user?.user_metadata.full_name || user?.email}</span>. 
            Selecione uma empresa para gerenciar.
          </p>
        </div>
        
        <button 
          onClick={() => signOut()}
          className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card de Nova Empresa */}
        <button
          onClick={() => router.push("/hub/new")}
          className="group flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
        >
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Plus size={24} />
          </div>
          <span className="font-semibold text-slate-600 group-hover:text-blue-700">
            Cadastrar Nova Empresa
          </span>
        </button>

        {/* Lista de Empresas Existentes */}
        {availableCompanies.map((company) => (
          <div
            key={company.id}
            onClick={() => handleSelectCompany(company.id)}
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 cursor-pointer transition-all group relative"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                <Building2 size={20} />
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600">
                <ChevronRight />
              </div>
            </div>
            
            <h3 className="font-bold text-lg text-slate-800 truncate">
              {company.trade_name || company.name}
            </h3>
            <p className="text-sm text-slate-500 truncate mb-4">
              {company.cnpj || "CNPJ não informado"}
            </p>
            
            <div className="flex items-center gap-2 mt-auto">
              <span className={`w-2 h-2 rounded-full ${company.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs font-medium text-slate-400">
                {company.is_active ? 'Ativa' : 'Inativa'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}