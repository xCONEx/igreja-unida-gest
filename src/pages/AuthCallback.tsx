
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const AuthCallback = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Processando callback de autenticação...')
        
        // Obter a sessão do Supabase
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro na sessão:', error)
          throw new Error(error.message);
        }

        if (!session?.user) {
          console.error('Sessão não encontrada')
          throw new Error('Sessão não encontrada');
        }

        console.log('Usuário autenticado:', session.user.email)
        
        setStatus('success');
        setMessage('Login realizado com sucesso!');
        
        // Redirecionar após 2 segundos
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);

      } catch (error: any) {
        console.error('Erro no callback:', error);
        setStatus('error');
        setMessage(error.message || 'Erro ao processar login');
        
        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'loading' && (
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="h-12 w-12 text-green-600" />
            )}
            {status === 'error' && (
              <XCircle className="h-12 w-12 text-red-600" />
            )}
          </div>
          <CardTitle>
            {status === 'loading' && 'Processando login...'}
            {status === 'success' && 'Login realizado!'}
            {status === 'error' && 'Erro no login'}
          </CardTitle>
          <CardDescription>
            {status === 'loading' && 'Aguarde enquanto processamos sua autenticação...'}
            {status === 'success' && 'Redirecionando para o dashboard...'}
            {status === 'error' && message}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {status === 'loading' && (
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                Verificando suas credenciais...
              </div>
            </div>
          )}
          {status === 'success' && (
            <div className="space-y-2">
              <div className="text-sm text-green-600">
                Bem-vindo! Você será redirecionado em instantes.
              </div>
            </div>
          )}
          {status === 'error' && (
            <div className="space-y-2">
              <div className="text-sm text-red-600">
                Redirecionando para a página de login...
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
