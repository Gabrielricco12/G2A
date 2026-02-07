"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Lock, Mail, AlertCircle } from "lucide-react";
import { toast } from "sonner"; 

// Ajuste o import do logo conforme sua estrutura
import LogoG2A from "@/assets/logo.png"; 

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // --- DEBUG 1: Início ---
    console.group("🔍 DEBUG LOGIN G2A");
    console.log("1. Botão clicado. Iniciando processo...");
    console.log("   Email fornecido:", email);
    
    setLoading(true);
    setError(null);

    try {
      console.log("2. Chamando supabase.auth.signInWithPassword...");
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // --- DEBUG 2: Resposta do Supabase ---
      console.log("3. Resposta do Supabase recebida:");
      
      if (error) {
        console.error("❌ ERRO RETORNADO PELO SUPABASE:", error);
        console.error("   Mensagem:", error.message);
        throw error;
      }

      console.log("   Dados da Sessão:", data.session ? "✅ Sessão Criada OK" : "⚠️ Sem Sessão");
      console.log("   Dados do Usuário:", data.user ? "✅ Usuário Encontrado" : "⚠️ Sem Usuário");

      if (!data.session) {
        console.warn("⚠️ Login não retornou erro, mas não há sessão. Pode ser pendência de confirmação de email.");
        throw new Error("Sessão não criada. Verifique se confirmou seu email.");
      }

      // --- DEBUG 3: Sucesso ---
      console.log("4. Login Validado! Preparando redirecionamento...");
      
      toast.success("Login realizado com sucesso!");
      
      console.log("5. Executando router.refresh()...");
      router.refresh(); // Garante que o servidor atualize os cookies
      
      console.log("6. Executando router.push('/hub')...");
      router.push("/hub");

    } catch (err: any) {
      // --- DEBUG 4: Captura de Erro ---
      console.error("🔥 EXCEÇÃO CAPTURADA NO CATCH:", err);
      
      const msg = err.message || "Erro ao autenticar.";
      setError(msg);
      toast.error(msg);
    } finally {
      console.log("7. Finalizando loading (setLoading false)");
      console.groupEnd();
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden">
      
      {/* --- CABEÇALHO --- */}
      <div className="bg-slate-50 p-8 text-center border-b border-slate-100">
        <div className="flex justify-center mb-4">
          <div className="relative w-32 h-32"> 
             <Image 
               src={LogoG2A} 
               alt="G2A Logo" 
               fill
               className="object-contain"
               priority
             />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Acesso ao Sistema</h2>
        <p className="text-sm text-slate-500 mt-2">
          Gerenciador de Audiologia Automatizada
        </p>
      </div>

      {/* --- FORMULÁRIO --- */}
      <div className="p-8">
        <form onSubmit={handleLogin} className="space-y-5">
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-100">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="email">
              E-mail Corporativo
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail size={18} />
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="seunome@empresa.com"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700" htmlFor="password">
              Senha
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={18} />
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Autenticando...
              </>
            ) : (
              "Entrar no G2A"
            )}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-4 text-center border-t border-slate-100 pt-6">
          <button 
            type="button"
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            onClick={() => toast.info("Funcionalidade em desenvolvimento.")}
          >
            Esqueceu sua senha?
          </button>

          <div className="text-sm text-slate-600">
            Não tem uma conta?{' '}
            <button
              type="button"
              onClick={() => router.push('/register')}
              className="text-blue-600 font-bold hover:underline focus:outline-none ml-1"
            >
              Criar conta agora
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
          Ambiente Seguro & Auditável
        </p>
      </div>
    </div>
  );
}