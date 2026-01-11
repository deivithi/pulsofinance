import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'h-7',      // 28px - Footer, contextos secundários
  md: 'h-10',     // 40px - Header, Sidebar
  lg: 'h-12',     // 48px - Destaques médios
  xl: 'h-20',     // 80px - Telas de Auth (ponto focal)
};

export function Logo({ size = 'md', showText = true, className }: LogoProps) {
  return (
    <img
      src="/logo.png"
      alt="Pulso"
      className={cn(
        sizeMap[size],
        'w-auto object-contain',
        className
      )}
    />
  );
}
