import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'h-6',
  md: 'h-8',
  lg: 'h-10',
  xl: 'h-14',
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
