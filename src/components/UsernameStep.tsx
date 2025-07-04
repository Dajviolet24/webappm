
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface UsernameStepProps {
  onNext: (username: string) => void;
}

const UsernameStep: React.FC<UsernameStepProps> = ({ onNext }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onNext(username.trim());
    }
  };

  return (
    <div className="min-h-screen bg-movieDark flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-secondary shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">¿Cómo te gustaría que te llamemos?</CardTitle>
          <p className="text-muted-foreground">Elige un nombre para mostrar en tu perfil</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Nombre de Usuario
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu nombre preferido"
                maxLength={20}
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={!username.trim()}>
              Continuar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsernameStep;
