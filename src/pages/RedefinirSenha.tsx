import { Navigate, useSearchParams } from 'react-router-dom';

// ponytail: a senha nao vive mais no Auth nativo, entao redefinir e definir sao o
// mesmo caminho (edge function definir-senha aceita token de ativacao e de recuperacao).
// Esta rota so existe pros links de e-mail antigos que apontam pra /redefinir-senha.
export default function RedefinirSenha() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  return <Navigate to={token ? `/definir-senha?token=${token}` : '/recuperar-senha'} replace />;
}
