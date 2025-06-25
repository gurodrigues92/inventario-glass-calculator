
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const SearchBar = ({ searchTerm, onSearchChange }: SearchBarProps) => {
  return (
    <div className="mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#476D9E] w-4 h-4" />
        <Input
          type="text"
          placeholder="Buscar por nome, email ou estado..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white/90 border-[#E8E2DD] text-[#2C2C2C] placeholder:text-[#476D9E]/60"
        />
      </div>
    </div>
  );
};

export default SearchBar;
