import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LogoutButtonProps {
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  onClick, 
  className = '', 
  variant = 'outline' 
}) => {
  return (
    <Button
      onClick={onClick}
      variant={variant}
      className={className}
    >
      <LogOut className="w-4 h-4 mr-2" />
      Keluar
    </Button>
  );
};
