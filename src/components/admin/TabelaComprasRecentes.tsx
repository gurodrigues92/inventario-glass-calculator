import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Compra {
  id: string;
  email: string;
  nome: string;
  status: string;
  created_at: string;
  tempo_processamento_ms?: number;
  erro_mensagem?: string;
}

interface TabelaComprasRecentesProps {
  compras: Compra[];
  onVerDetalhes: (compra: Compra) => void;
  loading?: boolean;
}

const statusConfig: Record<string, { label: string; variant: "default" | "destructive" | "outline" | "secondary" }> = {
  'webhook_recebido': { label: 'Webhook Recebido', variant: 'outline' },
  'usuario_criado': { label: 'Usuário Criado', variant: 'secondary' },
  'usuario_atualizado': { label: 'Usuário Atualizado', variant: 'secondary' },
  'email_enviado': { label: 'Sucesso ✓', variant: 'default' },
  'erro_validacao': { label: 'Erro Validação', variant: 'destructive' },
  'erro_banco': { label: 'Erro Banco', variant: 'destructive' },
  'erro_email': { label: 'Erro Email', variant: 'destructive' },
};

export function TabelaComprasRecentes({ compras, onVerDetalhes, loading = false }: TabelaComprasRecentesProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-muted rounded animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (compras.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-lg">Nenhuma compra registrada ainda.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data/Hora</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Tempo</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {compras.map((compra) => {
            const statusInfo = statusConfig[compra.status] || { label: compra.status, variant: 'default' as const };
            
            return (
              <TableRow key={compra.id}>
                <TableCell className="font-mono text-xs">
                  {format(new Date(compra.created_at), "dd/MM/yy HH:mm:ss", { locale: ptBR })}
                </TableCell>
                <TableCell className="font-medium">{compra.email}</TableCell>
                <TableCell>{compra.nome}</TableCell>
                <TableCell>
                  <Badge variant={statusInfo.variant}>
                    {statusInfo.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">
                  {compra.tempo_processamento_ms ? `${compra.tempo_processamento_ms}ms` : '-'}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onVerDetalhes(compra)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
