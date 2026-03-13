import { ReactNode } from 'react';

interface MobileContainerProps {
  children: ReactNode;
  className?: string;
}

export function MobileContainer({ children, className = '' }: MobileContainerProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className={`w-full max-w-[430px] h-[932px] bg-background rounded-[40px] shadow-2xl overflow-hidden relative ${className}`}>
        {children}
      </div>
    </div>
  );
}
