import React, { useState } from 'react';
import { executarTestes, testarEstado } from '../../utils/calculators/validationTests';

const ValidationPanel = () => {
  const [showPanel, setShowPanel] = useState(false);
  const [testUf, setTestUf] = useState('RN');
  const [testPatrimonio, setTestPatrimonio] = useState('10800600');
  const [testHistorico, setTestHistorico] = useState('3342000');

  // Só mostrar em desenvolvimento
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const handleRunAllTests = () => {
    console.clear();
    executarTestes();
  };

  const handleRunSingleTest = () => {
    console.clear();
    testarEstado(
      testUf, 
      parseInt(testPatrimonio.replace(/\D/g, '')), 
      parseInt(testHistorico.replace(/\D/g, ''))
    );
  };

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '20px', 
      right: '20px', 
      zIndex: 9999,
      background: '#000',
      color: '#fff',
      padding: '10px',
      borderRadius: '8px',
      fontSize: '12px',
      fontFamily: 'monospace'
    }}>
      <button 
        onClick={() => setShowPanel(!showPanel)}
        style={{
          background: '#333',
          color: '#fff',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {showPanel ? '✕ Fechar' : '🧪 Testes ITCMD'}
      </button>
      
      {showPanel && (
        <div style={{ 
          marginTop: '10px', 
          padding: '10px',
          background: '#111',
          borderRadius: '4px',
          minWidth: '250px'
        }}>
          <div style={{ marginBottom: '10px' }}>
            <button 
              onClick={handleRunAllTests}
              style={{
                background: '#007acc',
                color: '#fff',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%',
                marginBottom: '8px'
              }}
            >
              ▶️ Executar Todos os Testes
            </button>
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <div style={{ marginBottom: '4px' }}>Teste Individual:</div>
            <select 
              value={testUf} 
              onChange={(e) => setTestUf(e.target.value)}
              style={{
                width: '100%',
                padding: '4px',
                marginBottom: '4px',
                background: '#222',
                color: '#fff',
                border: '1px solid #444'
              }}
            >
              <option value="RN">RN - Fixa 3%</option>
              <option value="RS">RS - Progressiva</option>
              <option value="SP">SP - Progressiva</option>
              <option value="SC">SC - Progressiva</option>
              <option value="RJ">RJ - Progressiva</option>
            </select>
            
            <input 
              type="text" 
              placeholder="Patrimônio"
              value={testPatrimonio}
              onChange={(e) => setTestPatrimonio(e.target.value)}
              style={{
                width: '100%',
                padding: '4px',
                marginBottom: '4px',
                background: '#222',
                color: '#fff',
                border: '1px solid #444'
              }}
            />
            
            <input 
              type="text" 
              placeholder="Valor Histórico IR"
              value={testHistorico}
              onChange={(e) => setTestHistorico(e.target.value)}
              style={{
                width: '100%',
                padding: '4px',
                marginBottom: '8px',
                background: '#222',
                color: '#fff',
                border: '1px solid #444'
              }}
            />
            
            <button 
              onClick={handleRunSingleTest}
              style={{
                background: '#28a745',
                color: '#fff',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              🎯 Testar
            </button>
          </div>
          
          <div style={{ fontSize: '10px', color: '#888' }}>
            Abra o console (F12) para ver os resultados
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationPanel;