"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Database } from '@/types/supabase';

type Company = Database['public']['Tables']['companies']['Row'];

interface AuthContextProps {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  currentCompany: Company | null;
  availableCompanies: Company[];
  switchCompany: (companyId: string) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [availableCompanies, setAvailableCompanies] = useState<Company[]>([]);
  const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  // Cria o cliente (Lembre-se de manter o client.ts com as chaves hardcoded se o .env falhar)
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        console.log("🔒 Auth: Iniciando verificação...");
        
        // Timeout de Segurança: Se o Supabase não responder em 5s, libera a tela
        const timeOutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Timeout de conexão")), 5000)
        );

        const sessionPromise = supabase.auth.getSession();

        // Corrida: Quem chegar primeiro ganha (Sessão ou Erro de Timeout)
        const { data: { session: currentSession } } = await Promise.race([
          sessionPromise,
          timeOutPromise
        ]) as any;
        
        if (!mounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          console.log("👤 Usuário logado via AuthContext. Buscando empresas...");
          // Tenta buscar empresas, mas se falhar, NÃO trava o login
          try {
            await fetchUserCompanies(currentSession.user.id);
          } catch (companyError) {
            console.error("⚠️ Aviso: Falha ao carregar empresas (RLS ou Rede).", companyError);
            // Não fazemos 'throw' aqui para permitir que o usuário entre no sistema mesmo sem empresas
          }
        }
      } catch (err) {
        console.error("❌ Auth Crítico:", err);
      } finally {
        // --- A CURA DO LOADING INFINITO ---
        // Isso roda SEMPRE, dando erro ou sucesso.
        if (mounted) {
          setIsLoading(false);
          console.log("✅ Auth: Loading finalizado.");
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;
      
      console.log(`🔔 Auth Event: ${event}`);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (event === 'SIGNED_IN' && currentSession?.user) {
        // Ao logar, busca empresas (sem travar a UI principal pois o loading já passou)
        fetchUserCompanies(currentSession.user.id);
      } else if (event === 'SIGNED_OUT') {
        setAvailableCompanies([]);
        setCurrentCompany(null);
        localStorage.removeItem('g2a_last_company');
        router.push('/login');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const fetchUserCompanies = async (userId: string) => {
    try {
      console.log("🏢 Buscando empresas...");
      // Nota: Se o RLS estiver errado, isso aqui trava ou dá erro.
      // O try/catch lá em cima agora protege o app de travar.
      const { data, error } = await supabase
        .from('company_members')
        .select('*, companies(*)')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) throw error;

      const companies = data
        .map((item: any) => item.companies)
        .filter((c): c is Company => c !== null);

      console.log(`🏢 Empresas encontradas: ${companies.length}`);
      setAvailableCompanies(companies);

      const storedCompanyId = localStorage.getItem('g2a_last_company');
      const targetCompany = companies.find(c => c.id === storedCompanyId) || companies[0];

      if (targetCompany) {
        setCurrentCompany(targetCompany);
      }
    } catch (err) {
      console.error('Erro ao buscar empresas:', err);
    }
  };

  const switchCompany = (companyId: string) => {
    const selected = availableCompanies.find(c => c.id === companyId);
    if (selected) {
      setCurrentCompany(selected);
      localStorage.setItem('g2a_last_company', companyId);
      router.refresh(); 
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('g2a_last_company');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isLoading, 
      currentCompany, 
      availableCompanies, 
      switchCompany,
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);