import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { MessageCircle, Star } from 'lucide-react';
import stefanyImage from '../assets/stefany-herzog.png';
import ketlenImage from '../assets/ketlen-marin.png';

interface SpecialistSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SpecialistSelectionDialog = ({ open, onOpenChange }: SpecialistSelectionDialogProps) => {
  const specialists = [
    {
      name: 'Ketlen Marin',
      image: ketlenImage,
      whatsapp: 'https://wa.me/+555181811898?text=Ol%C3%A1%2C%20fiz%20o%20calculo%20pela%20calculadora%20e%20preciso%20de%20uma%20orienta%C3%A7%C3%A3o%20por%20favor.',
      specialty: 'Especialista em Inventário',
      rating: 5.0
    },
    {
      name: 'Stefany Herzog',
      image: stefanyImage,
      whatsapp: 'https://wa.me/+555182055281?text=Ol%C3%A1%2C%20fiz%20o%20calculo%20pela%20calculadora%20e%20preciso%20de%20uma%20orienta%C3%A7%C3%A3o%20por%20favor.',
      specialty: 'Especialista em Planejamento Sucessório',
      rating: 5.0
    }
  ];

  const handleContactSpecialist = (whatsappUrl: string) => {
    window.open(whatsappUrl, '_blank');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[600px] p-0 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(12, 44, 69, 0.95), rgba(71, 109, 158, 0.95))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(209, 191, 163, 0.2)',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(12, 44, 69, 0.3)'
        }}
      >
        <DialogHeader className="p-8 pb-4">
          <DialogTitle 
            className="text-center text-3xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #D1BFA3, #E5D4B1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            Escolha seu Especialista
          </DialogTitle>
          <p className="text-center text-white/80 mt-2 text-lg">
            Conecte-se diretamente com nossos especialistas via WhatsApp
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 pt-4">
          {specialists.map((specialist) => (
            <div
              key={specialist.name}
              className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-105"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Card Content */}
              <div className="p-6 text-center">
                {/* Specialist Image */}
                <div className="relative mx-auto mb-4 w-24 h-24 rounded-full overflow-hidden">
                  <img 
                    src={specialist.image} 
                    alt={specialist.name}
                    className="w-full h-full object-cover"
                  />
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'linear-gradient(135deg, rgba(209, 191, 163, 0.3), rgba(229, 212, 177, 0.3))'
                    }}
                  />
                </div>

                {/* Specialist Info */}
                <h3 className="text-xl font-bold text-white mb-2">
                  {specialist.name}
                </h3>
                <p 
                  className="text-sm mb-3"
                  style={{ color: '#D1BFA3' }}
                >
                  {specialist.specialty}
                </p>

                {/* Rating */}
                <div className="flex items-center justify-center mb-4 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className="fill-current"
                      style={{ color: '#D1BFA3' }}
                    />
                  ))}
                  <span className="text-sm text-white/80 ml-2">
                    {specialist.rating}
                  </span>
                </div>

                {/* Contact Button */}
                <Button
                  onClick={() => handleContactSpecialist(specialist.whatsapp)}
                  className="w-full hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #D1BFA3, #E5D4B1)',
                    color: '#0C2C45',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                    padding: '14px 24px',
                    fontSize: '13px',
                    boxShadow: '0 4px 16px rgba(209, 191, 163, 0.3)',
                    pointerEvents: 'auto',
                    zIndex: 10
                  }}
                >
                  <MessageCircle size={16} className="mr-2" />
                  WhatsApp
                </Button>
              </div>

              {/* Hover Shimmer Effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 specialist-shimmer"
                style={{
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)'
                }}
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SpecialistSelectionDialog;