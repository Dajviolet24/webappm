
import React, { useState, useEffect } from 'react';
import AccessKeyAuth from './AccessKeyAuth';
import PrivacyPolicyStep from './PrivacyPolicyStep';
import UsernameStep from './UsernameStep';
import AvatarStep from './AvatarStep';

interface OnboardingFlowProps {
  onComplete: () => void;
}

interface UserData {
  username: string;
  avatar: string;
  privacyAccepted: boolean;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<'auth' | 'privacy' | 'username' | 'avatar'>('auth');
  const [userData, setUserData] = useState<Partial<UserData>>({});

  // Check if user has already completed onboarding
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('accessAuth') === 'true';
    const savedUserData = localStorage.getItem('userData');
    
    if (isAuthenticated && savedUserData) {
      onComplete();
    } else if (isAuthenticated) {
      setCurrentStep('privacy');
    }
  }, [onComplete]);

  const handleAuthSuccess = () => {
    setCurrentStep('privacy');
  };

  const handlePrivacyAccept = () => {
    setUserData(prev => ({ ...prev, privacyAccepted: true }));
    setCurrentStep('username');
  };

  const handlePrivacyDeny = () => {
    // Clear authentication and restart
    localStorage.removeItem('accessAuth');
    setCurrentStep('auth');
  };

  const handleUsernameNext = (username: string) => {
    setUserData(prev => ({ ...prev, username }));
    setCurrentStep('avatar');
  };

  const handleAvatarNext = (avatar: string) => {
    const finalUserData = { ...userData, avatar };
    
    // Save user data to localStorage
    localStorage.setItem('userData', JSON.stringify(finalUserData));
    localStorage.setItem('onboardingComplete', 'true');
    
    onComplete();
  };

  switch (currentStep) {
    case 'auth':
      return <AccessKeyAuth onAuthSuccess={handleAuthSuccess} />;
    case 'privacy':
      return <PrivacyPolicyStep onAccept={handlePrivacyAccept} onDeny={handlePrivacyDeny} />;
    case 'username':
      return <UsernameStep onNext={handleUsernameNext} />;
    case 'avatar':
      return <AvatarStep onNext={handleAvatarNext} />;
    default:
      return null;
  }
};

export default OnboardingFlow;
