
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Database, BarChart3 } from 'lucide-react';

const AdminNavigation = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex space-x-2">
        <Button
          onClick={() => navigate('/calculos-salvos')}
          variant="outline"
          size="sm"
          className="bg-glass/10 backdrop-blur-sm border-glass text-glass hover:bg-glass/20 hover:text-white"
          title="Ver cálculos salvos"
        >
          <Database className="w-4 h-4 mr-2" />
          Cálculos Salvos
        </Button>
      </div>
    </div>
  );
};

export default AdminNavigation;
