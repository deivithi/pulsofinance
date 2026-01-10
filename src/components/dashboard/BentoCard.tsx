import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

interface BentoCardProps {
  title: string;
  icon: LucideIcon;
  iconColor?: string;
  children: ReactNode;
  className?: string;
  link?: {
    to: string;
    label: string;
  };
  isLoading?: boolean;
}

export function BentoCard({
  title,
  icon: Icon,
  iconColor = 'text-primary',
  children,
  className = '',
  link,
  isLoading = false,
}: BentoCardProps) {
  if (isLoading) {
    return (
      <div className={`glass-card rounded-2xl p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-8 w-32" />
      </div>
    );
  }

  return (
    <div className={`glass-card rounded-2xl p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        {link && (
          <Link
            to={link.to}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            {link.label} →
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}
