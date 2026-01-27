import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  tipoFiltro: string;
  onTipoFiltroChange: (value: string) => void;
}

const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  tipoFiltro, 
  onTipoFiltroChange 
}: SearchBarProps) => {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Campo de busca principal */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#476D9E] w-4 h-4" />
          <Input
            type="text"
            placeholder="Buscar por estado, valor ou data..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white/90 border-[#E8E2DD] text-[#2C2C2C] placeholder:text-[#476D9E]/60"
          />
        </div>

        {/* Filtro por tipo de processo */}
        <div className="w-full sm:w-48">
          <Select value={tipoFiltro} onValueChange={onTipoFiltroChange}>
            <SelectTrigger className="bg-white/90 border-[#E8E2DD] text-[#2C2C2C]">
              <Filter className="w-4 h-4 mr-2 text-[#476D9E]" />
              <SelectValue placeholder="Tipo de processo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="extrajudicial">Extrajudicial</SelectItem>
              <SelectItem value="judicial">Judicial</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Dica de busca */}
      <p className="text-xs text-[#476D9E]/70">
        Dica: Você pode buscar por estado (ex: "SP"), valor (ex: "500000") ou data (ex: "27/01")
      </p>
    </div>
  );
};

export default SearchBar;
