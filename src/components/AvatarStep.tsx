
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface AvatarStepProps {
  onNext: (avatarUrl: string) => void;
}

const avatars = [
  'https://i.ibb.co/kVQFfkqg/avatar-1.png',
  'https://i.ibb.co/zHRTm7Tw/avatar-2.png',
  'https://i.ibb.co/DPSnr41X/avatar-3.png',
  'https://i.ibb.co/RkN7wc86/avatar-4.png',
  'https://i.ibb.co/6JpkLLf3/avatar-5.png'
];

const AvatarStep: React.FC<AvatarStepProps> = ({ onNext }) => {
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');

  const handleSubmit = () => {
    if (selectedAvatar) {
      onNext(selectedAvatar);
    }
  };

  return (
    <div className="min-h-screen bg-movieDark flex items-center justify-center p-4">
      <Card className="w-full max-w-lg bg-secondary shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Elige Tu Avatar</CardTitle>
          <p className="text-muted-foreground">Selecciona un avatar para representar tu perfil</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
            {avatars.map((avatar, index) => (
              <div key={index} className="flex justify-center">
                <button
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`relative rounded-full overflow-hidden transition-all duration-300 ${
                    selectedAvatar === avatar 
                      ? 'ring-4 ring-primary scale-110 shadow-lg' 
                      : 'hover:scale-105 hover:shadow-md'
                  }`}
                >
                  <img
                    src={avatar}
                    alt={`Avatar ${index + 1}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full"
                  />
                  {selectedAvatar === avatar && (
                    <div className="absolute inset-0 bg-primary/20 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>
          
          <Button 
            onClick={handleSubmit} 
            className="w-full py-3 text-lg" 
            disabled={!selectedAvatar}
          >
            Completar Configuración
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvatarStep;
