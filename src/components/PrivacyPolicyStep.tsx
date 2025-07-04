
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PrivacyPolicyStepProps {
  onAccept: () => void;
  onDeny: () => void;
}

const PrivacyPolicyStep: React.FC<PrivacyPolicyStepProps> = ({ onAccept, onDeny }) => {
  return (
    <div className="min-h-screen bg-movieDark flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-secondary shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Política de Privacidad</CardTitle>
          <p className="text-muted-foreground">Por favor, lee y acepta nuestra política de privacidad para continuar</p>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64 w-full rounded border p-4 bg-background">
            <div className="space-y-4 text-sm">
              <p>
                Astronauta TV no solicita permisos de acceso a sus dispositivos móviles, ni tampoco requiere datos privados de los usuarios. No pedimos acceso a sus credenciales ni a información de tarjetas privadas.
              </p>
              
              <p>
                En Astronauta TV, la privacidad de sus datos es fundamental. No tenemos acceso a su información personal; el uso de nuestra plataforma es completamente independiente y privado para cada usuario.
              </p>
              
              <p>
                Es importante señalar que Astronauta TV opera como un servicio de indexación y búsqueda de contenido. Queremos aclarar que no almacenamos ningún tipo de archivo en nuestros servidores.
              </p>
            </div>
          </ScrollArea>
          
          <div className="flex gap-4 mt-6">
            <Button variant="outline" onClick={onDeny} className="flex-1">
              Denegar
            </Button>
            <Button onClick={onAccept} className="flex-1">
              Aceptar y Continuar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrivacyPolicyStep;
