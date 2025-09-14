'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface NoPrefetchLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

/**
 * Custom Link component that always disables prefetching
 * This prevents _rsc errors in AWS Amplify deployments
 */
export default function NoPrefetchLink({ href, className, children, onClick }: NoPrefetchLinkProps) {
  return (
    <Link href={href} className={className} prefetch={false} onClick={onClick}>
      {children}
    </Link>
  );
}
