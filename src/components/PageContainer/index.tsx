import React from 'react';
import { cn } from '../../lib/utils';

export default function PageContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn('', className)}>{children}</div>;
}
