"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr"; 
import { toast } from "sonner";
import { Building, ArrowLeft, Loader2, Save, Search } from "lucide-react";

// --- CLIENTE SUPABASE MANUAL (Auto-contido) ---
// Criamos a conexão aqui mesmo para não depender de arquivos externos
const supabase = createBrowserClient(
  "https://tgsrhyugarrdtbsmherd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnc3JoeXVnYXJyZHRic21oZXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NDQzMDAsImV4cCI6MjA4MjQyMDMwMH0.0adZE_lwUILL1HZd1WGAHcZFbiC6GLUXOwqxZrppM6g"
);

export default function NewCompanyPage() {
  const router = useRouter();

  // Estados locais
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null); // Guardamos o usuário aqui
  
  const [formData, setFormData] = useState({
    name: "",
    trade_name: "",
    cnpj: "",
  });

  // 1. Ao carregar a página, verificamos quem está logado diretamente no Supabase
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Sessão não encontrada. Faça login.");
        router.push("/login");
      } else {
        console.log("👤 Usuário identificado:", user.id);
        setCurrentUser(user);
      }
    };
    checkUser();
  }, [router]);

  const formatCNPJ = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .slice(0, 18);
  };

  const handleInputChange = (field: string, value: string) => {
    if (field === "cnpj") {
      setFormData({ ...formData, cnpj: formatCNPJ(value) });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSearchCNPJ = async () => {
    const cleanCNPJ = formData.cnpj.replace(/\D/g, "");
    if (cleanCNPJ.length !== 14) {
      toast.warning("CNPJ inválido.");
      return;
    }
    setSearching(true);
    try {
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCNPJ}`);
      if (!response.ok) throw new Error("Não encontrado.");
      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        name: data.razao_social,
        trade_name: data.nome_fantasia || data.razao_social,
      }));
      toast.success("Empresa encontrada!");
    } catch (error) {
      toast.error("CNPJ não encontrado.");
    } finally {
      setSearching(false);
    }
  };

  // --- FUNÇÃO DE SALVAR (Sem dependências externas) ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🚀 MODO INDEPENDENTE: Iniciando criação...");

    if (!currentUser) {
      toast.error("Aguarde o carregamento do usuário.");
      return;
    }

    setLoading(true);

    try {
      // 1. Pegar a Sessão ATUAL (Para ter o Token Fresquinho)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error("Falha ao recuperar token de sessão.");
      }

      const accessToken = session.access_token;
      console.log("🔑 Token recuperado com sucesso.");

      // 2. Preparar Dados
      const payload = {
        name: formData.name,
        trade_name: formData.trade_name,
        cnpj: formData.cnpj,
        owner_id: currentUser.id,
        created_by: currentUser.id
      };

      // 3. FETCH Manual (Blindado)
      const response = await fetch(
        "https://tgsrhyugarrdtbsmherd.supabase.co/rest/v1/companies", 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, 
            "Authorization": `Bearer ${accessToken}`, // Token que acabamos de pegar
            "Prefer": "return=representation"
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Erro API (${response.status}): ${text}`);
      }

      const data = await response.json();
      console.log("✅ SUCESSO:", data);
      toast.success("Empresa criada!");
      
      setTimeout(() => {
        router.push("/hub");
        router.refresh();
      }, 1000);

    } catch (err: any) {
      console.error("🔥 ERRO:", err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-6 transition-colors font-medium"
      >
        <ArrowLeft size={18} />
        Voltar para seleção
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl text-white shadow-blue-200 shadow-md">
              <Building size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Nova Empresa</h2>
              <p className="text-sm text-slate-500">Cadastre um novo cliente</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-bold text-slate-700 mb-1">CNPJ</label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  className="w-full pl-4 pr-12 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono"
                  placeholder="00.000.000/0000-00"
                  value={formData.cnpj}
                  onChange={(e) => handleInputChange("cnpj", e.target.value)}
                  maxLength={18}
                />
                <button
                  type="button"
                  onClick={handleSearchCNPJ}
                  disabled={searching}
                  className="absolute right-2 p-1.5 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-600 transition-colors disabled:opacity-50"
                >
                  {searching ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                </button>
              </div>
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-bold text-slate-700 mb-1">Nome Fantasia</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-slate-50"
                value={formData.trade_name}
                onChange={(e) => handleInputChange("trade_name", e.target.value)}
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Razão Social <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-slate-50"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-slate-50 mt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-70 disabled:shadow-none"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Cadastrar e Vincular
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}