
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

interface SalvarCalculoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSalvar: (dados: { nome: string; email?: string; telefone?: string }) => Promise<void>;
  isLoading: boolean;
}

const SalvarCalculoModal: React.FC<SalvarCalculoModalProps> = ({
  isOpen,
  onClose,
  onSalvar,
  isLoading
}) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome.trim()) {
      return;
    }

    try {
      await onSalvar({
        nome: formData.nome.trim(),
        email: formData.email.trim() || undefined,
        telefone: formData.telefone.trim() || undefined
      });
      
      // Reset form and close modal on success
      setFormData({ nome: '', email: '', telefone: '' });
      onClose();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ nome: '', email: '', telefone: '' });
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
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-glass">
              Nome completo *
            </Label>
            <Input
              id="nome"
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              className="bg-glass/10 border-glass text-white placeholder:text-glass/60"
              placeholder="Digite seu nome completo"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-glass">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="bg-glass/10 border-glass text-white placeholder:text-glass/60"
              placeholder="seu.email@exemplo.com"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone" className="text-glass">
              Telefone
            </Label>
            <Input
              id="telefone"
              type="tel"
              value={formData.telefone}
              onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
              className="bg-glass/10 border-glass text-white placeholder:text-glass/60"
              placeholder="(11) 99999-9999"
              disabled={isLoading}
            />
          </div>

          <div className="flex space-x-3 pt-4">
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
              disabled={isLoading || !formData.nome.trim()}
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
          * Campos obrigatórios. Seus dados serão utilizados apenas para organizar seus cálculos e futuras consultas.
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default SalvarCalculoModal;
