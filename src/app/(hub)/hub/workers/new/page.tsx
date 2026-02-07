"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  User, 
  ArrowLeft, 
  Save, 
  Loader2, 
  MapPin, 
  Briefcase, 
  Search
} from "lucide-react";

export default function NewWorkerPage() {
  const router = useRouter();
  const { currentCompany } = useAuth();
  const supabase = createClient();
  
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);

  // Estados para Dropdowns
  const [ghes, setGhes] = useState<any[]>([]);
  const [jobRoles, setJobRoles] = useState<any[]>([]);

  // Estado do Formulário
  const [formData, setFormData] = useState({
    name: "",
    cpf: "",
    rg: "",
    birth_date: "",
    sex: "M",
    phone: "",
    email: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    registration: "",
    admission_date: "",
    ghe_id: "",
    job_role_id: ""
  });

  // Carregar dependências
  useEffect(() => {
    async function loadDependencies() {
      if (!currentCompany) return;

      const { data: gheData } = await supabase
        .from("ghes")
        .select("id, name")
        .eq("company_id", currentCompany.id)
        .eq("is_active", true);
      
      if (gheData) setGhes(gheData);

      const { data: roleData } = await supabase
        .from("job_roles")
        .select("id, name")
        .eq("company_id", currentCompany.id);

      if (roleData) setJobRoles(roleData);
    }
    loadDependencies();
  }, [currentCompany]);

  // Máscaras
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cpf") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})/, "$1-$2")
        .replace(/(-\d{2})\d+?$/, "$1");
    }
    else if (name === "phone") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/^(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d{4})/, "$1-$2")
        .slice(0, 15);
    }
    else if (name === "cep") {
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/^(\d{5})(\d)/, "$1-$2")
        .slice(0, 9);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  // Busca de CEP
  const handleBlurCep = async () => {
    const cleanCep = formData.cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;

    setLoadingCep(true);
    try {
      const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${cleanCep}`);
      if (!res.ok) throw new Error("CEP não encontrado");
      
      const data = await res.json();
      setFormData(prev => ({
        ...prev,
        street: data.street || prev.street,
        neighborhood: data.neighborhood || prev.neighborhood,
        city: data.city || prev.city,
        state: data.state || prev.state
      }));
      toast.success("Endereço preenchido!");
    } catch (error) {
      toast.error("CEP não encontrado.");
    } finally {
      setLoadingCep(false);
    }
  };

  // Salvar
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCompany) return;

    if (!formData.name || !formData.cpf) {
      toast.error("Preencha Nome e CPF.");
      return;
    }

    setLoading(true);
    try {
      const addressJson = {
        cep: formData.cep,
        street: formData.street,
        number: formData.number,
        complement: formData.complement,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state
      };

      const { error } = await supabase.from("workers").insert({
        company_id: currentCompany.id,
        name: formData.name,
        cpf: formData.cpf,
        birth_date: formData.birth_date || null,
        sex: formData.sex,
        phone: formData.phone,
        email: formData.email,
        registration: formData.registration,
        admission_date: formData.admission_date || null,
        ghe_id: formData.ghe_id || null,
        job_role_id: formData.job_role_id || null,
        address_json: addressJson,
        status: 'active',
      });

      if (error) throw error;

      toast.success("Funcionário salvo!");
      router.push("/hub/workers");
      router.refresh();
      
    } catch (err: any) {
      toast.error("Erro: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Classes utilitárias para Inputs e Labels
  const inputClass = "w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white text-slate-700 placeholder:text-slate-400";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase mb-1 tracking-wide";

  return (
    <div className="max-w-5xl mx-auto p-6 pb-24">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-2 font-medium transition-colors"
          >
            <ArrowLeft size={18} /> Voltar
          </button>
          <h1 className="text-2xl font-bold text-slate-800">Novo Colaborador</h1>
          <p className="text-slate-500">Preencha os dados completos para o prontuário.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* SEÇÃO 1: DADOS PESSOAIS */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2 font-semibold text-slate-700">
            <User size={18} className="text-blue-600" />
            Identificação Civil
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-2">
              <label className={labelClass}>Nome Completo *</label>
              <input 
                name="name" type="text" required 
                className={inputClass}
                value={formData.name} onChange={handleInputChange}
                placeholder="Ex: João da Silva"
              />
            </div>
            <div>
              <label className={labelClass}>CPF *</label>
              <input 
                name="cpf" type="text" required 
                className={inputClass}
                value={formData.cpf} onChange={handleInputChange}
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>
            <div>
              <label className={labelClass}>RG</label>
              <input 
                name="rg" type="text" 
                className={inputClass}
                value={formData.rg} onChange={handleInputChange}
              />
            </div>
            <div>
              <label className={labelClass}>Data de Nascimento</label>
              <input 
                name="birth_date" type="date" 
                className={inputClass}
                value={formData.birth_date} onChange={handleInputChange}
              />
            </div>
            <div>
              <label className={labelClass}>Sexo</label>
              <select 
                name="sex" 
                className={inputClass}
                value={formData.sex} onChange={handleInputChange}
              >
                <option value="M">Masculino</option>
                <option value="F">Feminino</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Telefone / WhatsApp</label>
              <input 
                name="phone" type="text" 
                className={inputClass}
                value={formData.phone} onChange={handleInputChange}
                placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input 
                name="email" type="email" 
                className={inputClass}
                value={formData.email} onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* SEÇÃO 2: ENDEREÇO */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2 font-semibold text-slate-700">
            <MapPin size={18} className="text-blue-600" />
            Endereço Residencial
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-6 gap-6">
            <div className="md:col-span-1">
              <label className={labelClass}>CEP</label>
              <div className="relative">
                <input 
                  name="cep" type="text" 
                  className={`${inputClass} pr-8`}
                  value={formData.cep} 
                  onChange={handleInputChange}
                  onBlur={handleBlurCep}
                  placeholder="00000-000"
                />
                <div className="absolute right-2 top-2.5 text-slate-400">
                  {loadingCep ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                </div>
              </div>
            </div>
            <div className="md:col-span-3">
              <label className={labelClass}>Logradouro</label>
              <input 
                name="street" type="text" 
                className={`${inputClass} bg-slate-50`} // Fundo cinza pois é automático
                value={formData.street} onChange={handleInputChange}
              />
            </div>
            <div className="md:col-span-1">
              <label className={labelClass}>Número</label>
              <input 
                name="number" type="text" 
                className={inputClass}
                value={formData.number} onChange={handleInputChange}
              />
            </div>
            <div className="md:col-span-1">
              <label className={labelClass}>Comp.</label>
              <input 
                name="complement" type="text" 
                className={inputClass}
                value={formData.complement} onChange={handleInputChange}
              />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Bairro</label>
              <input 
                name="neighborhood" type="text" 
                className={`${inputClass} bg-slate-50`}
                value={formData.neighborhood} onChange={handleInputChange}
              />
            </div>
            <div className="md:col-span-3">
              <label className={labelClass}>Cidade</label>
              <input 
                name="city" type="text" 
                className={`${inputClass} bg-slate-50`}
                value={formData.city} onChange={handleInputChange}
              />
            </div>
            <div className="md:col-span-1">
              <label className={labelClass}>UF</label>
              <input 
                name="state" type="text" 
                className={`${inputClass} bg-slate-50`}
                value={formData.state} onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* SEÇÃO 3: VÍNCULO */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2 font-semibold text-slate-700">
            <Briefcase size={18} className="text-blue-600" />
            Dados Contratuais
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className={labelClass}>Matrícula</label>
              <input 
                name="registration" type="text" 
                className={inputClass}
                value={formData.registration} onChange={handleInputChange}
              />
            </div>
            <div>
              <label className={labelClass}>Data de Admissão</label>
              <input 
                name="admission_date" type="date" 
                className={inputClass}
                value={formData.admission_date} onChange={handleInputChange}
              />
            </div>
            
            {/* GHE Dropdown */}
            <div>
              <label className={labelClass}>
                GHE / Setor
                {ghes.length === 0 && <span className="ml-2 text-[10px] text-orange-500 font-normal">(Nenhum cadastrado)</span>}
              </label>
              <select 
                name="ghe_id" 
                className={inputClass}
                value={formData.ghe_id} onChange={handleInputChange}
              >
                <option value="">Selecione...</option>
                {ghes.map(ghe => (
                  <option key={ghe.id} value={ghe.id}>{ghe.name}</option>
                ))}
              </select>
            </div>

            {/* Cargo Dropdown */}
            <div>
              <label className={labelClass}>Cargo / Função</label>
              <select 
                name="job_role_id" 
                className={inputClass}
                value={formData.job_role_id} onChange={handleInputChange}
              >
                <option value="">Selecione...</option>
                {jobRoles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* FOOTER AÇÕES */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors border border-transparent hover:border-slate-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-70 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Salvar Cadastro
          </button>
        </div>

      </form>
    </div>
  );
}