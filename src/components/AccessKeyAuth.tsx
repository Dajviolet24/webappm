
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface AccessKeyAuthProps {
  onAuthSuccess: () => void;
}

const AccessKeyAuth: React.FC<AccessKeyAuthProps> = ({ onAuthSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if the access key exists
      const { data: accessKey, error } = await supabase
        .from('access_keys')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error || !accessKey) {
        toast.error('Credenciales de acceso inválidas');
        setIsLoading(false);
        return;
      }

      // Delete the used access key
      const { error: deleteError } = await supabase
        .from('access_keys')
        .delete()
        .eq('id', accessKey.id);

      if (deleteError) {
        console.error('Error deleting access key:', deleteError);
      }

      // Store authentication in localStorage
      localStorage.setItem('accessAuth', 'true');
      toast.success('Acceso concedido exitosamente');
      onAuthSuccess();

    } catch (error) {
      console.error('Authentication error:', error);
      toast.error('Error de autenticación');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-movieDark flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-secondary shadow-xl">
        <CardHeader className="text-center">
          <img 
            src="https://i.ibb.co/SD8qLXh1/20250701-144950.png" 
            alt="Astronauta TV Logo" 
            className="h-16 w-auto mx-auto mb-4 object-contain"
          />
          <CardTitle className="text-2xl">Bienvenido a Astronauta TV</CardTitle>
          <p className="text-muted-foreground">Ingresa tus credenciales de acceso</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Usuario
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Verificando...' : 'Acceder a la Plataforma'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessKeyAuth;
