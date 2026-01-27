import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft, Gem } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-animated flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div 
            className="logo-diamond"
            style={{
              width: '64px',
              height: '64px',
              background: '#0C2C45',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(12, 44, 69, 0.2)',
              transform: 'rotate(45deg)',
            }}
          >
            <div style={{ transform: 'rotate(-45deg)' }}>
              <Gem size={32} color="#FFFFFF" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        {/* Error Code */}
        <h1 
          className="text-8xl font-bold mb-4"
          style={{ 
            background: 'linear-gradient(135deg, #0C2C45, #476D9E)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          404
        </h1>

        {/* Message */}
        <h2 
          className="text-2xl font-semibold mb-3"
          style={{ color: '#0C2C45' }}
        >
          Página não encontrada
        </h2>
        <p 
          className="text-lg mb-8"
          style={{ color: '#476D9E' }}
        >
          A página que você está procurando não existe ou foi movida.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center space-x-2 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #0C2C45, #476D9E)',
              color: '#FFFFFF',
              boxShadow: '0 4px 16px rgba(12, 44, 69, 0.2)',
            }}
          >
            <Home size={20} />
            <span>Ir para Início</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center space-x-2 font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            style={{
              background: 'transparent',
              color: '#476D9E',
              border: '2px solid #E8E2DD',
            }}
          >
            <ArrowLeft size={20} />
            <span>Voltar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
