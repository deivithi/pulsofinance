import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'h-10',     // 40px - Footer
  md: 'h-14',     // 56px - Header, Sidebar
  lg: 'h-20',     // 80px - Destaques
  xl: 'h-32',     // 128px - Auth screens (ponto focal)
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
