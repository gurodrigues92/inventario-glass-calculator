import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Empresa {
  cnpj: string;
  faturamentoAnual: string;
}

export interface Herdeiro {
  nome: string;
  parentesco: string;
  tipo: string;
}

export interface DadosDiagnostico {
  nome: string;
  cidade: string;
  estado: string;
  possuiHolding: boolean;
  cnpjHolding: string;
  possuiEmpresasLTDA: boolean;
  empresas: Empresa[];
  faixaPatrimonio: '5M' | '20M' | '50M' | '';
  imoveisAlugados: boolean;
  receitaAluguel: string;
  herdeiros: Herdeiro[];
  observacoes: string;
}

interface DiagnosticoContextType {
  dados: DadosDiagnostico;
  setDados: React.Dispatch<React.SetStateAction<DadosDiagnostico>>;
  updateField: <K extends keyof DadosDiagnostico>(field: K, value: DadosDiagnostico[K]) => void;
  isPreenchido: boolean;
  resetDados: () => void;
}

const initialData: DadosDiagnostico = {
  nome: '',
  cidade: '',
  estado: '',
  possuiHolding: false,
  cnpjHolding: '',
  possuiEmpresasLTDA: false,
  empresas: [],
  faixaPatrimonio: '',
  imoveisAlugados: false,
  receitaAluguel: '',
  herdeiros: [{ nome: '', parentesco: '', tipo: '' }],
  observacoes: '',
};

const DiagnosticoContext = createContext<DiagnosticoContextType | undefined>(undefined);

export function DiagnosticoProvider({ children }: { children: ReactNode }) {
  const [dados, setDados] = useState<DadosDiagnostico>(() => {
    const saved = localStorage.getItem('diagnostico_data');
    return saved ? JSON.parse(saved) : initialData;
  });

  const updateField = <K extends keyof DadosDiagnostico>(field: K, value: DadosDiagnostico[K]) => {
    setDados(prev => {
      const updated = { ...prev, [field]: value };
      localStorage.setItem('diagnostico_data', JSON.stringify(updated));
      return updated;
    });
  };

  const resetDados = () => {
    setDados(initialData);
    localStorage.removeItem('diagnostico_data');
  };

  const isPreenchido = Boolean(
    dados.nome && 
    dados.cidade && 
    dados.estado && 
    dados.faixaPatrimonio &&
    dados.herdeiros.length > 0 &&
    dados.herdeiros[0].nome
  );

  return (
    <DiagnosticoContext.Provider value={{ dados, setDados, updateField, isPreenchido, resetDados }}>
      {children}
    </DiagnosticoContext.Provider>
  );
}

export function useDiagnostico() {
  const context = useContext(DiagnosticoContext);
  if (!context) {
    throw new Error('useDiagnostico must be used within DiagnosticoProvider');
  }
  return context;
}
