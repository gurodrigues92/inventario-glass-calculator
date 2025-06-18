
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResultsPageHeaderProps {
  onSave: () => void;
  isSaving: boolean;
  calculoSalvoId: string | null;
}

const ResultsPageHeader = ({ onSave, isSaving, calculoSalvoId }: ResultsPageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-glass hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar</span>
      </button>

      <Button
        onClick={onSave}
        disabled={isSaving}
        className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-6 py-2"
      >
        <Save className="w-4 h-4 mr-2" />
        {calculoSalvoId ? 'Cálculo Salvo' : 'Salvar Cálculo'}
      </Button>
    </div>
  );
};

export default ResultsPageHeader;
