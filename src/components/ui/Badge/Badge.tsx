'use client';

import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'live';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  const classNames = [styles.badge, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ');

  return <span className={classNames}>{children}</span>;
}

// Preset badges for common use cases
export function LiveBadge({ className = '' }: { className?: string }) {
  return (
    <Badge variant="live" size="sm" className={className}>
      <span className={styles.liveIndicator} />
      AO VIVO
    </Badge>
  );
}

export function ScheduledBadge({ className = '' }: { className?: string }) {
  return (
    <Badge variant="primary" size="sm" className={className}>
      AGENDADA
    </Badge>
  );
}

export function EndedBadge({ className = '' }: { className?: string }) {
  return (
    <Badge variant="default" size="sm" className={className}>
      ENCERRADA
    </Badge>
  );
}

export interface LevelBadgeProps {
  level: 'beginner' | 'intermediate' | 'advanced';
  className?: string;
}

const levelLabels = {
  beginner: 'Iniciante',
  intermediate: 'Intermediário',
  advanced: 'Avançado',
};

export function LevelBadge({ level, className = '' }: LevelBadgeProps) {
  return (
    <span className={`${styles.levelBadge} ${styles[`level-${level}`]} ${className}`}>
      {levelLabels[level]}
    </span>
  );
}

export interface DebateTypeBadgeProps {
  type: 'human-vs-human' | 'human-vs-ai';
  className?: string;
}

const typeLabels = {
  'human-vs-human': 'Humano vs Humano',
  'human-vs-ai': 'Humano vs IA',
};

export function DebateTypeBadge({ type, className = '' }: DebateTypeBadgeProps) {
  return (
    <span className={`${styles.typeBadge} ${className}`}>
      {type === 'human-vs-ai' && <span className={styles.aiIcon}>🤖</span>}
      {typeLabels[type]}
    </span>
  );
}
