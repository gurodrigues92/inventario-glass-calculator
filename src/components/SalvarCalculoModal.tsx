
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface SalvarCalculoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSalvar: (dados: { nome: string }) => Promise<void>;
  isLoading: boolean;
}

const SalvarCalculoModal: React.FC<SalvarCalculoModalProps> = ({
  isOpen,
  onClose,
  onSalvar,
  isLoading
}) => {
  const [nome, setNome] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome.trim()) {
      return;
    }

    try {
      await onSalvar({
        nome: nome.trim()
      });
      
      // Reset form and close modal on success
      setNome('');
      onClose();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setNome('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-glass backdrop-blur-xl border-glass max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-semibold">
            Salvar Cálculo
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-glass">
              Seu nome
            </Label>
            <Input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="bg-glass/10 border-glass text-white placeholder:text-glass/60"
              placeholder="Digite seu nome"
              required
              disabled={isLoading}
            />
          </div>

          <div className="flex space-x-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 border-glass text-glass hover:bg-glass/10"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !nome.trim()}
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar Cálculo'
              )}
            </Button>
          </div>
        </form>

        <p className="text-glass/60 text-xs mt-4">
          Seu cálculo será salvo e você poderá acessá-lo na página "Meus Cálculos".
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default SalvarCalculoModal;
