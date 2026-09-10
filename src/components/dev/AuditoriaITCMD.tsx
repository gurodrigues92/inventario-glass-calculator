import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  executarAuditoriaITCMD, 
  gerarRelatorioAuditoria, 
  testarEstadosSuspeitos,
  type ResumoAuditoria,
  type ResultadoAuditoria,
  type EstadoSuspeito,
  type FaixaDetalhada
} from '../../utils/auditoria/itcmdAuditoria';
import { formatCurrency } from '../../utils/formatters';

const AuditoriaITCMD = () => {
  const [resumoAuditoria, setResumoAuditoria] = useState<ResumoAuditoria | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [estadosSuspeitos, setEstadosSuspeitos] = useState<Record<string, EstadoSuspeito> | null>(null);

  const executarAuditoria = async () => {
    setCarregando(true);
    try {
      const resumo = executarAuditoriaITCMD(5000000);
      setResumoAuditoria(resumo);
      
      const suspeitos = testarEstadosSuspeitos();
      setEstadosSuspeitos(suspeitos);
    } catch (error) {
      console.error('Erro na auditoria:', error);
    } finally {
      setCarregando(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OK':
        return 'bg-green-500';
      case 'DISCREPANCIA':
        return 'bg-yellow-500';
      case 'ERRO':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const baixarRelatorio = () => {
    if (!resumoAuditoria) return;
    
    const relatorio = gerarRelatorioAuditoria(resumoAuditoria);
    const blob = new Blob([relatorio], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria-itcmd-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Auditoria Completa - Cálculos ITCMD
          </CardTitle>
          <p className="text-center text-muted-foreground">
            Verificação de consistência entre exibição e cálculos reais para todos os estados
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={executarAuditoria} 
              disabled={carregando}
              size="lg"
            >
              {carregando ? 'Executando Auditoria...' : 'Executar Auditoria Completa'}
            </Button>
            
            {resumoAuditoria && (
              <Button 
                onClick={baixarRelatorio}
                variant="outline"
                size="lg"
              >
                Baixar Relatório
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {resumoAuditoria && (
        <Tabs defaultValue="resumo" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resumo">Resumo Geral</TabsTrigger>
            <TabsTrigger value="discrepancias">Discrepâncias</TabsTrigger>
            <TabsTrigger value="suspeitos">Estados Suspeitos</TabsTrigger>
          </TabsList>

          <TabsContent value="resumo" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {resumoAuditoria.totalEstados}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total de Estados
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {resumoAuditoria.estadosOK}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Estados OK
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {resumoAuditoria.estadosComDiscrepancia}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Com Discrepância
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {resumoAuditoria.estadosComErro}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Com Erro
                  </div>
                </CardContent>
              </Card>
            </div>

            {resumoAuditoria.estadosOK === resumoAuditoria.totalEstados ? (
              <Alert>
                <AlertDescription className="text-green-700">
                  ✅ Todos os estados passaram na auditoria! Os cálculos estão consistentes.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <AlertDescription className="text-yellow-700">
                  ⚠️ {resumoAuditoria.estadosComDiscrepancia + resumoAuditoria.estadosComErro} estados precisam de atenção.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="discrepancias" className="space-y-4">
            {resumoAuditoria.discrepanciasEncontradas.length === 0 ? (
              <Alert>
                <AlertDescription className="text-green-700">
                  ✅ Nenhuma discrepância encontrada!
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {resumoAuditoria.discrepanciasEncontradas.map((resultado: ResultadoAuditoria) => (
                  <Card key={resultado.uf} className="border-l-4 border-l-yellow-500">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          {resultado.uf} - {resultado.nome}
                        </CardTitle>
                        <Badge className={getStatusColor(resultado.status)}>
                          {resultado.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <strong>Tipo:</strong> {resultado.tipo}
                        </div>
                        <div>
                          <strong>Alíquota Exibida:</strong> {resultado.aliquotaExibida}
                        </div>
                        <div>
                          <strong>Valor Calculado:</strong> {formatCurrency(resultado.valorCalculado)}
                        </div>
                        <div>
                          <strong>Alíquota Efetiva:</strong> {resultado.aliquotaEfetiva.toFixed(2)}%
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <strong>Observações:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          {resultado.observacoes.map((obs, index) => (
                            <li key={index} className="text-sm text-muted-foreground">
                              {obs}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="suspeitos" className="space-y-4">
            {estadosSuspeitos && (
              <div className="space-y-4">
                <Alert>
                  <AlertDescription>
                    Análise detalhada dos estados com cálculos progressivos mais complexos.
                  </AlertDescription>
                </Alert>
                
                {Object.entries(estadosSuspeitos).map(([uf, dados]: [string, EstadoSuspeito]) => (
                  <Card key={uf}>
                    <CardHeader>
                      <CardTitle>{uf} - {dados.nome}</CardTitle>
                      <div className="flex gap-4 text-sm">
                        <span><strong>Imposto Total:</strong> {formatCurrency(dados.impostoTotal)}</span>
                        <span><strong>Alíquota Efetiva:</strong> {dados.aliquotaEfetiva}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-2">Faixa</th>
                              <th className="text-left p-2">Alíquota</th>
                              <th className="text-left p-2">Valor de Incidência</th>
                              <th className="text-left p-2">Imposto da Faixa</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dados.calculoDetalhado.map((faixa: FaixaDetalhada, index: number) => (
                              <tr key={index} className="border-b">
                                <td className="p-2">{faixa.faixa}</td>
                                <td className="p-2">{faixa.aliquota}</td>
                                <td className="p-2">{formatCurrency(faixa.valorIncidencia)}</td>
                                <td className="p-2">{formatCurrency(faixa.impostoFaixa)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AuditoriaITCMD;