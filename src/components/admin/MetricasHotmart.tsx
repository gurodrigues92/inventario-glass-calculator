import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Clock, AlertCircle } from "lucide-react";

interface MetricasProps {
  totalCompras: number;
  taxaSucesso: number;
  comprasComErro: number;
  tempoMedio: number;
  loading?: boolean;
}

export function MetricasHotmart({
  totalCompras,
  taxaSucesso,
  comprasComErro,
  tempoMedio,
  loading = false
}: MetricasProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-muted rounded w-3/4"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total de Compras</p>
            <p className="text-3xl font-bold mt-2">{totalCompras}</p>
          </div>
          <TrendingUp className="h-8 w-8 text-primary opacity-50" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
            <p className={`text-3xl font-bold mt-2 ${
              taxaSucesso >= 90 ? 'text-green-600' : 
              taxaSucesso >= 70 ? 'text-yellow-600' : 
              'text-red-600'
            }`}>
              {taxaSucesso.toFixed(1)}%
            </p>
          </div>
          {taxaSucesso >= 90 ? (
            <TrendingUp className="h-8 w-8 text-green-600 opacity-50" />
          ) : (
            <TrendingDown className="h-8 w-8 text-red-600 opacity-50" />
          )}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Compras com Erro</p>
            <p className="text-3xl font-bold mt-2 text-red-600">{comprasComErro}</p>
          </div>
          <AlertCircle className="h-8 w-8 text-red-600 opacity-50" />
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Tempo Médio</p>
            <p className="text-3xl font-bold mt-2">{tempoMedio}ms</p>
          </div>
          <Clock className="h-8 w-8 text-primary opacity-50" />
        </div>
      </Card>
    </div>
  );
}
