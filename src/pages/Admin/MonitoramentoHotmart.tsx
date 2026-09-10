import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MetricasHotmart } from "@/components/admin/MetricasHotmart";
import { TabelaComprasRecentes } from "@/components/admin/TabelaComprasRecentes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface Compra {
  id: string;
  email: string;
  nome: string;
  status: string;
  created_at: string;
  tempo_processamento_ms?: number;
  erro_mensagem?: string;
  erro_stack?: string;
  etapa_falha?: string;
  webhook_payload?: Record<string, unknown>;
  produto?: string;
}

export default function MonitoramentoHotmart() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [filteredCompras, setFilteredCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCompra, setSelectedCompra] = useState<Compra | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Métricas
  const [metricas, setMetricas] = useState({
    total: 0,
    sucesso: 0,
    erro: 0,
    taxaSucesso: 0,
    tempoMedio: 0,
  });

  const carregarCompras = async () => {
    try {
      setLoading(true);
      
      // Buscar últimas 100 compras
      const { data, error } = await supabase
        .from('log_compras_hotmart')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      setCompras(data || []);
      setFilteredCompras(data || []);

      // Calcular métricas
      if (data && data.length > 0) {
        const sucesso = data.filter(c => c.status === 'email_enviado').length;
        const erro = data.filter(c => c.status.startsWith('erro_')).length;
        
        const tempos = data
          .filter(c => c.tempo_processamento_ms)
          .map(c => c.tempo_processamento_ms!);
        
        const tempoMedio = tempos.length > 0 
          ? Math.round(tempos.reduce((a, b) => a + b, 0) / tempos.length)
          : 0;

        setMetricas({
          total: data.length,
          sucesso,
          erro,
          taxaSucesso: (sucesso / data.length) * 100,
          tempoMedio,
        });

        // Alerta se taxa de erro > 10%
        if (erro / data.length > 0.1) {
          toast.error(`⚠️ Taxa de erro elevada: ${((erro / data.length) * 100).toFixed(1)}%`);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar compras:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCompras();
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(carregarCompras, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = compras.filter(c => 
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCompras(filtered);
    } else {
      setFilteredCompras(compras);
    }
  }, [searchTerm, compras]);

  const handleVerDetalhes = (compra: Compra) => {
    setSelectedCompra(compra);
    setDetailsOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Monitoramento Hotmart</h1>
        <p className="text-muted-foreground">
          Acompanhamento em tempo real das compras e acessos criados
        </p>
      </div>

      {/* Alerta se taxa de erro > 10% */}
      {metricas.erro / metricas.total > 0.1 && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Taxa de erro elevada: {((metricas.erro / metricas.total) * 100).toFixed(1)}% nas últimas {metricas.total} compras.
            Verifique os logs imediatamente!
          </AlertDescription>
        </Alert>
      )}

      {/* Métricas */}
      <MetricasHotmart
        totalCompras={metricas.total}
        taxaSucesso={metricas.taxaSucesso}
        comprasComErro={metricas.erro}
        tempoMedio={metricas.tempoMedio}
        loading={loading}
      />

      {/* Filtros e Ações */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por email ou nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={carregarCompras} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </Card>

      {/* Tabela de Compras */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Compras Recentes</h2>
        <TabelaComprasRecentes
          compras={filteredCompras}
          onVerDetalhes={handleVerDetalhes}
          loading={loading}
        />
      </Card>

      {/* Dialog de Detalhes */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Compra</DialogTitle>
            <DialogDescription>
              Informações completas sobre o processamento
            </DialogDescription>
          </DialogHeader>
          
          {selectedCompra && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Informações do Cliente</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>Nome:</strong> {selectedCompra.nome}</div>
                  <div><strong>Email:</strong> {selectedCompra.email}</div>
                  <div><strong>Produto:</strong> {selectedCompra.produto || 'N/A'}</div>
                  <div><strong>Data:</strong> {new Date(selectedCompra.created_at).toLocaleString('pt-BR')}</div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Status do Processamento</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>Status:</strong> {selectedCompra.status}</div>
                  <div><strong>Tempo:</strong> {selectedCompra.tempo_processamento_ms ? `${selectedCompra.tempo_processamento_ms}ms` : 'N/A'}</div>
                  {selectedCompra.etapa_falha && (
                    <div className="col-span-2"><strong>Etapa da Falha:</strong> {selectedCompra.etapa_falha}</div>
                  )}
                </div>
              </div>

              {selectedCompra.erro_mensagem && (
                <div>
                  <h3 className="font-semibold mb-2 text-red-600">Erro</h3>
                  <div className="bg-red-50 p-4 rounded text-sm">
                    <p className="font-mono">{selectedCompra.erro_mensagem}</p>
                  </div>
                </div>
              )}

              {selectedCompra.erro_stack && (
                <div>
                  <h3 className="font-semibold mb-2 text-red-600">Stack Trace</h3>
                  <div className="bg-red-50 p-4 rounded text-xs font-mono overflow-x-auto">
                    <pre>{selectedCompra.erro_stack}</pre>
                  </div>
                </div>
              )}

              {selectedCompra.webhook_payload && (
                <div>
                  <h3 className="font-semibold mb-2">Payload do Webhook</h3>
                  <div className="bg-muted p-4 rounded text-xs font-mono overflow-x-auto">
                    <pre>{JSON.stringify(selectedCompra.webhook_payload, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
