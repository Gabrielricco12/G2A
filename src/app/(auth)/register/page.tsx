"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Lock, Mail, User, AlertCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner"; // <--- Importação

import LogoG2A from "@/assets/logo.png"; 

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Criar o usuário no Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (signUpError) throw signUpError;

      // 2. Feedback de Sucesso
      if (data.session) {
        toast.success("Conta criada com sucesso! Bem-vindo.");
        router.push("/dashboard");
        router.refresh();
      } else {
        // Caso exija confirmação de email
        toast.info("Cadastro realizado! Verifique seu e-mail para confirmar.");
        router.push("/login");
      }

    } catch (err: any) {
      console.error(err);
      const msg = err.message || "Erro ao criar conta.";
      setError(msg);
      toast.error(msg); // <--- Feedback visual vermelho
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden">
      {/* Cabeçalho */}
      <div className="bg-slate-50 p-8 text-center border-b border-slate-100">
        <div className="flex justify-center mb-4">
          <div className="relative w-24 h-24">
             <Image 
               src={LogoG2A} 
               alt="G2A Logo" 
               fill
               className="object-contain"
             />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Criar Nova Conta</h2>
        <p className="text-sm text-slate-500 mt-2">
          Junte-se ao G2A e otimize sua gestão audiológica
        </p>
      </div>

      {/* Formulário */}
      <div className="p-8">
        <form onSubmit={handleRegister} className="space-y-5">
          
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-100">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Nome Completo */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Nome Completo</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <User size={18} />
              </div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Dr. João Silva"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">E-mail</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="nome@exemplo.com"
              />
            </div>
          </div>

          {/* Senha */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Senha</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                Cadastrar
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 mb-2">
            Já tem uma conta?
          </p>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-blue-600 font-bold hover:underline focus:outline-none"
          >
            Fazer Login
          </button>
        </div>
      </div>
    </div>
  );
}