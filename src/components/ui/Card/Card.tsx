'use client';

import React from 'react';
import styles from './Card.module.css';

export interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  as?: 'div' | 'article' | 'section';
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  style,
  onClick,
  as: Component = 'div',
}: CardProps) {
  const classNames = [
    styles.card,
    styles[variant],
    styles[`padding-${padding}`],
    onClick ? styles.clickable : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component
      className={classNames}
      style={style}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e: React.KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </Component>
  );
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return <div className={`${styles.header} ${className}`}>{children}</div>;
}

export interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`${styles.content} ${className}`}>{children}</div>;
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return <div className={`${styles.footer} ${className}`}>{children}</div>;
}
