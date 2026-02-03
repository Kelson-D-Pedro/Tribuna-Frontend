'use client';

import React from 'react';
import styles from './Avatar.module.css';

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'speaking' | 'idle' | 'offline';
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Avatar({
  src,
  alt,
  name = '',
  size = 'md',
  status,
  className = '',
}: AvatarProps) {
  const classNames = [styles.avatar, styles[size], className].filter(Boolean).join(' ');

  return (
    <div className={classNames}>
      {src ? (
        <img src={src} alt={alt || name} className={styles.image} />
      ) : (
        <span className={styles.initials}>{getInitials(name) || '?'}</span>
      )}
      {status && <span className={`${styles.status} ${styles[`status-${status}`]}`} />}
    </div>
  );
}

export interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function AvatarGroup({
  children,
  max = 4,
  size = 'md',
  className = '',
}: AvatarGroupProps) {
  const childrenArray = React.Children.toArray(children);
  const visibleChildren = childrenArray.slice(0, max);
  const remainingCount = childrenArray.length - max;

  return (
    <div className={`${styles.avatarGroup} ${className}`}>
      {visibleChildren.map((child, index) => (
        <div key={index} className={styles.avatarGroupItem}>
          {React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<AvatarProps>, { size })
            : child}
        </div>
      ))}
      {remainingCount > 0 && (
        <div className={`${styles.avatar} ${styles[size]} ${styles.remaining}`}>
          <span className={styles.initials}>+{remainingCount}</span>
        </div>
      )}
    </div>
  );
}
