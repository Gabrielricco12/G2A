"use client";

import { useAuth } from "@/contexts/AuthContext";
import { 
  Building2, 
  ArrowLeft, 
  Briefcase, 
  HardHat, 
  ShieldAlert, 
  FileCheck,
  Factory,
  PenSquare
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CompanySettingsHub() {
  const { currentCompany } = useAuth();
  const router = useRouter();

  if (!currentCompany) return null;

  return (
    <div className="max-w-5xl mx-auto p-8 pb-24">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-4 font-medium transition-colors"
        >
          <ArrowLeft size={18} /> Voltar para o Dashboard
        </button>
        <div className="flex items-center gap-4">
          <div className="bg-slate-100 p-4 rounded-xl">
             <Building2 size={32} className="text-slate-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Configurações da Empresa</h1>
            <p className="text-slate-500">
              Gerencie riscos, cargos e definições do PCA para <span className="font-semibold text-slate-700">{currentCompany.trade_name}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Grid de Configurações */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* CARGOS E FUNÇÕES */}
        <SettingsCard 
          title="Cargos e Funções"
          description="Cadastre os cargos (Job Roles) existentes na empresa para vincular aos funcionários."
          icon={<Briefcase size={24} className="text-blue-600" />}
          href="/hub/settings/roles"
          color="bg-blue-50 hover:bg-blue-100"
        />

        {/* GHEs */}
        <SettingsCard 
          title="GHEs e Setores"
          description="Gerencie Grupos Homogêneos de Exposição e os setores da empresa."
          icon={<Factory size={24} className="text-purple-600" />}
          href="/hub/settings/ghes"
          color="bg-purple-50 hover:bg-purple-100"
        />

        {/* RISCOS E EPIs */}
        <SettingsCard 
          title="Riscos e Proteção"
          description="Defina níveis de ruído, riscos químicos e os EPIs recomendados por GHE."
          icon={<ShieldAlert size={24} className="text-orange-600" />}
          href="/hub/settings/risks"
          color="bg-orange-50 hover:bg-orange-100"
        />

        {/* CONFIGURAÇÕES DO PCA */}
        <SettingsCard 
          title="Parâmetros do PCA"
          description="Ajuste critérios de mudança significativa de limiar e frequências de teste."
          icon={<FileCheck size={24} className="text-emerald-600" />}
          href="/hub/settings/pca"
          color="bg-emerald-50 hover:bg-emerald-100"
        />

        {/* DADOS CADASTRAIS */}
        <SettingsCard 
          title="Dados Cadastrais"
          description="Edite endereço, CNAE, grau de risco e contatos da empresa."
          icon={<PenSquare size={24} className="text-slate-600" />}
          href="/hub/settings/details"
          color="bg-slate-50 hover:bg-slate-100"
        />

      </div>
    </div>
  );
}

// Componente do Cartão de Configuração
function SettingsCard({ title, description, icon, href, color }: any) {
  return (
    <Link 
      href={href}
      className={`block p-6 rounded-xl border border-slate-200 transition-all hover:shadow-md ${color} group`}
    >
      <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-bold text-slate-800 text-lg mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </Link>
  );
}