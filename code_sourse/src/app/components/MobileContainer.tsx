import { ReactNode } from 'react';

interface MobileContainerProps {
  children: ReactNode;
  className?: string;
}

export function MobileContainer({ children, className = '' }: MobileContainerProps) {
  return (
    <div className="min-h-screen bg-background sm:flex sm:items-center sm:justify-center sm:p-4">
      <div className={`w-full h-[100dvh] sm:max-w-[430px] sm:h-[932px] bg-background sm:rounded-[40px] sm:shadow-2xl overflow-hidden relative flex flex-col ${className}`}>
        {children}
      </div>
    </div>
  );
}
